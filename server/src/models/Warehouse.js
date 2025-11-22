import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Warehouse = sequelize.define(
  "dim_warehouse",
  {
    warehouse_key: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "warehouse_key",
    },
    warehouse_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      field: "warehouse_id",
    },
    warehouse_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "warehouse_name",
    },
    warehouse_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
      field: "warehouse_code",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "address",
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "city",
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "state",
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "country",
    },
    postal_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "postal_code",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
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
    tableName: "dim_warehouse",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["warehouse_code"],
      },
      {
        fields: ["warehouse_name"],
      },
    ],
  }
);

export default Warehouse;
