import sequelize from "../config/db.js";
import { Transfer, Operation, Location, Product, Stock, StockMovement, User } from "../models/index.js";
import logger from "../config/logger.js";

const getTransfers = async (filters = {}) => {
  try {
    const transfers = await Transfer.findAll({
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return transfers;
  } catch (error) {
    logger.error("Error fetching transfers:", error);
    return [];
  }
};

const getTransferById = async (transfer_key) => {
  try {
    const transfer = await Transfer.findByPk(transfer_key, {
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
    });
    return transfer;
  } catch (error) {
    logger.error("Error fetching transfer:", error);
    return null;
  }
};

const createTransfer = async (transferData) => {
  const transaction = await sequelize.transaction();
  try {
    const operation = await Operation.create({ status: "draft", reference_no: transferData.transfer_id || "NEW", meta: { lines: transferData.lines || [] }, created_by_key: transferData.created_by }, { transaction });
    const transfer = await Transfer.create({ operation_key: operation.operation_key, transfer_reason: transferData.transfer_reason }, { transaction });
    await transaction.commit();
    return await getTransferById(transfer.transfer_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating transfer:", error);
    throw error;
  }
};

const updateTransfer = async (transfer_key, updateData) => {
  try {
    const transfer = await Transfer.findByPk(transfer_key);
    if (!transfer) throw new Error("Transfer not found");
    await transfer.update(updateData);
    if (updateData.lines && transfer.operation_key) {
      await Operation.update({ meta: { lines: updateData.lines } }, { where: { operation_key: transfer.operation_key } });
    }
    return await getTransferById(transfer_key);
  } catch (error) {
    logger.error("Error updating transfer:", error);
    throw error;
  }
};

const deleteTransfer = async (transfer_key) => {
  try {
    const transfer = await Transfer.findByPk(transfer_key);
    if (!transfer) throw new Error("Transfer not found");
    if (transfer.operation_key) await Operation.destroy({ where: { operation_key: transfer.operation_key } });
    await transfer.destroy();
    return true;
  } catch (error) {
    logger.error("Error deleting transfer:", error);
    throw error;
  }
};

const validateTransfer = async (transfer_key, validated_by) => {
  const transaction = await sequelize.transaction();
  try {
    const transfer = await Transfer.findByPk(transfer_key, { transaction });
    if (!transfer) throw new Error("Transfer not found");
    await Operation.update({ status: "validated", validated_by_key: validated_by }, { where: { operation_key: transfer.operation_key }, transaction });
    await transaction.commit();
    return await getTransferById(transfer_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error validating transfer:", error);
    throw error;
  }
};

export default { getTransfers, getTransferById, createTransfer, updateTransfer, deleteTransfer, validateTransfer };
