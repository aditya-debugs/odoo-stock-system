import sequelize from "../config/db.js";
import {
  StockMovement,
  Receipt,
  ReceiptLine,
  Delivery,
  DeliveryLine,
  Transfer,
  TransferLine,
  Adjustment,
  AdjustmentLine,
} from "../models/index.js";
import logger from "../config/logger.js";

const createOperationsTables = async () => {
  try {
    logger.info("Starting operations tables migration...");

    // Sync all operation models
    await StockMovement.sync({ force: false });
    logger.info("✓ dim_stock_movement table created/verified");

    await Receipt.sync({ force: false });
    logger.info("✓ fact_receipt table created/verified");

    await ReceiptLine.sync({ force: false });
    logger.info("✓ fact_receipt_line table created/verified");

    await Delivery.sync({ force: false });
    logger.info("✓ fact_delivery table created/verified");

    await DeliveryLine.sync({ force: false });
    logger.info("✓ fact_delivery_line table created/verified");

    await Transfer.sync({ force: false });
    logger.info("✓ fact_transfer table created/verified");

    await TransferLine.sync({ force: false });
    logger.info("✓ fact_transfer_line table created/verified");

    await Adjustment.sync({ force: false });
    logger.info("✓ fact_adjustment table created/verified");

    await AdjustmentLine.sync({ force: false });
    logger.info("✓ fact_adjustment_line table created/verified");

    logger.info("✅ All operations tables created successfully!");
  } catch (error) {
    logger.error("Error creating operations tables:", error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createOperationsTables()
    .then(() => {
      logger.info("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Migration failed:", error);
      process.exit(1);
    });
}

export default createOperationsTables;
