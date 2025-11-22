import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TransferLine = sequelize.define(
  "fact_transfer_lines",
  {
    transfer_line_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "transfer_line_key",
    },
    transfer_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "transfer_key",
      references: {
        model: "fact_transfer",
        key: "transfer_key",
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
    tableName: "fact_transfer_lines",
    timestamps: false,
  }
);

export default TransferLine;
