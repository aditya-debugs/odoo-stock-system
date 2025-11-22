import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Transfer = sequelize.define(
  "fact_transfer",
  {
    transfer_key: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: "transfer_key",
    },
    transfer_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "transfer_id",
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
    destination_location_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "destination_location_key",
      references: {
        model: "dim_location",
        key: "location_key",
      },
    },
    transfer_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "transfer_date",
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
    tableName: "fact_transfer",
    timestamps: false,
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["transfer_date"],
      },
    ],
  }
);

export default Transfer;
