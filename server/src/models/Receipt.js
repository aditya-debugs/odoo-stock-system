import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Receipt = sequelize.define(
  "fact_receipts",
  {
    receipt_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    operation_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "fact_operation",
        key: "operation_key",
      },
    },
    supplier_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    invoice_number: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expected_date_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_receipts",
    timestamps: false,
    indexes: [
      {
        fields: ["operation_key"],
      },
    ],
  }
);

export default Receipt;
