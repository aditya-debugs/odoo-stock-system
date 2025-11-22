import { Warehouse, Location } from "../models/index.js";
import logger from "../config/logger.js";
import { Op } from "sequelize";

// Get all warehouses (with optional filter for active only)
export const getAllWarehouses = async (activeOnly = false) => {
  try {
    const whereClause = activeOnly ? { is_active: true } : {};
    
    const warehouses = await Warehouse.findAll({
      where: whereClause,
      include: [
        {
          model: Location,
          as: "locations",
          where: activeOnly ? { is_active: true } : {},
          required: false,
        },
      ],
      order: [["warehouse_name", "ASC"]],
    });

    return warehouses;
  } catch (error) {
    logger.error("Get all warehouses error:", error.message);
    throw error;
  }
};

// Get warehouse by ID
export const getWarehouseById = async (warehouseKey) => {
  try {
    const warehouse = await Warehouse.findByPk(warehouseKey, {
      include: [
        {
          model: Location,
          as: "locations",
          order: [["location_name", "ASC"]],
        },
      ],
    });

    if (!warehouse) {
      const error = new Error("Warehouse not found");
      error.statusCode = 404;
      throw error;
    }

    return warehouse;
  } catch (error) {
    logger.error("Get warehouse by ID error:", error.message);
    throw error;
  }
};

// Create new warehouse
export const createWarehouse = async (warehouseData) => {
  try {
    // Check if warehouse code already exists
    if (warehouseData.warehouse_code) {
      const existing = await Warehouse.findOne({
        where: { warehouse_code: warehouseData.warehouse_code },
      });

      if (existing) {
        const error = new Error("Warehouse code already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    // Generate warehouse_id (you can implement your own logic)
    const lastWarehouse = await Warehouse.findOne({
      order: [["warehouse_id", "DESC"]],
    });
    
    const newWarehouseId = lastWarehouse ? lastWarehouse.warehouse_id + 1 : 1;

    const warehouse = await Warehouse.create({
      ...warehouseData,
      warehouse_id: newWarehouseId,
      is_active: true,
      created_at: new Date(),
    });

    logger.info(`Warehouse created: ${warehouse.warehouse_name}`);
    return warehouse;
  } catch (error) {
    logger.error("Create warehouse error:", error.message);
    throw error;
  }
};

// Update warehouse
export const updateWarehouse = async (warehouseKey, warehouseData) => {
  try {
    const warehouse = await Warehouse.findByPk(warehouseKey);

    if (!warehouse) {
      const error = new Error("Warehouse not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if warehouse code is being changed and if it already exists
    if (
      warehouseData.warehouse_code &&
      warehouseData.warehouse_code !== warehouse.warehouse_code
    ) {
      const existing = await Warehouse.findOne({
        where: {
          warehouse_code: warehouseData.warehouse_code,
          warehouse_key: { [Op.ne]: warehouseKey },
        },
      });

      if (existing) {
        const error = new Error("Warehouse code already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    await warehouse.update({
      ...warehouseData,
      updated_at: new Date(),
    });

    logger.info(`Warehouse updated: ${warehouse.warehouse_name}`);
    return warehouse;
  } catch (error) {
    logger.error("Update warehouse error:", error.message);
    throw error;
  }
};

// Deactivate warehouse (soft delete)
export const deactivateWarehouse = async (warehouseKey) => {
  try {
    const warehouse = await Warehouse.findByPk(warehouseKey);

    if (!warehouse) {
      const error = new Error("Warehouse not found");
      error.statusCode = 404;
      throw error;
    }

    await warehouse.update({
      is_active: false,
      updated_at: new Date(),
    });

    // Also deactivate all locations in this warehouse
    await Location.update(
      { is_active: false, updated_at: new Date() },
      { where: { warehouse_key: warehouseKey } }
    );

    logger.info(`Warehouse deactivated: ${warehouse.warehouse_name}`);
    return warehouse;
  } catch (error) {
    logger.error("Deactivate warehouse error:", error.message);
    throw error;
  }
};

// Reactivate warehouse
export const reactivateWarehouse = async (warehouseKey) => {
  try {
    const warehouse = await Warehouse.findByPk(warehouseKey);

    if (!warehouse) {
      const error = new Error("Warehouse not found");
      error.statusCode = 404;
      throw error;
    }

    await warehouse.update({
      is_active: true,
      updated_at: new Date(),
    });

    logger.info(`Warehouse reactivated: ${warehouse.warehouse_name}`);
    return warehouse;
  } catch (error) {
    logger.error("Reactivate warehouse error:", error.message);
    throw error;
  }
};
