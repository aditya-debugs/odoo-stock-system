import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const StockMovement = sequelize.define(
  "fact_stock_movement",
  {
    movement_key: {
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
    product_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "dim_product",
        key: "product_key",
      },
    },
    from_location_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    to_location_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    op_type_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    date_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity_change: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    balance_after: {
      type: DataTypes.DECIMAL,
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
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_stock_movement",
    timestamps: false,
    indexes: [
      {
        fields: ["operation_key"],
      },
      {
        fields: ["product_key"],
      },
      {
        fields: ["from_location_key"],
      },
      {
        fields: ["to_location_key"],
      },
    ],
  }
);

export default StockMovement;
