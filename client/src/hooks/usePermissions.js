import { createContext, useContext } from "react";

// Permission checker utility - matches backend roles.js
const ROLE_PERMISSIONS = {
  inventory_manager: {
    products: ["read", "write", "update", "delete"],
    inventory: ["read", "write", "update", "delete", "execute"],
    operations: ["read", "write", "update", "delete", "execute"],
    warehouses: ["read", "write", "update", "delete"],
    locations: ["read", "write", "update", "delete"],
    settings: ["read", "write", "update", "delete"],
    reports: ["read", "write", "update", "delete"],
    users: ["read", "write", "update", "delete"],
  },
  warehouse_staff: {
    products: ["read"],
    inventory: ["read", "execute"],
    operations: ["read", "execute"],
    warehouses: ["read"],
    locations: ["read"],
    settings: [],
    reports: ["read"],
    users: [],
  },
};

export const hasPermission = (role, resource, permission) => {
  const rolePerms = ROLE_PERMISSIONS[role];
  if (!rolePerms || !rolePerms[resource]) return false;
  return rolePerms[resource].includes(permission);
};

// Permission hooks
export const usePermissions = (user) => {
  const role = user?.role || "user";

  return {
    // Products permissions
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
    canUpdateOperations: hasPermission(role, "operations", "update"),
    canDeleteOperations: hasPermission(role, "operations", "delete"),
    canExecuteOperations: hasPermission(role, "operations", "execute"),

    // Warehouses permissions
    canReadWarehouses: hasPermission(role, "warehouses", "read"),
    canWriteWarehouses: hasPermission(role, "warehouses", "write"),
    canUpdateWarehouses: hasPermission(role, "warehouses", "update"),
    canDeleteWarehouses: hasPermission(role, "warehouses", "delete"),

    // Locations permissions
    canReadLocations: hasPermission(role, "locations", "read"),
    canWriteLocations: hasPermission(role, "locations", "write"),
    canUpdateLocations: hasPermission(role, "locations", "update"),
    canDeleteLocations: hasPermission(role, "locations", "delete"),

    // Settings permissions
    canReadSettings: hasPermission(role, "settings", "read"),
    canWriteSettings: hasPermission(role, "settings", "write"),
    canUpdateSettings: hasPermission(role, "settings", "update"),
    canDeleteSettings: hasPermission(role, "settings", "delete"),

    // Reports permissions
    canReadReports: hasPermission(role, "reports", "read"),
    canWriteReports: hasPermission(role, "reports", "write"),
    canUpdateReports: hasPermission(role, "reports", "update"),
    canDeleteReports: hasPermission(role, "reports", "delete"),

    // Users permissions
    canReadUsers: hasPermission(role, "users", "read"),
    canWriteUsers: hasPermission(role, "users", "write"),
    canUpdateUsers: hasPermission(role, "users", "update"),
    canDeleteUsers: hasPermission(role, "users", "delete"),

    // Role checks
    isInventoryManager: role === "inventory_manager",
    isWarehouseStaff: role === "warehouse_staff",

    // Utility
    role,
    hasPermission: (resource, permission) => hasPermission(role, resource, permission),
  };
};

export default usePermissions;
