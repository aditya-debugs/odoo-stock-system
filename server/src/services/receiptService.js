import sequelize from "../config/db.js";
import {
  Receipt,
  Operation,
  Location,
  Product,
  Stock,
  StockMovement,
  User,
} from "../models/index.js";
import logger from "../config/logger.js";

const getReceipts = async (filters = {}) => {
  try {
    const receipts = await Receipt.findAll({
      include: [
        {
          model: Operation,
          as: "operation",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["user_key", "username"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return receipts;
  } catch (error) {
    logger.error("Error fetching receipts:", error);
    return [];
  }
};

const getReceiptById = async (receipt_key) => {
  try {
    const receipt = await Receipt.findByPk(receipt_key, {
      include: [
        {
          model: Operation,
          as: "operation",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["user_key", "username"],
            },
          ],
        },
      ],
    });
    return receipt;
  } catch (error) {
    logger.error("Error fetching receipt:", error);
    return null;
  }
};

const createReceipt = async (receiptData) => {
  const transaction = await sequelize.transaction();
  try {
    const operation = await Operation.create(
      {
        status: "draft",
        reference_no: receiptData.receipt_id || "NEW",
        meta: { lines: receiptData.lines || [] },
        created_by_key: receiptData.created_by,
      },
      { transaction }
    );

    const receipt = await Receipt.create(
      {
        operation_key: operation.operation_key,
        supplier_name: receiptData.supplier_name,
        invoice_number: receiptData.invoice_number,
      },
      { transaction }
    );

    await transaction.commit();
    return await getReceiptById(receipt.receipt_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating receipt:", error);
    throw error;
  }
};

const updateReceipt = async (receipt_key, updateData) => {
  try {
    const receipt = await Receipt.findByPk(receipt_key);
    if (!receipt) throw new Error("Receipt not found");

    await receipt.update(updateData);
    
    if (updateData.lines && receipt.operation_key) {
      await Operation.update(
        { meta: { lines: updateData.lines } },
        { where: { operation_key: receipt.operation_key } }
      );
    }

    return await getReceiptById(receipt_key);
  } catch (error) {
    logger.error("Error updating receipt:", error);
    throw error;
  }
};

const deleteReceipt = async (receipt_key) => {
  try {
    const receipt = await Receipt.findByPk(receipt_key);
    if (!receipt) throw new Error("Receipt not found");

    if (receipt.operation_key) {
      await Operation.destroy({ where: { operation_key: receipt.operation_key } });
    }
    await receipt.destroy();
    return true;
  } catch (error) {
    logger.error("Error deleting receipt:", error);
    throw error;
  }
};

const validateReceipt = async (receipt_key, validated_by) => {
  const transaction = await sequelize.transaction();
  try {
    const receipt = await Receipt.findByPk(receipt_key, { transaction });
    if (!receipt) throw new Error("Receipt not found");

    await Operation.update(
      { status: "validated", validated_by_key: validated_by },
      { where: { operation_key: receipt.operation_key }, transaction }
    );

    await transaction.commit();
    return await getReceiptById(receipt_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error validating receipt:", error);
    throw error;
  }
};

export default {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  validateReceipt,
};
