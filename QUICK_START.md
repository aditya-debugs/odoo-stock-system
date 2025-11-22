# Quick Start Guide - Database Integration

## ⚡ Get Started in 5 Minutes

### Prerequisites
- PostgreSQL running on `localhost:5432`
- Database `Stock_Inventory` created
- User `postgres` with password `rush@1108` (or update `.env`)

### Step 1: Install Dependencies (if not done)
```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Step 2: Seed Database (First Time)
```bash
cd server
npm run db:seed:new
```

Output should show:
```
✓ Role 'admin' initialized
✓ Role 'user' initialized
✓ Role 'manager' initialized
✓ Role 'viewer' initialized
✓ Admin user created: admin@stockmaster.com (password: Admin@123456)
✓ Regular user created: user@stockmaster.com (password: User@123456)
```

### Step 3: Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

Wait for: `Server is running on port 5001` and `Database connected: true`

### Step 4: Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

Wait for the URL (usually `http://localhost:5173`)

### Step 5: Open Application
Visit `http://localhost:5173`

## 🔓 Login Options

### Option A: Use Test Credentials (Fastest)
1. Click "Sign In" button (or go to `/login`)
2. Enter credentials:
   - **Email**: `admin@stockmaster.com`
   - **Password**: `Admin@123456`
3. ✅ Redirected to dashboard

### Option B: Create New Account
1. Click "Create one now" link on login page
2. Fill the signup form:
   - **Full Name**: Any name
   - **Email**: Any unique email (e.g., `john@example.com`)
   - **Password**: Min 8 chars, uppercase, number, special char recommended
   - **Confirm Password**: Must match
3. Click "Create Account"
4. ✅ Redirected to login page
5. Login with your new credentials

## 📊 Database Verification

### Check if Users Were Created
```sql
-- Connect to Stock_Inventory database
SELECT user_key, name, email, is_active, created_at 
FROM dim_user 
ORDER BY created_at DESC;
```

Expected output after signup:
```
user_key | name           | email                    | is_active | created_at
---------|----------------|--------------------------|-----------|---------------------
    2    | Admin User     | admin@stockmaster.com    | true      | 2025-11-22 10:00:00
    3    | Regular User   | user@stockmaster.com     | true      | 2025-11-22 10:01:00
    4    | Your New User  | john@example.com         | true      | 2025-11-22 10:05:00
```

### Check Roles
```sql
SELECT role_key, role_name FROM dim_role ORDER BY role_key;
```

Expected output:
```
role_key | role_name
---------|----------
    1    | admin
    2    | user
    3    | manager
    4    | viewer
```

## 🔐 How It Works

1. **Sign Up** → Password hashed with bcryptjs → Stored in `dim_user`
2. **Assign Role** → Automatically given "user" role → `role_key` = 2
3. **Login** → Email + password verified → JWT token generated
4. **Token** → Stored in browser localStorage → Sent with API requests
5. **Protected Routes** → Middleware validates token → User data attached to request

## ⚙️ Environment Setup (Already Done)

Files that should exist:
- `/server/.env` - Contains DB credentials and JWT secret
- `/client/.env` - Contains API URL

If missing, create them:

**`/server/.env`**:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Stock_Inventory
DB_USER=postgres
DB_PASSWORD=rush@1108
PORT=5001
JWT_SECRET=dev_jwt_secret_change_in_prod
JWT_EXPIRES_IN=7d
```

**`/client/.env`**:
```
VITE_API_URL=http://localhost:5001
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "connect ECONNREFUSED" | PostgreSQL not running - Start it |
| "database does not exist" | Create database: `createdb Stock_Inventory` |
| "password authentication failed" | Check DB_PASSWORD in .env matches PostgreSQL user |
| "User already exists" | Use different email or check DB for duplicates |
| "Invalid token" | Logout and login again (token might be expired) |
| "Account deactivated" | Update `is_active = true` in database |

## 📝 Key Files

- `/server/src/models/User.js` - User model (dim_user)
- `/server/src/models/Role.js` - Role model (dim_role)
- `/server/src/services/userService.js` - Auth logic
- `/server/src/seeds/seedDatabase.js` - Seed script
- `/client/src/pages/Login.jsx` - Login page
- `/client/src/pages/Signup.jsx` - Signup page
- `/client/src/services/authService.js` - Frontend API calls

## ✨ What's Next

- Implement dashboard to display user data
- Wire inventory pages to backend
- Add role-based access control (RBAC)
- Implement password reset feature
- Add email verification (optional)

---

**Everything is ready! 🚀 Start following Step 1 above.**
