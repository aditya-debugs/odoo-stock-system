import * as locationService from "../services/locationService.js";

// @desc    Get all locations (optionally filtered by warehouse)
// @route   GET /api/locations
// @access  Private (Both roles can view)
export const getLocations = async (req, res, next) => {
  try {
    const warehouseKey = req.query.warehouse ? parseInt(req.query.warehouse) : null;
    const activeOnly = req.query.active === "true";
    
    const locations = await locationService.getAllLocations(warehouseKey, activeOnly);

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private (Both roles can view)
export const getLocation = async (req, res, next) => {
  try {
    const location = await locationService.getLocationById(req.params.id);

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (Inventory Manager only)
export const createLocation = async (req, res, next) => {
  try {
    const location = await locationService.createLocation(req.body);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Inventory Manager only)
export const updateLocation = async (req, res, next) => {
  try {
    const location = await locationService.updateLocation(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate location
// @route   PUT /api/locations/:id/deactivate
// @access  Private (Inventory Manager only)
export const deactivateLocation = async (req, res, next) => {
  try {
    const location = await locationService.deactivateLocation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Location deactivated successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reactivate location
// @route   PUT /api/locations/:id/reactivate
// @access  Private (Inventory Manager only)
export const reactivateLocation = async (req, res, next) => {
  try {
    const location = await locationService.reactivateLocation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Location reactivated successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};
