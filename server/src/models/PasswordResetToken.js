import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PasswordResetToken = sequelize.define(
  "password_reset_token",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "dim_user",
        key: "user_key",
      },
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "password_reset_tokens",
    timestamps: false,
    indexes: [
      {
        fields: ["email"],
      },
      {
        fields: ["otp"],
      },
    ],
  }
);

export default PasswordResetToken;
