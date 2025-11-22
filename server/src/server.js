import app from "./app.js";
import { sequelize } from "./config/db.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 5000;

// Test database connection and start server
// NOTE: Make startup tolerant to DB connection failures so dev-only endpoints
// like demo-login can still work when the DB is down. We log the error but
// continue to start the HTTP server.
const startServer = async () => {
  let dbConnected = false;
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");

    // Sync models (use { force: true } to drop tables on restart - only in dev)
    // await sequelize.sync({ force: false })
    await sequelize.sync();
    logger.info("Database models synchronized");
    dbConnected = true;
  } catch (error) {
    // Do not exit the process in dev — allow server to start for demo routes.
    logger.error("Database connection failed (continuing without DB):", error);
  }

  // Expose DB connection status to request handlers if needed
  app.locals.dbConnected = dbConnected;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Database connected: ${dbConnected}`);
  });
};

startServer();
