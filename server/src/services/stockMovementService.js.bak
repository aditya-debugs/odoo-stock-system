import { StockMovement, Product, Location, User } from "../models/index.js";
import { Op } from "sequelize";
import logger from "../config/logger.js";

export const getStockMovements = async (filters = {}) => {
  try {
    const where = {};

    if (filters.movement_type) {
      where.movement_type = filters.movement_type;
    }

    if (filters.product_key) {
      where.product_key = filters.product_key;
    }

    if (filters.location_key) {
      where.source_location_key = filters.location_key;
    }

    if (filters.start_date && filters.end_date) {
      where.movement_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    }

    const movements = await StockMovement.findAll({
      where,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_key", "product_name", "sku", "uom"],
        },
        {
          model: Location,
          as: "source",
          attributes: ["location_key", "location_name"],
        },
        {
          model: Location,
          as: "destination",
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
      ],
      order: [["movement_date", "DESC"]],
    });

    return movements;
  } catch (error) {
    logger.error("Error in getStockMovements:", error);
    throw error;
  }
};

export const getStockMovementsByProduct = async (productKey) => {
  try {
    const movements = await StockMovement.findAll({
      where: { product_key: productKey },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_key", "product_name", "sku", "uom"],
        },
        {
          model: Location,
          as: "source",
          attributes: ["location_key", "location_name"],
        },
        {
          model: Location,
          as: "destination",
          attributes: ["location_key", "location_name"],
        },
        {
          model: User,
          as: "validator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
      ],
      order: [["movement_date", "DESC"]],
    });

    return movements;
  } catch (error) {
    logger.error("Error in getStockMovementsByProduct:", error);
    throw error;
  }
};

export const getStockMovementsByLocation = async (locationKey) => {
  try {
    const movements = await StockMovement.findAll({
      where: {
        [Op.or]: [
          { source_location_key: locationKey },
          { destination_location_key: locationKey },
        ],
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["product_key", "product_name", "sku", "uom"],
        },
        {
          model: Location,
          as: "source",
          attributes: ["location_key", "location_name"],
        },
        {
          model: Location,
          as: "destination",
          attributes: ["location_key", "location_name"],
        },
        {
          model: User,
          as: "validator",
          attributes: ["user_key", "username", "first_name", "last_name"],
        },
      ],
      order: [["movement_date", "DESC"]],
    });

    return movements;
  } catch (error) {
    logger.error("Error in getStockMovementsByLocation:", error);
    throw error;
  }
};
