import sequelize from "../config/db.js";
import logger from "../config/logger.js";

const createPasswordResetTokensTable = async () => {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id BIGSERIAL PRIMARY KEY,
        user_key BIGINT NOT NULL REFERENCES dim_user(user_key) ON DELETE CASCADE,
        email TEXT NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_tokens(email);
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_password_reset_otp ON password_reset_tokens(otp);
    `);

    logger.info("✅ Password reset tokens table created successfully");
  } catch (error) {
    logger.error("❌ Error creating password_reset_tokens table:", error.message);
    throw error;
  }
};

export default createPasswordResetTokensTable;
