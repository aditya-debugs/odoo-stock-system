import sequelize from "../config/db.js";
import {
  Delivery,
  DeliveryLine,
  Location,
  Product,
  Stock,
  StockMovement,
  User,
} from "../models/index.js";
import logger from "../config/logger.js";

const generateDeliveryId = async () => {
  const lastDelivery = await Delivery.findOne({
    order: [["delivery_key", "DESC"]],
  });
  
  const nextNumber = lastDelivery ? parseInt(lastDelivery.delivery_id.split("-")[1]) + 1 : 1;
  return `DEL-${String(nextNumber).padStart(5, "0")}`;
};

export const getDeliveries = async () => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: Location,
          as: "source",
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
          model: DeliveryLine,
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

    return deliveries;
  } catch (error) {
    logger.error("Error in getDeliveries:", error);
    throw error;
  }
};

export const getDelivery = async (deliveryKey) => {
  try {
    const delivery = await Delivery.findByPk(deliveryKey, {
      include: [
        {
          model: Location,
          as: "source",
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
          model: DeliveryLine,
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

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    return delivery;
  } catch (error) {
    logger.error("Error in getDelivery:", error);
    throw error;
  }
};

export const createDelivery = async (deliveryData, userKey) => {
  const transaction = await sequelize.transaction();

  try {
    const deliveryId = await generateDeliveryId();

    const delivery = await Delivery.create(
      {
        delivery_id: deliveryId,
        customer_name: deliveryData.customer_name,
        source_location_key: deliveryData.source_location_key,
        delivery_date: deliveryData.delivery_date || new Date(),
        notes: deliveryData.notes,
        created_by: userKey,
      },
      { transaction }
    );

    if (deliveryData.lines && deliveryData.lines.length > 0) {
      const lines = deliveryData.lines.map((line) => ({
        delivery_key: delivery.delivery_key,
        product_key: line.product_key,
        quantity: line.quantity,
      }));

      await DeliveryLine.bulkCreate(lines, { transaction });
    }

    await transaction.commit();

    return await getDelivery(delivery.delivery_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in createDelivery:", error);
    throw error;
  }
};

export const updateDelivery = async (deliveryKey, deliveryData) => {
  const transaction = await sequelize.transaction();

  try {
    const delivery = await Delivery.findByPk(deliveryKey);

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (delivery.status === "validated") {
      throw new Error("Cannot update a validated delivery");
    }

    await delivery.update(
      {
        customer_name: deliveryData.customer_name,
        source_location_key: deliveryData.source_location_key,
        delivery_date: deliveryData.delivery_date,
        notes: deliveryData.notes,
      },
      { transaction }
    );

    if (deliveryData.lines) {
      await DeliveryLine.destroy({
        where: { delivery_key: deliveryKey },
        transaction,
      });

      if (deliveryData.lines.length > 0) {
        const lines = deliveryData.lines.map((line) => ({
          delivery_key: deliveryKey,
          product_key: line.product_key,
          quantity: line.quantity,
        }));

        await DeliveryLine.bulkCreate(lines, { transaction });
      }
    }

    await transaction.commit();

    return await getDelivery(deliveryKey);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in updateDelivery:", error);
    throw error;
  }
};

export const deleteDelivery = async (deliveryKey) => {
  const transaction = await sequelize.transaction();

  try {
    const delivery = await Delivery.findByPk(deliveryKey);

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (delivery.status === "validated") {
      throw new Error("Cannot delete a validated delivery");
    }

    await DeliveryLine.destroy({
      where: { delivery_key: deliveryKey },
      transaction,
    });

    await delivery.destroy({ transaction });

    await transaction.commit();

    return { message: "Delivery deleted successfully" };
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in deleteDelivery:", error);
    throw error;
  }
};

export const validateDelivery = async (deliveryKey, userKey) => {
  const transaction = await sequelize.transaction();

  try {
    const delivery = await Delivery.findByPk(deliveryKey, {
      include: [
        {
          model: DeliveryLine,
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

    if (!delivery) {
      throw new Error("Delivery not found");
    }

    if (delivery.status === "validated") {
      throw new Error("Delivery is already validated");
    }

    if (!delivery.lines || delivery.lines.length === 0) {
      throw new Error("Cannot validate a delivery with no lines");
    }

    // Update stock for each line
    for (const line of delivery.lines) {
      const stock = await Stock.findOne({
        where: {
          product_key: line.product_key,
          location_key: delivery.source_location_key,
        },
        transaction,
      });

      if (!stock) {
        throw new Error(`No stock found for product ${line.product.product_name} at source location`);
      }

      const newQuantity = parseFloat(stock.quantity_on_hand) - parseFloat(line.quantity);

      if (newQuantity < 0) {
        throw new Error(`Insufficient stock for product ${line.product.product_name}. Available: ${stock.quantity_on_hand}, Required: ${line.quantity}`);
      }

      await stock.update(
        {
          quantity_on_hand: newQuantity,
        },
        { transaction }
      );

      // Create stock movement record
      await StockMovement.create(
        {
          movement_id: `${delivery.delivery_id}-${line.product_key}`,
          movement_type: "delivery",
          reference: delivery.delivery_id,
          product_key: line.product_key,
          source_location_key: delivery.source_location_key,
          quantity: line.quantity,
          uom: line.product.uom,
          movement_date: new Date(),
          validated_by: userKey,
          validated_at: new Date(),
          notes: `Delivery to ${delivery.customer_name || "customer"}`,
          created_by: delivery.created_by,
          created_at: delivery.created_at,
        },
        { transaction }
      );
    }

    await delivery.update(
      {
        status: "validated",
        validated_by: userKey,
        validated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return await getDelivery(deliveryKey);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error in validateDelivery:", error);
    throw error;
  }
};
