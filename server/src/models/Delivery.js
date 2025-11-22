import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Delivery = sequelize.define(
  "fact_delivery",
  {
    delivery_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "delivery_key",
    },
    delivery_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "delivery_id",
    },
    customer_name: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "customer_name",
    },
    source_location_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "source_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "delivery_date",
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
    tableName: "fact_delivery",
    timestamps: false,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["delivery_date"],
      },
    ],
  }
);

export default Delivery;
