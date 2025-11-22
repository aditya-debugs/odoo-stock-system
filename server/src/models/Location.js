import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Location = sequelize.define(
  "dim_location",
  {
    location_key: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "location_key",
    },
    location_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: "location_id",
    },
    location_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "location_name",
    },
    location_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
      field: "location_code",
    },
    location_type: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "location_type",
      comment: "e.g., Internal, Transit, Customer, Supplier",
    },
    warehouse_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "warehouse_key",
      references: {
        model: "dim_warehouse",
        key: "warehouse_key",
      },
    },
    parent_location_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "parent_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    barcode: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "barcode",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updated_at",
    },
  },
  {
    tableName: "dim_location",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["location_code"],
      },
      {
        fields: ["location_name"],
      },
      {
        fields: ["warehouse_key"],
      },
    ],
  }
);

export default Location;
