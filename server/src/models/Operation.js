import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Operation = sequelize.define(
  "fact_operation",
  {
    operation_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    operation_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    op_type_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "dim_user",
        key: "user_key",
      },
    },
    validated_by_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "dim_user",
        key: "user_key",
      },
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "draft",
      comment: "draft, validated, cancelled",
    },
    reference_no: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_date_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    validated_date_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    document_total_qty: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    meta: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Flexible JSON field for operation-specific metadata",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_operation",
    timestamps: false,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["created_by_key"],
      },
      {
        fields: ["op_type_key"],
      },
    ],
  }
);

export default Operation;
