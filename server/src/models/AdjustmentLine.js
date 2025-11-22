import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AdjustmentLine = sequelize.define(
  "fact_adjustment_lines",
  {
    adjustment_line_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "adjustment_line_key",
    },
    adjustment_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "adjustment_key",
      references: {
        model: "fact_adjustment",
        key: "adjustment_key",
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
    system_quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "system_quantity",
      comment: "Recorded stock before adjustment",
    },
    counted_quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "counted_quantity",
      comment: "Physical count",
    },
    difference: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "difference",
      comment: "counted - system",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "fact_adjustment_lines",
    timestamps: false,
  }
);

export default AdjustmentLine;
