export const ROLES = {
  INVENTORY_MANAGER: "inventory_manager",
  WAREHOUSE_STAFF: "warehouse_staff",
};

export const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  UPDATE: "update",
  EXECUTE: "execute",
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  inventory_manager: {
    // Full Access to everything
    products: ["read", "write", "delete", "update"],
    inventory: ["read", "write", "delete", "update", "execute"],
    operations: ["read", "write", "delete", "update", "execute"],
    warehouses: ["read", "write", "delete", "update"],
    locations: ["read", "write", "delete", "update"],
    settings: ["read", "write", "update"],
    reports: ["read", "write"],
    users: ["read"],
  },
  warehouse_staff: {
    // Execution Access + View Only
    products: ["read"], // View Only
    inventory: ["read", "execute"], // View + Execute operations
    operations: ["read", "execute"], // View + Execute transfers, picking, shelving
    warehouses: ["read"], // View Only
    locations: ["read"], // View Only (cannot create/edit locations)
    settings: [], // No Access to settings
    reports: ["read"], // View Only
    users: [], // No Access
  },
};

// Check if a role has a specific permission for a resource
export const hasPermission = (roleName, resource, permission) => {
  const rolePerms = ROLE_PERMISSIONS[roleName];
  if (!rolePerms || !rolePerms[resource]) return false;
  return rolePerms[resource].includes(permission);
};

export default { ROLES, PERMISSIONS, ROLE_PERMISSIONS, hasPermission };
