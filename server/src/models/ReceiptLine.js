import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ReceiptLine = sequelize.define(
  "fact_receipt_line",
  {
    receipt_line_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "receipt_line_key",
    },
    receipt_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "receipt_key",
      references: {
        model: "fact_receipt",
        key: "receipt_key",
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
    tableName: "fact_receipt_line",
    timestamps: false,
  }
);

export default ReceiptLine;
