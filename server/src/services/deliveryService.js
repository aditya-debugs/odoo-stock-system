import sequelize from "../config/db.js";
import { Delivery, Operation, Location, Product, Stock, StockMovement, User } from "../models/index.js";
import logger from "../config/logger.js";

const getDeliveries = async (filters = {}) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return deliveries;
  } catch (error) {
    logger.error("Error fetching deliveries:", error);
    return [];
  }
};

const getDeliveryById = async (delivery_key) => {
  try {
    const delivery = await Delivery.findByPk(delivery_key, {
      include: [{ model: Operation, as: "operation", include: [{ model: User, as: "creator", attributes: ["user_key", "username"] }] }],
    });
    return delivery;
  } catch (error) {
    logger.error("Error fetching delivery:", error);
    return null;
  }
};

const createDelivery = async (deliveryData) => {
  const transaction = await sequelize.transaction();
  try {
    const operation = await Operation.create({ status: "draft", reference_no: deliveryData.delivery_id || "NEW", meta: { lines: deliveryData.lines || [] }, created_by_key: deliveryData.created_by }, { transaction });
    const delivery = await Delivery.create({ operation_key: operation.operation_key, customer_name: deliveryData.customer_name, sales_order_no: deliveryData.sales_order_no }, { transaction });
    await transaction.commit();
    return await getDeliveryById(delivery.delivery_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error creating delivery:", error);
    throw error;
  }
};

const updateDelivery = async (delivery_key, updateData) => {
  try {
    const delivery = await Delivery.findByPk(delivery_key);
    if (!delivery) throw new Error("Delivery not found");
    await delivery.update(updateData);
    if (updateData.lines && delivery.operation_key) {
      await Operation.update({ meta: { lines: updateData.lines } }, { where: { operation_key: delivery.operation_key } });
    }
    return await getDeliveryById(delivery_key);
  } catch (error) {
    logger.error("Error updating delivery:", error);
    throw error;
  }
};

const deleteDelivery = async (delivery_key) => {
  try {
    const delivery = await Delivery.findByPk(delivery_key);
    if (!delivery) throw new Error("Delivery not found");
    if (delivery.operation_key) await Operation.destroy({ where: { operation_key: delivery.operation_key } });
    await delivery.destroy();
    return true;
  } catch (error) {
    logger.error("Error deleting delivery:", error);
    throw error;
  }
};

const validateDelivery = async (delivery_key, validated_by) => {
  const transaction = await sequelize.transaction();
  try {
    const delivery = await Delivery.findByPk(delivery_key, { transaction });
    if (!delivery) throw new Error("Delivery not found");
    await Operation.update({ status: "validated", validated_by_key: validated_by }, { where: { operation_key: delivery.operation_key }, transaction });
    await transaction.commit();
    return await getDeliveryById(delivery_key);
  } catch (error) {
    await transaction.rollback();
    logger.error("Error validating delivery:", error);
    throw error;
  }
};

export default { getDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery, validateDelivery };
