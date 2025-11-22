import * as adjustmentService from "../services/adjustmentService.js";
import logger from "../config/logger.js";

export const getAdjustments = async (req, res, next) => {
  try {
    const adjustments = await adjustmentService.getAdjustments();
    res.status(200).json({
      success: true,
      data: adjustments,
    });
  } catch (error) {
    logger.error("Error in getAdjustments controller:", error);
    next(error);
  }
};

export const getAdjustment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adjustment = await adjustmentService.getAdjustment(id);
    res.status(200).json({
      success: true,
      data: adjustment,
    });
  } catch (error) {
    logger.error("Error in getAdjustment controller:", error);
    next(error);
  }
};

export const createAdjustment = async (req, res, next) => {
  try {
    const adjustment = await adjustmentService.createAdjustment(req.body, req.user.user_key);
    res.status(201).json({
      success: true,
      message: "Adjustment created successfully",
      data: adjustment,
    });
  } catch (error) {
    logger.error("Error in createAdjustment controller:", error);
    next(error);
  }
};

export const updateAdjustment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adjustment = await adjustmentService.updateAdjustment(id, req.body);
    res.status(200).json({
      success: true,
      message: "Adjustment updated successfully",
      data: adjustment,
    });
  } catch (error) {
    logger.error("Error in updateAdjustment controller:", error);
    next(error);
  }
};

export const deleteAdjustment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await adjustmentService.deleteAdjustment(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteAdjustment controller:", error);
    next(error);
  }
};

export const validateAdjustment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adjustment = await adjustmentService.validateAdjustment(id, req.user.user_key);
    res.status(200).json({
      success: true,
      message: "Adjustment validated successfully",
      data: adjustment,
    });
  } catch (error) {
    logger.error("Error in validateAdjustment controller:", error);
    next(error);
  }
};
