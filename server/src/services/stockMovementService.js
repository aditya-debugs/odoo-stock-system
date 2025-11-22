import sequelize from "../config/db.js";
import { StockMovement, Operation, Product, Location, User } from "../models/index.js";
import logger from "../config/logger.js";

const getStockMovements = async (filters = {}) => {
  try {
    const movements = await StockMovement.findAll({
      include: [
        { model: Product, as: "product", attributes: ["product_key", "product_name", "sku"] },
        { model: Location, as: "fromLocation", attributes: ["location_key", "location_name"] },
        { model: Location, as: "toLocation", attributes: ["location_key", "location_name"] },
        { model: User, as: "creator", attributes: ["user_key", "username"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 100,
    });
    return movements;
  } catch (error) {
    logger.error("Error fetching stock movements:", error);
    return [];
  }
};

const getMovementsByProduct = async (product_key) => {
  try {
    const movements = await StockMovement.findAll({
      where: { product_key },
      include: [
        { model: Product, as: "product", attributes: ["product_key", "product_name", "sku"] },
        { model: Location, as: "fromLocation", attributes: ["location_key", "location_name"] },
        { model: Location, as: "toLocation", attributes: ["location_key", "location_name"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return movements;
  } catch (error) {
    logger.error("Error fetching movements by product:", error);
    return [];
  }
};

const getMovementsByLocation = async (location_key) => {
  try {
    const movements = await StockMovement.findAll({
      where: {
        [sequelize.Op.or]: [{ from_location_key: location_key }, { to_location_key: location_key }],
      },
      include: [
        { model: Product, as: "product", attributes: ["product_key", "product_name", "sku"] },
        { model: Location, as: "fromLocation", attributes: ["location_key", "location_name"] },
        { model: Location, as: "toLocation", attributes: ["location_key", "location_name"] },
      ],
      order: [["created_at", "DESC"]],
      limit: 50,
    });
    return movements;
  } catch (error) {
    logger.error("Error fetching movements by location:", error);
    return [];
  }
};

export default {
  getStockMovements,
  getMovementsByProduct,
  getMovementsByLocation,
};
