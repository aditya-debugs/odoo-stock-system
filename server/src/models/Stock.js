import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Stock = sequelize.define(
  "Stock",
  {
    stock_key: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "dim_product",
        key: "product_key",
      },
    },
    location_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    reserved_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    available_quantity: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.quantity - this.reserved_quantity;
      },
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: "dim_stock",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["product_key", "location_key"],
      },
      {
        fields: ["product_key"],
      },
      {
        fields: ["location_key"],
      },
    ],
  }
);

export default Stock;
