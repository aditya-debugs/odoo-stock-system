import * as deliveryService from "../services/deliveryService.js";
import logger from "../config/logger.js";

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getDeliveries();
    res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    logger.error("Error in getDeliveries controller:", error);
    next(error);
  }
};

export const getDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.getDelivery(id);
    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    logger.error("Error in getDelivery controller:", error);
    next(error);
  }
};

export const createDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body, req.user.user_key);
    res.status(201).json({
      success: true,
      message: "Delivery created successfully",
      data: delivery,
    });
  } catch (error) {
    logger.error("Error in createDelivery controller:", error);
    next(error);
  }
};

export const updateDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.updateDelivery(id, req.body);
    res.status(200).json({
      success: true,
      message: "Delivery updated successfully",
      data: delivery,
    });
  } catch (error) {
    logger.error("Error in updateDelivery controller:", error);
    next(error);
  }
};

export const deleteDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deliveryService.deleteDelivery(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteDelivery controller:", error);
    next(error);
  }
};

export const validateDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.validateDelivery(id, req.user.user_key);
    res.status(200).json({
      success: true,
      message: "Delivery validated successfully",
      data: delivery,
    });
  } catch (error) {
    logger.error("Error in validateDelivery controller:", error);
    next(error);
  }
};
