import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    product_key: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "dim_category",
        key: "category_key",
      },
    },
    uom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Pieces",
    },
    reorder_point: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "dim_product",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Product;
