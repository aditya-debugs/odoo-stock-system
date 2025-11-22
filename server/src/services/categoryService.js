import { Category, Product } from "../models/index.js";
import { Op } from "sequelize";

class CategoryService {
  async getCategories(filters = {}) {
    const { search, is_active } = filters;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { category_id: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const categories = await Category.findAll({
      where,
      attributes: {
        include: [
          [
            // Count of products in each category
            Category.sequelize.literal(`(
              SELECT COUNT(*)
              FROM dim_product
              WHERE dim_product.category_key = "Category".category_key
            )`),
            "product_count",
          ],
        ],
      },
      order: [["name", "ASC"]],
    });

    return categories;
  }

  async getCategory(category_key) {
    const category = await Category.findOne({
      where: { category_key },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["product_key", "name", "sku", "is_active"],
        },
      ],
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async createCategory(categoryData) {
    // Generate category_id if not provided
    if (!categoryData.category_id) {
      const count = await Category.count();
      categoryData.category_id = `CAT-${String(count + 1).padStart(6, "0")}`;
    }

    const category = await Category.create(categoryData);
    return await this.getCategory(category.category_key);
  }

  async updateCategory(category_key, categoryData) {
    const category = await Category.findByPk(category_key);

    if (!category) {
      throw new Error("Category not found");
    }

    await category.update(categoryData);
    return await this.getCategory(category_key);
  }

  async deactivateCategory(category_key) {
    const category = await Category.findByPk(category_key);

    if (!category) {
      throw new Error("Category not found");
    }

    // Check if category has active products
    const activeProductCount = await Product.count({
      where: {
        category_key,
        is_active: true,
      },
    });

    if (activeProductCount > 0) {
      throw new Error(`Cannot deactivate category with ${activeProductCount} active product(s)`);
    }

    await category.update({ is_active: false });
    return await this.getCategory(category_key);
  }

  async reactivateCategory(category_key) {
    const category = await Category.findByPk(category_key);

    if (!category) {
      throw new Error("Category not found");
    }

    await category.update({ is_active: true });
    return await this.getCategory(category_key);
  }
}

export default new CategoryService();
