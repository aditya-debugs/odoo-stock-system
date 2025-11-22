import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const StockMovement = sequelize.define(
  "dim_stock_movement",
  {
    movement_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "movement_key",
    },
    movement_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "movement_id",
    },
    movement_type: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "movement_type",
      comment: "receipt, delivery, transfer, adjustment",
    },
    reference: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "reference",
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
    source_location_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "source_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    destination_location_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "destination_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "quantity",
    },
    uom: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "uom",
    },
    movement_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "movement_date",
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "notes",
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
    tableName: "dim_stock_movement",
    timestamps: false,
    indexes: [
      {
        fields: ["movement_type"],
      },
      {
        fields: ["product_key"],
      },
      {
        fields: ["source_location_key"],
      },
      {
        fields: ["destination_location_key"],
      },
      {
        fields: ["movement_date"],
      },
    ],
  }
);

export default StockMovement;
