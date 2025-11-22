import sequelize from "../config/db.js";
import logger from "../config/logger.js";

// Import all models to ensure they're registered
import {
  User,
  Role,
  Product,
  Category,
  Stock,
  Warehouse,
  Location,
  StockMovement,
  Receipt,
  ReceiptLine,
  Delivery,
  DeliveryLine,
  Transfer,
  TransferLine,
  Adjustment,
  AdjustmentLine,
  PasswordResetToken,
} from "../models/index.js";

const runAllMigrations = async () => {
  try {
    logger.info("🔄 Starting database migrations...");

    // Test database connection
    await sequelize.authenticate();
    logger.info("✓ Database connection established");

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: false });
    logger.info("✓ All database tables synchronized");

    // List all created tables
    const tables = [
      "dim_role",
      "dim_user",
      "dim_warehouse",
      "dim_location",
      "dim_category",
      "dim_product",
      "dim_stock",
      "dim_stock_movement",
      "fact_receipt",
      "fact_receipt_line",
      "fact_delivery",
      "fact_delivery_line",
      "fact_transfer",
      "fact_transfer_line",
      "fact_adjustment",
      "fact_adjustment_line",
      "password_reset_tokens",
    ];

    logger.info("\n📋 Expected tables:");
    tables.forEach((table) => logger.info(`   - ${table}`));

    logger.info("\n✅ All migrations completed successfully!");
    logger.info("\n🎉 Database is ready for use!");
  } catch (error) {
    logger.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllMigrations()
    .then(() => {
      logger.info("\n✨ Migration process completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("\n💥 Migration process failed:", error);
      process.exit(1);
    });
}

export default runAllMigrations;
