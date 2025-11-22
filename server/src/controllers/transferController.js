import * as transferService from "../services/transferService.js";
import logger from "../config/logger.js";

export const getTransfers = async (req, res, next) => {
  try {
    const transfers = await transferService.getTransfers();
    res.status(200).json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    logger.error("Error in getTransfers controller:", error);
    next(error);
  }
};

export const getTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transfer = await transferService.getTransfer(id);
    res.status(200).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    logger.error("Error in getTransfer controller:", error);
    next(error);
  }
};

export const createTransfer = async (req, res, next) => {
  try {
    const transfer = await transferService.createTransfer(req.body, req.user.user_key);
    res.status(201).json({
      success: true,
      message: "Transfer created successfully",
      data: transfer,
    });
  } catch (error) {
    logger.error("Error in createTransfer controller:", error);
    next(error);
  }
};

export const updateTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transfer = await transferService.updateTransfer(id, req.body);
    res.status(200).json({
      success: true,
      message: "Transfer updated successfully",
      data: transfer,
    });
  } catch (error) {
    logger.error("Error in updateTransfer controller:", error);
    next(error);
  }
};

export const deleteTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await transferService.deleteTransfer(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Error in deleteTransfer controller:", error);
    next(error);
  }
};

export const validateTransfer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transfer = await transferService.validateTransfer(id, req.user.user_key);
    res.status(200).json({
      success: true,
      message: "Transfer validated successfully",
      data: transfer,
    });
  } catch (error) {
    logger.error("Error in validateTransfer controller:", error);
    next(error);
  }
};
