import app from "./app.js";
import { sequelize } from "./config/db.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

// Test database connection and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");

    // IMPORTANT: Do NOT sync models when using existing tables from pgAdmin
    // Syncing can modify or drop your existing tables!
    // Only authenticate the connection, don't sync
    // await sequelize.sync({ force: false })
    // await sequelize.sync();
    logger.info("Using existing database tables");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
