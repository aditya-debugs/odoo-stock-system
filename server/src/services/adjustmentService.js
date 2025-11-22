import sequelize from "../config/db.js";
import { Adjustment, Operation, Location, Product, Stock, StockMovement, User } from "../models/index.js";
import logger from "../config/logger.js";

const getAdjustments = async (filters = {}) => {
  try {
    const adjustments = await Adjustment.findAll({
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return adjustments;
  } catch (error) {
    logger.error("Error fetching adjustments:", error);
    return [];
  }
};

const getAdjustmentById = async (adjustment_key) => {
  try {
    const adjustment = await Adjustment.findByPk(adjustment_key, {
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
    });
    return adjustment;
  } catch (error) {
    logger.error("Error fetching adjustment:", error);
    return null;
  }
};

const createAdjustment = async (adjustmentData) => {
  const transaction = await sequelize.transaction();
  try {
    const operation = await Operation.create({ status: "draft", reference_no: adjustmentData.adjustment_id || "NEW", meta: { lines: adjustmentData.lines || [] }, created_by_key: adjustmentData.created_by }, { transaction });
    const adjustment = await Adjustment.create({ operation_key: operation.operation_key, adjustment_reason: adjustmentData.adjustment_reason, counted_quantity: adjustmentData.counted_quantity }, { transaction });
    await transaction.commit();
    return await getAdjustmentById(adjustment.adjustment_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating adjustment:", error);
    throw error;
  }
};

const updateAdjustment = async (adjustment_key, updateData) => {
  try {
    const adjustment = await Adjustment.findByPk(adjustment_key);
    if (!adjustment) throw new Error("Adjustment not found");
    await adjustment.update(updateData);
    if (updateData.lines && adjustment.operation_key) {
      await Operation.update({ meta: { lines: updateData.lines } }, { where: { operation_key: adjustment.operation_key } });
    }
    return await getAdjustmentById(adjustment_key);
  } catch (error) {
    logger.error("Error updating adjustment:", error);
    throw error;
  }
};

const deleteAdjustment = async (adjustment_key) => {
  try {
    const adjustment = await Adjustment.findByPk(adjustment_key);
    if (!adjustment) throw new Error("Adjustment not found");
    if (adjustment.operation_key) await Operation.destroy({ where: { operation_key: adjustment.operation_key } });
    await adjustment.destroy();
    return true;
  } catch (error) {
    logger.error("Error deleting adjustment:", error);
    throw error;
  }
};

const validateAdjustment = async (adjustment_key, validated_by) => {
  const transaction = await sequelize.transaction();
  try {
    const adjustment = await Adjustment.findByPk(adjustment_key, { transaction });
    if (!adjustment) throw new Error("Adjustment not found");
    await Operation.update({ status: "validated", validated_by_key: validated_by }, { where: { operation_key: adjustment.operation_key }, transaction });
    await transaction.commit();
    return await getAdjustmentById(adjustment_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error validating adjustment:", error);
    throw error;
  }
};

export default { getAdjustments, getAdjustmentById, createAdjustment, updateAdjustment, deleteAdjustment, validateAdjustment };
