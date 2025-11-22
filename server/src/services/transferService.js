import sequelize from "../config/db.js";
import {
  Transfer,
  TransferLine,
  Location,
  Product,
  Stock,
  StockMovement,
  User,
} from "../models/index.js";
import logger from "../config/logger.js";

const generateTransferId = async () => {
  const lastTransfer = await Transfer.findOne({
    order: [["transfer_key", "DESC"]],
  });
  
  const nextNumber = lastTransfer ? parseInt(lastTransfer.transfer_id.split("-")[1]) + 1 : 1;
  return `TRF-${String(nextNumber).padStart(5, "0")}`;
};

export const getTransfers = async () => {
  try {
    const transfers = await Transfer.findAll({
      include: [
        {
          model: Location,
          as: "source",
          attributes: ["location_key", "location_name"],
        },
        {
          model: Location,
          as: "destination",
          attributes: ["location_key", "location_name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
        {
          model: User,
          as: "validator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
        {
          model: TransferLine,
          as: "lines",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_key", "product_name", "sku", "uom"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return transfers;
  } catch (error) {
    logger.error("Error in getTransfers:", error);
    throw error;
  }
};

export const getTransfer = async (transferKey) => {
  try {
    const transfer = await Transfer.findByPk(transferKey, {
      include: [
        {
          model: Location,
          as: "source",
          attributes: ["location_key", "location_name"],
        },
        {
          model: Location,
          as: "destination",
          attributes: ["location_key", "location_name"],
        },
        {
          model: User,
          as: "creator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
        {
          model: User,
          as: "validator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
        {
          model: TransferLine,
          as: "lines",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["product_key", "product_name", "sku", "uom"],
            },
          ],
        },
      ],
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    return transfer;
  } catch (error) {
    logger.error("Error in getTransfer:", error);
    throw error;
  }
};

export const createTransfer = async (transferData, userKey) => {
  const transaction = await sequelize.transaction();

  try {
    if (transferData.source_location_key === transferData.destination_location_key) {
      throw new Error("Source and destination locations must be different");
    }

    const transferId = await generateTransferId();

    const transfer = await Transfer.create(
      {
        transfer_id: transferId,
        source_location_key: transferData.source_location_key,
        destination_location_key: transferData.destination_location_key,
        transfer_date: transferData.transfer_date || new Date(),
        notes: transferData.notes,
        created_by: userKey,
      },
      { transaction }
    );

    if (transferData.lines && transferData.lines.length > 0) {
      const lines = transferData.lines.map((line) => ({
        transfer_key: transfer.transfer_key,
        product_key: line.product_key,
        quantity: line.quantity,
      }));

      await TransferLine.bulkCreate(lines, { transaction });
    }

    await transaction.commit();

    return await getTransfer(transfer.transfer_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in createTransfer:", error);
    throw error;
  }
};

export const updateTransfer = async (transferKey, transferData) => {
  const transaction = await sequelize.transaction();

  try {
    const transfer = await Transfer.findByPk(transferKey);

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.status === "validated") {
      throw new Error("Cannot update a validated transfer");
    }

    if (transferData.source_location_key === transferData.destination_location_key) {
      throw new Error("Source and destination locations must be different");
    }

    await transfer.update(
      {
        source_location_key: transferData.source_location_key,
        destination_location_key: transferData.destination_location_key,
        transfer_date: transferData.transfer_date,
        notes: transferData.notes,
      },
      { transaction }
    );

    if (transferData.lines) {
      await TransferLine.destroy({
        where: { transfer_key: transferKey },
        transaction,
      });

      if (transferData.lines.length > 0) {
        const lines = transferData.lines.map((line) => ({
          transfer_key: transferKey,
          product_key: line.product_key,
          quantity: line.quantity,
        }));

        await TransferLine.bulkCreate(lines, { transaction });
      }
    }

    await transaction.commit();

    return await getTransfer(transferKey);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in updateTransfer:", error);
    throw error;
  }
};

export const deleteTransfer = async (transferKey) => {
  const transaction = await sequelize.transaction();

  try {
    const transfer = await Transfer.findByPk(transferKey);

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.status === "validated") {
      throw new Error("Cannot delete a validated transfer");
    }

    await TransferLine.destroy({
      where: { transfer_key: transferKey },
      transaction,
    });

    await transfer.destroy({ transaction });

    await transaction.commit();

    return { message: "Transfer deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in deleteTransfer:", error);
    throw error;
  }
};

export const validateTransfer = async (transferKey, userKey) => {
  const transaction = await sequelize.transaction();

  try {
    const transfer = await Transfer.findByPk(transferKey, {
      include: [
        {
          model: TransferLine,
          as: "lines",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.status === "validated") {
      throw new Error("Transfer is already validated");
    }

    if (!transfer.lines || transfer.lines.length === 0) {
      throw new Error("Cannot validate a transfer with no lines");
    }

    // Update stock for each line
    for (const line of transfer.lines) {
      // Deduct from source location
      const sourceStock = await Stock.findOne({
        where: {
          product_key: line.product_key,
          location_key: transfer.source_location_key,
        },
        transaction,
      });

      if (!sourceStock) {
        throw new Error(`No stock found for product ${line.product.product_name} at source location`);
      }

      const newSourceQuantity = parseFloat(sourceStock.quantity_on_hand) - parseFloat(line.quantity);

      if (newSourceQuantity < 0) {
        throw new Error(`Insufficient stock for product ${line.product.product_name}. Available: ${sourceStock.quantity_on_hand}, Required: ${line.quantity}`);
      }

      await sourceStock.update(
        {
          quantity_on_hand: newSourceQuantity,
        },
        { transaction }
      );

      // Add to destination location
      const destStock = await Stock.findOne({
        where: {
          product_key: line.product_key,
          location_key: transfer.destination_location_key,
        },
        transaction,
      });

      if (destStock) {
        await destStock.update(
          {
            quantity_on_hand: parseFloat(destStock.quantity_on_hand) + parseFloat(line.quantity),
          },
          { transaction }
        );
      } else {
        await Stock.create(
          {
            product_key: line.product_key,
            location_key: transfer.destination_location_key,
            quantity_on_hand: line.quantity,
          },
          { transaction }
        );
      }

      // Create stock movement record
      await StockMovement.create(
        {
          movement_id: `${transfer.transfer_id}-${line.product_key}`,
          movement_type: "transfer",
          reference: transfer.transfer_id,
          product_key: line.product_key,
          source_location_key: transfer.source_location_key,
          destination_location_key: transfer.destination_location_key,
          quantity: line.quantity,
          uom: line.product.uom,
          movement_date: new Date(),
          validated_by: userKey,
          validated_at: new Date(),
          notes: transfer.notes,
          created_by: transfer.created_by,
          created_at: transfer.created_at,
        },
        { transaction }
      );
    }

    await transfer.update(
      {
        status: "validated",
        validated_by: userKey,
        validated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return await getTransfer(transferKey);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in validateTransfer:", error);
    throw error;
  }
};
