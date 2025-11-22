import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Transfer = sequelize.define(
  "fact_transfers",
  {
    transfer_key: {
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
    transfer_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_transfers",
    timestamps: false,
    indexes: [
      {
        fields: ["operation_key"],
      },
    ],
  }
);

export default Transfer;
