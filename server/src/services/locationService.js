import { Location, Warehouse } from "../models/index.js";
import logger from "../config/logger.js";
import { Op } from "sequelize";

// Get all locations (with optional warehouse filter)
export const getAllLocations = async (warehouseKey = null, activeOnly = false) => {
  try {
    const whereClause = {};
    
    if (warehouseKey) {
      whereClause.warehouse_key = warehouseKey;
    }
    
    if (activeOnly) {
      whereClause.is_active = true;
    }

    const locations = await Location.findAll({
      where: whereClause,
      include: [
        {
          model: Warehouse,
          as: "warehouse",
          attributes: ["warehouse_key", "warehouse_name", "warehouse_code"],
        },
        {
          model: Location,
          as: "parent",
          attributes: ["location_key", "location_name", "location_code"],
        },
      ],
      order: [["location_name", "ASC"]],
    });

    return locations;
  } catch (error) {
    logger.error("Get all locations error:", error.message);
    throw error;
  }
};

// Get location by ID
export const getLocationById = async (locationKey) => {
  try {
    const location = await Location.findByPk(locationKey, {
      include: [
        {
          model: Warehouse,
          as: "warehouse",
        },
        {
          model: Location,
          as: "parent",
        },
        {
          model: Location,
          as: "children",
        },
      ],
    });

    if (!location) {
      const error = new Error("Location not found");
      error.statusCode = 404;
      throw error;
    }

    return location;
  } catch (error) {
    logger.error("Get location by ID error:", error.message);
    throw error;
  }
};

// Create new location
export const createLocation = async (locationData) => {
  try {
    // Check if location code already exists
    if (locationData.location_code) {
      const existing = await Location.findOne({
        where: { location_code: locationData.location_code },
      });

      if (existing) {
        const error = new Error("Location code already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    // Verify warehouse exists if warehouse_key is provided
    if (locationData.warehouse_key) {
      const warehouse = await Warehouse.findByPk(locationData.warehouse_key);
      if (!warehouse) {
        const error = new Error("Warehouse not found");
        error.statusCode = 404;
        throw error;
      }
    }

    // Generate location_id
    const lastLocation = await Location.findOne({
      order: [["location_id", "DESC"]],
    });
    
    const newLocationId = lastLocation ? lastLocation.location_id + 1 : 1;

    const location = await Location.create({
      ...locationData,
      location_id: newLocationId,
      is_active: true,
      created_at: new Date(),
    });

    logger.info(`Location created: ${location.location_name}`);
    
    // Fetch complete location with associations
    return await getLocationById(location.location_key);
  } catch (error) {
    logger.error("Create location error:", error.message);
    throw error;
  }
};

// Update location
export const updateLocation = async (locationKey, locationData) => {
  try {
    const location = await Location.findByPk(locationKey);

    if (!location) {
      const error = new Error("Location not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if location code is being changed and if it already exists
    if (
      locationData.location_code &&
      locationData.location_code !== location.location_code
    ) {
      const existing = await Location.findOne({
        where: {
          location_code: locationData.location_code,
          location_key: { [Op.ne]: locationKey },
        },
      });

      if (existing) {
        const error = new Error("Location code already exists");
        error.statusCode = 400;
        throw error;
      }
    }

    // Verify warehouse exists if warehouse_key is being changed
    if (locationData.warehouse_key && locationData.warehouse_key !== location.warehouse_key) {
      const warehouse = await Warehouse.findByPk(locationData.warehouse_key);
      if (!warehouse) {
        const error = new Error("Warehouse not found");
        error.statusCode = 404;
        throw error;
      }
    }

    await location.update({
      ...locationData,
      updated_at: new Date(),
    });

    logger.info(`Location updated: ${location.location_name}`);
    return await getLocationById(locationKey);
  } catch (error) {
    logger.error("Update location error:", error.message);
    throw error;
  }
};

// Deactivate location (soft delete)
export const deactivateLocation = async (locationKey) => {
  try {
    const location = await Location.findByPk(locationKey);

    if (!location) {
      const error = new Error("Location not found");
      error.statusCode = 404;
      throw error;
    }

    await location.update({
      is_active: false,
      updated_at: new Date(),
    });

    // Also deactivate all child locations
    await Location.update(
      { is_active: false, updated_at: new Date() },
      { where: { parent_location_key: locationKey } }
    );

    logger.info(`Location deactivated: ${location.location_name}`);
    return location;
  } catch (error) {
    logger.error("Deactivate location error:", error.message);
    throw error;
  }
};

// Reactivate location
export const reactivateLocation = async (locationKey) => {
  try {
    const location = await Location.findByPk(locationKey);

    if (!location) {
      const error = new Error("Location not found");
      error.statusCode = 404;
      throw error;
    }

    await location.update({
      is_active: true,
      updated_at: new Date(),
    });

    logger.info(`Location reactivated: ${location.location_name}`);
    return location;
  } catch (error) {
    logger.error("Reactivate location error:", error.message);
    throw error;
  }
};
