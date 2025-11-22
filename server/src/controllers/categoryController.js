import categoryService from "../services/categoryService.js";
import logger from "../config/logger.js";

export const getCategories = async (req, res, next) => {
  try {
    const { search, is_active } = req.query;
    
    const filters = {};
    if (search) filters.search = search;
    if (is_active !== undefined) filters.is_active = is_active === "true";

    const categories = await categoryService.getCategories(filters);
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategory(parseInt(id));
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    logger.error(`Error fetching category ${req.params.id}:`, error);
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    logger.error("Error creating category:", error);
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    logger.error(`Error updating category ${req.params.id}:`, error);
    next(error);
  }
};

export const deactivateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.deactivateCategory(parseInt(id));
    
    res.json({
      success: true,
      message: "Category deactivated successfully",
      data: category,
    });
  } catch (error) {
    logger.error(`Error deactivating category ${req.params.id}:`, error);
    next(error);
  }
};

export const reactivateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.reactivateCategory(parseInt(id));
    
    res.json({
      success: true,
      message: "Category reactivated successfully",
      data: category,
    });
  } catch (error) {
    logger.error(`Error reactivating category ${req.params.id}:`, error);
    next(error);
  }
};
