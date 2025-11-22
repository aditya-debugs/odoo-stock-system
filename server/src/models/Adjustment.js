import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Adjustment = sequelize.define(
  "fact_adjustments",
  {
    adjustment_key: {
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
    adjustment_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    counted_quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_adjustments",
    timestamps: false,
    indexes: [
      {
        fields: ["operation_key"],
      },
    ],
  }
);

export default Adjustment;
