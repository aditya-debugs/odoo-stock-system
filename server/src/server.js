import app from "./app.js";
import { sequelize } from "./config/db.js";
import logger from "./config/logger.js";
import { Role, User } from "./models/index.js";
import { up as migrateAddPassword } from "./migrations/add_password_to_dim_user.js";
import createPasswordResetTokensTable from "./migrations/create_password_reset_tokens.js";

const PORT = process.env.PORT || 5000;

// Model associations are defined in models/index.js

// Run database migrations
const runMigrations = async () => {
  try {
    await migrateAddPassword();
    await createPasswordResetTokensTable();
    logger.info("Database migrations completed successfully");
  } catch (error) {
    logger.error("Migration error:", error.message);
    // Don't fail startup due to migration errors
  }
};

// Initialize default roles
const initializeRoles = async () => {
  try {
    // Create default roles if they don't exist
    const roles = [
      { role_name: "admin", role_id: 1 },
      { role_name: "user", role_id: 2 },
      { role_name: "manager", role_id: 3 },
      { role_name: "viewer", role_id: 4 },
    ];

    for (const role of roles) {
      await Role.findOrCreate({
        where: { role_name: role.role_name },
        defaults: role,
      });
    }

    logger.info("Default roles initialized");
  } catch (error) {
    logger.error("Error initializing roles:", error.message);
  }
};

// Test database connection and start server
// NOTE: Make startup tolerant to DB connection failures so dev-only endpoints
// like demo-login can still work when the DB is down. We log the error but
// continue to start the HTTP server.
const startServer = async () => {
  let dbConnected = false;
  try {
    await sequelize.authenticate();
    logger.info("Database connection established successfully");
    dbConnected = true;

    // IMPORTANT: Do NOT sync models when using existing tables from pgAdmin
    // Syncing can modify or drop your existing tables!
    // Only authenticate the connection, don't sync
    // await sequelize.sync({ force: false })
    // await sequelize.sync();
    logger.info("Using existing database tables");

    // Run migrations
    await runMigrations();

    // Initialize default roles
    await initializeRoles();
  } catch (error) {
    logger.error("Unable to connect to database:", error.message);
    logger.warn("Server will start without database connection");
  }

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`Database connected: ${dbConnected}`);
  });
};

startServer();
