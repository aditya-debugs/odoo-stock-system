import * as receiptService from "../services/receiptService.js";
import logger from "../config/logger.js";

export const getReceipts = async (req, res, next) => {
  try {
    const receipts = await receiptService.getReceipts();
    res.status(200).json({
      success: true,
      data: receipts,
    });
  } catch (error) {
    logger.error("Error in getReceipts controller:", error);
    next(error);
  }
};

export const getReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await receiptService.getReceipt(id);
    res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    logger.error("Error in getReceipt controller:", error);
    next(error);
  }
};

export const createReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptService.createReceipt(req.body, req.user.user_key);
    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      data: receipt,
    });
  } catch (error) {
    logger.error("Error in createReceipt controller:", error);
    next(error);
  }
};

export const updateReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await receiptService.updateReceipt(id, req.body);
    res.status(200).json({
      success: true,
      message: "Receipt updated successfully",
      data: receipt,
    });
  } catch (error) {
    logger.error("Error in updateReceipt controller:", error);
    next(error);
  }
};

export const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await receiptService.deleteReceipt(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteReceipt controller:", error);
    next(error);
  }
};

export const validateReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await receiptService.validateReceipt(id, req.user.user_key);
    res.status(200).json({
      success: true,
      message: "Receipt validated successfully",
      data: receipt,
    });
  } catch (error) {
    logger.error("Error in validateReceipt controller:", error);
    next(error);
  }
};
