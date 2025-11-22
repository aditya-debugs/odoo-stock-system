import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Receipt = sequelize.define(
  "fact_receipt",
  {
    receipt_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "receipt_key",
    },
    receipt_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "receipt_id",
    },
    supplier_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "supplier_name",
    },
    destination_location_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "destination_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    receipt_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "receipt_date",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "draft",
      field: "status",
      comment: "draft, validated",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "notes",
    },
    validated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "validated_by",
      references: {
        model: "dim_user",
        key: "user_key",
      },
    },
    validated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "validated_at",
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "created_by",
      references: {
        model: "dim_user",
        key: "user_key",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    tableName: "fact_receipt",
    timestamps: false,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["receipt_date"],
      },
    ],
  }
);

export default Receipt;
