import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Delivery = sequelize.define(
  "fact_deliveries",
  {
    delivery_key: {
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
    customer_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sales_order_no: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pickup_date_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "fact_deliveries",
    timestamps: false,
    indexes: [
      {
        fields: ["operation_key"],
      },
    ],
  }
);

export default Delivery;
