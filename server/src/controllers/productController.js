import productService from "../services/productService.js";
import logger from "../config/logger.js";

export const getProducts = async (req, res, next) => {
  try {
    const { search, category_key, is_active } = req.query;
    
    const filters = {};
    if (search) filters.search = search;
    if (category_key) filters.category_key = parseInt(category_key);
    if (is_active !== undefined) filters.is_active = is_active === "true";

    const products = await productService.getProducts(filters);
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error("Error fetching products:", error);
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProduct(parseInt(id));
    
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(`Error fetching product ${req.params.id}:`, error);
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { initialStock, ...productData } = req.body;
    const product = await productService.createProduct(productData, initialStock);
    
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    logger.error("Error creating product:", error);
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error updating product ${req.params.id}:`, error);
    next(error);
  }
};

export const deactivateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.deactivateProduct(parseInt(id));
    
    res.json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error deactivating product ${req.params.id}:`, error);
    next(error);
  }
};

export const reactivateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.reactivateProduct(parseInt(id));
    
    res.json({
      success: true,
      message: "Product reactivated successfully",
      data: product,
    });
  } catch (error) {
    logger.error(`Error reactivating product ${req.params.id}:`, error);
    next(error);
  }
};

export const getStockByLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location_key } = req.query;
    
    const stock = await productService.getStockByLocation(
      parseInt(id),
      location_key ? parseInt(location_key) : null
    );
    
    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    logger.error(`Error fetching stock for product ${req.params.id}:`, error);
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { location_key, quantity, isAdjustment } = req.body;
    
    const stock = await productService.updateStock(
      parseInt(id),
      parseInt(location_key),
      parseFloat(quantity),
      isAdjustment
    );
    
    res.json({
      success: true,
      message: "Stock updated successfully",
      data: stock,
    });
  } catch (error) {
    logger.error(`Error updating stock for product ${req.params.id}:`, error);
    next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await productService.getLowStockProducts();
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error("Error fetching low stock products:", error);
    next(error);
  }
};
