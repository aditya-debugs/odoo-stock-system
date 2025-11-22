import * as stockMovementService from "../services/stockMovementService.js";
import logger from "../config/logger.js";

export const getStockMovements = async (req, res, next) => {
  try {
    const filters = {
      movement_type: req.query.movement_type,
      product_key: req.query.product_key,
      location_key: req.query.location_key,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
    };

    const movements = await stockMovementService.getStockMovements(filters);
    res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    logger.error("Error in getStockMovements controller:", error);
    next(error);
  }
};

export const getStockMovementsByProduct = async (req, res, next) => {
  try {
    const { productKey } = req.params;
    const movements = await stockMovementService.getStockMovementsByProduct(productKey);
    res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    logger.error("Error in getStockMovementsByProduct controller:", error);
    next(error);
  }
};

export const getStockMovementsByLocation = async (req, res, next) => {
  try {
    const { locationKey } = req.params;
    const movements = await stockMovementService.getStockMovementsByLocation(locationKey);
    res.status(200).json({
      success: true,
      data: movements,
    });
  } catch (error) {
    logger.error("Error in getStockMovementsByLocation controller:", error);
    next(error);
  }
};
