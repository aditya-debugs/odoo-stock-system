import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const DeliveryLine = sequelize.define(
  "fact_delivery_lines",
  {
    delivery_line_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "delivery_line_key",
    },
    delivery_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "delivery_key",
      references: {
        model: "fact_delivery",
        key: "delivery_key",
      },
      onDelete: "CASCADE",
    },
    product_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_key",
      references: {
        model: "dim_product",
        key: "product_key",
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "quantity",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "fact_delivery_lines",
    timestamps: false,
  }
);

export default DeliveryLine;
