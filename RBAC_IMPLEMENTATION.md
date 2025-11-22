# 🔐 Role-Based Access Control (RBAC) Implementation

## Overview

The system now implements comprehensive Role-Based Access Control with 6 user roles and granular permissions.

## Available Roles

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Admin** 👑 | Full Control | All permissions across all resources |
| **Inventory Manager** 📊 | Full Inventory Control | Create, edit, delete inventory; view reports |
| **Warehouse Staff** 📦 | Execute Only | View inventory and execute operations (no editing) |
| **Manager** 📈 | Management Access | Edit inventory, view reports |
| **User** 👤 | Read Only | View inventory and reports |
| **Viewer** 👁️ | Read Only | View inventory and reports |

## Permission Matrix

### Inventory Permissions
- **read**: View inventory items
- **write**: Create new inventory items
- **update**: Edit existing inventory items
- **delete**: Remove inventory items
- **execute**: Execute operations (e.g., fulfill orders, move stock)

### Reports Permissions
- **read**: View reports
- **write**: Create/export reports

### Users Permissions
- **read**: View user list
- **write**: Create/edit/delete users
- **update**: Modify user details
- **delete**: Remove users

### Settings Permissions
- **read**: View system settings
- **write**: Modify system settings
- **update**: Update configurations

## Role Selection During Signup

Users can select their role during registration:

1. Go to `/signup`
2. Fill in name, email, password
3. Select account type:
   - **Regular User** (View Only) - Default option
   - **Inventory Manager** (Full Access) - For inventory control
   - **Warehouse Staff** (Execute Tasks) - For operational staff
   - **Manager** - For general management

**Note:** Admin role cannot be self-assigned and must be set by database seeding or another admin.

## Backend Implementation

### 1. Roles Constants (`server/src/constants/roles.js`)

```javascript
export const ROLES = {
  ADMIN: "admin",
  INVENTORY_MANAGER: "inventory_manager",
  WAREHOUSE_STAFF: "warehouse_staff",
  MANAGER: "manager",
  USER: "user",
  VIEWER: "viewer",
};
```

### 2. Authorization Middleware (`server/src/middleware/authorizationMiddleware.js`)

Three middleware functions:

#### `requirePermission(resource, permission)`
Checks if user has specific permission for a resource.

```javascript
// Example: Only users with 'write' permission for 'inventory' can create items
router.post('/inventory', 
  authenticateToken,
  requirePermission('inventory', 'write'),
  createInventoryItem
);
```

#### `requireRole(allowedRoles)`
Restricts access to specific roles.

```javascript
// Example: Only admins and managers can access this route
router.get('/admin/users',
  authenticateToken,
  requireRole(['admin', 'manager']),
  getUserList
);
```

#### `attachPermissions()`
Attaches permission object to request for easy checking.

```javascript
// Adds req.permissions object with boolean flags
{
  canReadInventory: true,
  canWriteInventory: false,
  isInventoryManager: false,
  // ... etc
}
```

### 3. Usage Example

```javascript
import { requirePermission, requireRole } from '../middleware/authorizationMiddleware.js';

// Protect inventory creation - requires write permission
router.post('/inventory',
  authenticateToken,
  requirePermission('inventory', 'write'),
  createInventoryController
);

// Delete inventory - requires delete permission
router.delete('/inventory/:id',
  authenticateToken,
  requirePermission('inventory', 'delete'),
  deleteInventoryController
);

// Execute operation - warehouse staff can do this
router.post('/inventory/fulfill',
  authenticateToken,
  requirePermission('inventory', 'execute'),
  fulfillOrderController
);

// Admin-only route
router.get('/admin/settings',
  authenticateToken,
  requireRole(['admin']),
  getSettingsController
);
```

## Frontend Implementation

### 1. Permission Hook (`client/src/hooks/usePermissions.js`)

```javascript
import usePermissions from '../hooks/usePermissions';

function MyComponent() {
  const { user } = useAuth();
  const permissions = usePermissions(user);

  return (
    <div>
      {permissions.canWriteInventory && (
        <button>Create New Item</button>
      )}
      
      {permissions.canDeleteInventory && (
        <button>Delete Item</button>
      )}
      
      {permissions.canExecuteInventory && (
        <button>Fulfill Order</button>
      )}
      
      {permissions.isAdmin && (
        <div>Admin Panel</div>
      )}
    </div>
  );
}
```

### 2. Dashboard Permissions Banner

The dashboard displays a colored banner showing:
- User's role
- Permission level
- What they can do

### 3. Action Buttons

Action buttons in tables are conditionally rendered:
- **View**: All users with read permission
- **Edit**: Inventory Manager, Manager, Admin only
- **Delete**: Inventory Manager, Admin only
- **Execute**: Warehouse Staff (when they can't edit)

## Testing RBAC

### 1. Create Test Users

```bash
# Signup as different roles
1. Go to http://localhost:5173/signup
2. Create user with "Inventory Manager" role
3. Create user with "Warehouse Staff" role
4. Create user with "Regular User" role
```

### 2. Test Permissions

**Inventory Manager:**
- ✅ Can see View, Edit, Delete buttons
- ✅ Banner shows "Full Control"
- ✅ Can create, modify, delete inventory

**Warehouse Staff:**
- ✅ Can see View and Execute buttons
- ❌ No Edit or Delete buttons
- ✅ Banner shows "Execute Operations"

**Regular User:**
- ✅ Can see View button only
- ❌ No Edit, Delete, or Execute buttons
- ✅ Banner shows "View Only"

### 3. Database Test Users

Pre-seeded accounts for testing:
```
Admin:
- Email: admin@stockmaster.com
- Password: Admin@123456

Regular User:
- Email: user@stockmaster.com
- Password: User@123456
```

## Permission Enforcement

### Backend
- ✅ Middleware blocks unauthorized requests with 403 Forbidden
- ✅ Database roles validated on registration
- ✅ Only allowed roles can be self-assigned during signup
- ✅ Token contains user role for quick validation

### Frontend
- ✅ UI elements hidden based on permissions
- ✅ Permission checks before API calls
- ✅ Role-specific components and features
- ✅ Visual feedback about access level

## Security Notes

1. **Admin Role**: Cannot be self-assigned during registration
2. **Allowed Signup Roles**: Only user, inventory_manager, warehouse_staff, manager
3. **Token Validation**: Every protected route verifies JWT token
4. **Permission Checks**: Double-checked on backend (never trust frontend)
5. **Audit Logging**: Access denied attempts are logged

## Database Schema

### dim_role Table
```sql
role_key (PK) | role_id | role_name
1            | 1       | admin
2            | 2       | user
3            | 3       | manager
4            | 4       | viewer
5            | 5       | inventory_manager
6            | 6       | warehouse_staff
```

### dim_user Table
```sql
user_key | name | email | password | role_key (FK) | is_active
```

## Future Enhancements

- [ ] Custom role creation
- [ ] Fine-grained permission editing per user
- [ ] Permission groups/teams
- [ ] Audit trail for all actions
- [ ] Role hierarchy (manager > staff)
- [ ] Temporary permission grants
- [ ] Multi-role assignment per user

## API Endpoints

### Public
- `POST /api/auth/register` - Create account with role selection
- `POST /api/auth/login` - Login and receive JWT token

### Protected (Example)
- `GET /api/inventory` - Read permission required
- `POST /api/inventory` - Write permission required
- `PUT /api/inventory/:id` - Update permission required
- `DELETE /api/inventory/:id` - Delete permission required
- `POST /api/inventory/execute` - Execute permission required

## Troubleshooting

**Issue**: User can't see Edit/Delete buttons
- ✅ Check user's role in database
- ✅ Verify role_key matches correct role in dim_role table
- ✅ Clear localStorage and login again
- ✅ Check JWT token contains correct role

**Issue**: "Permission denied" error
- ✅ Verify user has required permission for that resource
- ✅ Check middleware is applied to route
- ✅ Ensure authentication middleware runs before authorization

**Issue**: Role not showing in dashboard
- ✅ Verify user object contains 'role' field
- ✅ Check AuthContext is providing user data
- ✅ Inspect usePermissions hook return values

---

**🎉 RBAC Implementation Complete!**

Your system now has enterprise-grade role-based access control with:
- ✅ 6 distinct user roles
- ✅ Granular permissions (read, write, update, delete, execute)
- ✅ Backend middleware protection
- ✅ Frontend UI restrictions
- ✅ Permission-based action buttons
- ✅ Visual role indicators
- ✅ Secure role assignment
