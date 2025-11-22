import { hasPermission } from "../constants/roles.js";
import logger from "../config/logger.js";

/**
 * Middleware to check if user has required permission for a resource
 * @param {string} resource - Resource name (products, inventory, operations, warehouses, locations, settings, reports, users)
 * @param {string} permission - Required permission (read, write, update, delete, execute)
 */
export const requirePermission = (resource, permission) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { role } = req.user;

      // Check if user has the required permission
      if (!hasPermission(role, resource, permission)) {
        logger.warn(
          `Access denied: User ${req.user.email} (${role}) attempted to ${permission} ${resource}`
        );
        return res.status(403).json({
          success: false,
          message: "You don't have permission to perform this action",
          required: `${permission} access to ${resource}`,
          yourRole: role === "inventory_manager" ? "Inventory Manager" : "Warehouse Staff",
        });
      }

      next();
    } catch (error) {
      logger.error("Authorization middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};

/**
 * Middleware to check if user is Inventory Manager (full access)
 */
export const requireInventoryManager = () => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const { role } = req.user;

      if (role !== "inventory_manager") {
        logger.warn(
          `Access denied: User ${req.user.email} (${role}) attempted to access Inventory Manager only resource`
        );
        return res.status(403).json({
          success: false,
          message: "This feature is only available to Inventory Managers",
          yourRole: role === "warehouse_staff" ? "Warehouse Staff" : role,
        });
      }

      next();
    } catch (error) {
      logger.error("Inventory Manager check error:", error);
      res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};

/**
 * Middleware to attach user permissions to request object
 */
export const attachPermissions = async (req, res, next) => {
  try {
    if (req.user) {
      const { role } = req.user;
      req.permissions = {
        // Product permissions
        canReadProducts: hasPermission(role, "products", "read"),
        canWriteProducts: hasPermission(role, "products", "write"),
        canUpdateProducts: hasPermission(role, "products", "update"),
        canDeleteProducts: hasPermission(role, "products", "delete"),

        // Inventory permissions
        canReadInventory: hasPermission(role, "inventory", "read"),
        canWriteInventory: hasPermission(role, "inventory", "write"),
        canUpdateInventory: hasPermission(role, "inventory", "update"),
        canDeleteInventory: hasPermission(role, "inventory", "delete"),
        canExecuteInventory: hasPermission(role, "inventory", "execute"),

        // Operations permissions
        canReadOperations: hasPermission(role, "operations", "read"),
        canWriteOperations: hasPermission(role, "operations", "write"),
        canExecuteOperations: hasPermission(role, "operations", "execute"),

        // Warehouse/Location permissions
        canReadWarehouses: hasPermission(role, "warehouses", "read"),
        canWriteWarehouses: hasPermission(role, "warehouses", "write"),
        canReadLocations: hasPermission(role, "locations", "read"),
        canWriteLocations: hasPermission(role, "locations", "write"),

        // Settings permissions
        canReadSettings: hasPermission(role, "settings", "read"),
        canWriteSettings: hasPermission(role, "settings", "write"),

        // Report permissions
        canReadReports: hasPermission(role, "reports", "read"),
        canWriteReports: hasPermission(role, "reports", "write"),

        // Role checks
        isInventoryManager: role === "inventory_manager",
        isWarehouseStaff: role === "warehouse_staff",

        // Utility
        role,
        hasPermission: (resource, permission) => hasPermission(role, resource, permission),
      };
    }
    next();
  } catch (error) {
    logger.error("Attach permissions error:", error);
    next(); // Continue even if permission attachment fails
  }
};

export default {
  requirePermission,
  requireInventoryManager,
  attachPermissions,
};
