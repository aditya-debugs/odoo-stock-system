# RBAC Implementation Summary - 2 Role System

## Overview
The Role-Based Access Control (RBAC) system has been simplified to exactly **2 roles** as per requirements:
1. **Inventory Manager** - Full access to all system resources
2. **Warehouse Staff** - Execution access + View only (NO settings access)

## Roles and Permissions

### 1. Inventory Manager (Full Access)
**Role Name:** `inventory_manager`  
**Access Level:** Full CRUD operations on all resources

| Resource | Permissions |
|----------|------------|
| Products | read, write, update, delete |
| Inventory | read, write, update, delete, execute |
| Operations | read, write, update, delete, execute |
| Warehouses | read, write, update, delete |
| Locations | read, write, update, delete |
| **Settings** | read, write, update, delete |
| Reports | read, write, update, delete |
| Users | read, write, update, delete |

### 2. Warehouse Staff (Execution Access)
**Role Name:** `warehouse_staff`  
**Access Level:** Read + Execute operations, View products/warehouses, **NO settings access**

| Resource | Permissions |
|----------|------------|
| Products | read only |
| Inventory | read, execute |
| Operations | read, execute |
| Warehouses | read only |
| Locations | read only |
| **Settings** | ❌ **NO ACCESS** |
| Reports | read only |
| Users | ❌ **NO ACCESS** |

## Implementation Details

### Backend Files Updated

1. **`server/src/constants/roles.js`**
   - Defines 2 roles with complete permission matrix
   - 8 resources: products, inventory, operations, warehouses, locations, settings, reports, users
   - 5 permission types: read, write, update, delete, execute
   - Exports `hasPermission()` utility function

2. **`server/src/middleware/authorizationMiddleware.js`** *(NEW FILE)*
   - `requirePermission(resource, permission)` - Check specific permission, returns 403 if denied
   - `requireInventoryManager()` - Restrict route to Inventory Managers only
   - `attachPermissions()` - Add permission flags to request object for controllers

3. **`server/src/seeds/seedDatabase.js`**
   - Seeds 2 roles into `dim_role` table:
     - `role_id: 5` → `inventory_manager`
     - `role_id: 6` → `warehouse_staff`
   - Creates 2 test users (see Test Accounts section)

4. **`server/src/services/userService.js`**
   - Updated `allowedRoles` validation to only accept: `["inventory_manager", "warehouse_staff"]`
   - Default role changed from `"user"` to `"warehouse_staff"`
   - Registration validates role selection

### Frontend Files Updated

1. **`client/src/hooks/usePermissions.js`**
   - Updated `ROLE_PERMISSIONS` to match backend 2-role structure
   - Added permission hooks for all 8 resources
   - Returns boolean flags: `canReadProducts`, `canWriteInventory`, `canExecuteOperations`, etc.
   - Role checks: `isInventoryManager`, `isWarehouseStaff`

2. **`client/src/pages/Signup.jsx`**
   - Added role selection dropdown with **only 2 options**:
     - Warehouse Staff (Execution Access) - Default
     - Inventory Manager (Full Access)
   - Form validates and submits selected role to backend

3. **`client/src/pages/Dashboard.jsx`**
   - Displays role-based permission banner
   - Shows action buttons (View/Edit/Delete/Execute) based on user permissions
   - Uses `usePermissions` hook for conditional rendering

## Database Schema

### Roles Table (`dim_role`)
```sql
role_id | role_name          | role_key
--------|-------------------|----------
5       | inventory_manager | 5
6       | warehouse_staff   | 6
```

### Users Table (`dim_user`)
```sql
user_id | name                | email                     | role_key
--------|---------------------|---------------------------|----------
...     | Inventory Manager   | manager@stockmaster.com   | 5
...     | Warehouse Staff     | staff@stockmaster.com     | 6
```

## Test Accounts

### Inventory Manager (Full Access)
```
Email: manager@stockmaster.com
Password: Manager@123456
Role: inventory_manager
Permissions: Full CRUD on all resources including settings
```

### Warehouse Staff (Execution Only)
```
Email: staff@stockmaster.com
Password: Staff@123456
Role: warehouse_staff
Permissions: Read + Execute operations, View products/warehouses, NO settings access
```

## Usage Examples

### Backend Middleware Usage

```javascript
import { requirePermission, requireInventoryManager } from '../middleware/authorizationMiddleware.js';

// Protect a route with specific permission
router.post('/products', 
  authenticate, 
  requirePermission('products', 'write'), 
  createProduct
);

// Restrict route to Inventory Managers only
router.put('/settings', 
  authenticate, 
  requireInventoryManager(), 
  updateSettings
);

// Check permissions in controller
router.get('/warehouses', 
  authenticate, 
  attachPermissions(), 
  (req, res) => {
    if (req.permissions.canWriteWarehouses) {
      // Show edit buttons
    } else {
      // Show read-only view
    }
  }
);
```

### Frontend Permission Checks

```javascript
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const permissions = usePermissions(user);

  return (
    <>
      {/* Settings link only for Inventory Manager */}
      {permissions.canReadSettings && (
        <Link to="/settings">⚙️ Settings</Link>
      )}

      {/* Execute button for warehouse staff */}
      {permissions.canExecuteOperations && (
        <button onClick={executeOperation}>Execute</button>
      )}

      {/* Edit button for managers */}
      {permissions.canUpdateProducts && (
        <button onClick={editProduct}>Edit</button>
      )}
    </>
  );
}
```

## Security Features

1. **Backend Validation**: `userService.js` only accepts 2 valid roles during registration
2. **Middleware Protection**: Routes protected with `requirePermission()` checks
3. **Frontend UI**: Conditional rendering based on user permissions
4. **Role Checks**: `isInventoryManager` and `isWarehouseStaff` boolean flags
5. **Settings Protection**: Warehouse Staff has **zero access** to settings module

## Key Differences from Previous Implementation

| Aspect | Previous (6 roles) | Current (2 roles) |
|--------|-------------------|-------------------|
| Role Count | 6 roles (admin, manager, user, etc.) | 2 roles (inventory_manager, warehouse_staff) |
| Settings Access | Multiple roles had partial access | **ONLY Inventory Manager** has full access |
| Warehouse Staff | Limited read access | Read + **Execute** operations |
| Complexity | Complex permission matrix | Simplified, clear boundaries |
| Default Role | "user" | "warehouse_staff" |

## Next Steps

1. ✅ **Completed**: Backend RBAC structure (roles, middleware, seeds)
2. ✅ **Completed**: Frontend updates (Signup form, usePermissions hook)
3. ✅ **Completed**: Database seed with 2 roles and test users
4. ⏳ **Pending**: Test login with both test accounts
5. ⏳ **Pending**: Verify permission checks work on Dashboard
6. ⏳ **Pending**: Apply middleware to protected routes
7. ⏳ **Pending**: Update main RBAC_IMPLEMENTATION.md documentation

## Testing Checklist

### Inventory Manager Testing
- [ ] Login with `manager@stockmaster.com`
- [ ] Verify full dashboard access (all buttons visible)
- [ ] Verify Settings link is accessible
- [ ] Test Create, Update, Delete operations
- [ ] Test Execute operations

### Warehouse Staff Testing
- [ ] Login with `staff@stockmaster.com`
- [ ] Verify limited dashboard access (only View + Execute buttons)
- [ ] Verify Settings link is **hidden/disabled**
- [ ] Test Execute operations (should work)
- [ ] Test Create/Update/Delete (should fail with 403)

## Files Changed

### Created
- `server/src/middleware/authorizationMiddleware.js`
- `RBAC_2ROLES_SUMMARY.md` (this file)

### Modified
- `server/src/constants/roles.js`
- `server/src/seeds/seedDatabase.js`
- `server/src/services/userService.js`
- `client/src/hooks/usePermissions.js`
- `client/src/pages/Signup.jsx`
- `client/src/pages/Dashboard.jsx` (already had permission checks)

## Configuration Notes

- **Database**: Roles seeded with IDs 5 and 6
- **Default Role**: `warehouse_staff` for new signups
- **Test Passwords**: Both follow format `<Role>@123456`
- **Permission Matrix**: Matches backend `roles.js` exactly

---

**Implementation Date**: 2025-11-22  
**Status**: ✅ Backend Complete | ✅ Frontend Complete | ✅ Database Seeded | ⏳ Testing Pending
