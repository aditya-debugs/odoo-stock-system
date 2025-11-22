import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Add other columns that exist in your table
  },
  {
    tableName: "products", // IMPORTANT: Use the exact table name from pgAdmin
    timestamps: true, // Set to false if your table doesn't have createdAt/updatedAt
    // If your table has different timestamp column names:
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
  }
);

export default Product;
