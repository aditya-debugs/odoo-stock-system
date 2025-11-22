import * as warehouseService from "../services/warehouseService.js";

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private (Both roles can view)
export const getWarehouses = async (req, res, next) => {
  try {
    const activeOnly = req.query.active === "true";
    const warehouses = await warehouseService.getAllWarehouses(activeOnly);

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private (Both roles can view)
export const getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.getWarehouseById(req.params.id);

    res.status(200).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private (Inventory Manager only)
export const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.createWarehouse(req.body);

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (Inventory Manager only)
export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Warehouse updated successfully",
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate warehouse
// @route   PUT /api/warehouses/:id/deactivate
// @access  Private (Inventory Manager only)
export const deactivateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.deactivateWarehouse(req.params.id);

    res.status(200).json({
      success: true,
      message: "Warehouse deactivated successfully",
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reactivate warehouse
// @route   PUT /api/warehouses/:id/reactivate
// @access  Private (Inventory Manager only)
export const reactivateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.reactivateWarehouse(req.params.id);

    res.status(200).json({
      success: true,
      message: "Warehouse reactivated successfully",
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};
