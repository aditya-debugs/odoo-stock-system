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

    // IMPORTANT: Do NOT sync models when using existing tables from pgAdmin
    // Syncing can modify or drop your existing tables!
    // Only authenticate the connection, don't sync
    // await sequelize.sync({ force: false })
    await sequelize.sync();
    logger.info("Database models synchronized");

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Database connected: ${dbConnected}`);
  });
};

startServer();
