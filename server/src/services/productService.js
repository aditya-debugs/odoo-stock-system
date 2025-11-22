import { Product, Category, Stock, Location, Warehouse } from "../models/index.js";
import { Op } from "sequelize";
import sequelize from "../config/db.js";

class ProductService {
  async getProducts(filters = {}) {
    const { search, category_key, is_active } = filters;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
        { product_id: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category_key) {
      where.category_key = category_key;
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_key", "category_id", "name"],
          required: false,
        },
      ],
      order: [["name", "ASC"]],
    });

    // Get stock info separately to avoid complex joins
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const productData = product.toJSON();
        
        // Get total stock for this product
        const stockRecords = await Stock.findAll({
          where: { product_key: product.product_key },
          attributes: ["quantity", "reserved_quantity"],
        });

        const totalStock = stockRecords.reduce((sum, s) => sum + parseFloat(s.quantity || 0), 0);
        const totalAvailable = stockRecords.reduce(
          (sum, s) => sum + (parseFloat(s.quantity || 0) - parseFloat(s.reserved_quantity || 0)),
          0
        );

        return {
          ...productData,
          total_stock: totalStock,
          total_available: totalAvailable,
          needs_reorder: productData.reorder_point && totalAvailable < parseFloat(productData.reorder_point),
        };
      })
    );

    return productsWithStock;
  }

  async getProduct(product_key) {
    const product = await Product.findOne({
      where: { product_key },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_key", "category_id", "name", "description"],
          required: false,
        },
      ],
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const productData = product.toJSON();
    
    // Get stock info separately
    const stockRecords = await Stock.findAll({
      where: { product_key },
      attributes: ["stock_key", "location_key", "quantity", "reserved_quantity", "last_updated"],
    });

    const totalStock = stockRecords.reduce((sum, s) => sum + parseFloat(s.quantity || 0), 0);
    const totalAvailable = stockRecords.reduce(
      (sum, s) => sum + (parseFloat(s.quantity || 0) - parseFloat(s.reserved_quantity || 0)),
      0
    );

    return {
      ...productData,
      stock: stockRecords,
      total_stock: totalStock,
      total_available: totalAvailable,
      needs_reorder: productData.reorder_point && totalAvailable < parseFloat(productData.reorder_point),
    };
  }

  async createProduct(productData, initialStock = []) {
    const transaction = await sequelize.transaction();

    try {
      // Generate product_id if not provided
      if (!productData.product_id) {
        const count = await Product.count();
        productData.product_id = `PROD-${String(count + 1).padStart(6, "0")}`;
      }

      // Create product
      const product = await Product.create(productData, { transaction });

      // Create initial stock if provided
      if (initialStock && initialStock.length > 0) {
        const stockEntries = initialStock.map((stock) => ({
          product_key: product.product_key,
          location_key: stock.location_key,
          quantity: stock.quantity || 0,
          reserved_quantity: 0,
        }));

        await Stock.bulkCreate(stockEntries, { transaction });
      }

      await transaction.commit();

      // Fetch and return the complete product with associations
      return await this.getProduct(product.product_key);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateProduct(product_key, productData) {
    const product = await Product.findByPk(product_key);

    if (!product) {
      throw new Error("Product not found");
    }

    await product.update(productData);
    return await this.getProduct(product_key);
  }

  async deactivateProduct(product_key) {
    const product = await Product.findByPk(product_key);

    if (!product) {
      throw new Error("Product not found");
    }

    await product.update({ is_active: false });
    return await this.getProduct(product_key);
  }

  async reactivateProduct(product_key) {
    const product = await Product.findByPk(product_key);

    if (!product) {
      throw new Error("Product not found");
    }

    await product.update({ is_active: true });
    return await this.getProduct(product_key);
  }

  async getStockByLocation(product_key, location_key = null) {
    const where = { product_key };

    if (location_key) {
      where.location_key = location_key;
    }

    const stocks = await Stock.findAll({
      where,
      attributes: ["stock_key", "product_key", "location_key", "quantity", "reserved_quantity", "last_updated"],
      order: [["location_key", "ASC"]],
    });

    // Get location details separately if needed
    const stocksWithDetails = await Promise.all(
      stocks.map(async (stock) => {
        const stockData = stock.toJSON();
        const location = await Location.findByPk(stock.location_key, {
          attributes: ["location_key", "location_id", "location_name", "location_code", "warehouse_key"],
        });

        return {
          ...stockData,
          location: location ? location.toJSON() : null,
          available_quantity: parseFloat(stockData.quantity || 0) - parseFloat(stockData.reserved_quantity || 0),
        };
      })
    );

    return stocksWithDetails;
  }

  async updateStock(product_key, location_key, quantity, isAdjustment = false) {
    const transaction = await sequelize.transaction();

    try {
      let stock = await Stock.findOne({
        where: { product_key, location_key },
      });

      if (!stock) {
        // Create new stock entry
        stock = await Stock.create(
          {
            product_key,
            location_key,
            quantity: isAdjustment ? quantity : 0,
            reserved_quantity: 0,
          },
          { transaction }
        );
      }

      // Update quantity
      if (isAdjustment) {
        // Direct adjustment - set to the specified quantity
        await stock.update(
          {
            quantity,
            last_updated: new Date(),
          },
          { transaction }
        );
      } else {
        // Incremental update - add/subtract from current quantity
        await stock.update(
          {
            quantity: parseFloat(stock.quantity) + parseFloat(quantity),
            last_updated: new Date(),
          },
          { transaction }
        );
      }

      await transaction.commit();
      return await this.getStockByLocation(product_key, location_key);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getLowStockProducts() {
    const products = await this.getProducts({ is_active: true });
    return products.filter((p) => p.needs_reorder);
  }
}

export default new ProductService();
