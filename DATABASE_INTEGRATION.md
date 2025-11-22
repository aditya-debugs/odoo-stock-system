# Database Integration Complete ✅

## Overview
The Odoo Stock System now has full database integration with PostgreSQL using the schema you provided. Users can sign up, create accounts, and log in with credentials stored securely in the `dim_user` table.

## What Was Done

### 1. **Database Models Created**
- **`Role.js`** - Maps to `dim_role` table with fields:
  - `role_key` (Primary Key, auto-increment)
  - `role_id` (integer)
  - `role_name` (text, unique)

- **`User.js`** - Maps to `dim_user` table with fields:
  - `user_key` (Primary Key, auto-increment) - Used for JWT tokens
  - `user_id` (bigint)
  - `name` (text)
  - `email` (text, unique)
  - `password` (string - hashed with bcryptjs)
  - `phone` (text)
  - `role_key` (FK to dim_role)
  - `is_active` (boolean, default: true)
  - `created_at` (timestamp)

### 2. **Service Layer Updated**
- **`userService.js`** refactored to:
  - Register new users and automatically assign "user" role
  - Hash passwords before storage (bcryptjs with salt 10)
  - Generate JWT tokens using `user_key` as identifier
  - Login validation with email/password and account status check
  - Include role information in responses

### 3. **Authentication Middleware Updated**
- **`authMiddleware.js`** now:
  - Uses `user_key` instead of `id` for token verification
  - Includes Role association in protected route requests
  - Validates `is_active` status before granting access

### 4. **Server Initialization**
- **`server.js`** now:
  - Sets up User-Role association on startup
  - Automatically creates default roles if they don't exist:
    - **admin** (role_id: 1)
    - **user** (role_id: 2)
    - **manager** (role_id: 3)
    - **viewer** (role_id: 4)
  - DB-tolerant startup (continues if connection fails)

### 5. **Database Seeding**
- **`seedDatabase.js`** created to initialize:
  - All 4 default roles
  - Test admin user: `admin@stockmaster.com` / `Admin@123456`
  - Test regular user: `user@stockmaster.com` / `User@123456`

## How to Use

### Step 1: Start the Server
```bash
cd server
npm run dev
```

### Step 2: Seed the Database (First Time Only)
```bash
cd server
npm run db:seed:new
```

This creates default roles and test users.

### Step 3: Start the Frontend
```bash
cd client
npm run dev
```

### Step 4: Access the Application
- Visit `http://localhost:5173`
- **Option A**: Sign up with new credentials
  - Go to `/signup`
  - Fill form: Name, Email, Password, Confirm Password
  - Password strength indicator guides you (need at least 8 chars)
  - Account created in `dim_user` table with "user" role
  - Redirected to login

- **Option B**: Use seeded test credentials
  - Go to `/login`
  - Email: `admin@stockmaster.com` | Password: `Admin@123456`
  - Or: `user@stockmaster.com` | Password: `User@123456`
  - Redirected to dashboard on success

## Technical Details

### Password Security
- Passwords are hashed using **bcryptjs** with:
  - Salt rounds: 10
  - Algorithm: bcrypt (industry standard)
  - Never stored in plain text
  - Compared during login using `comparePassword()` method

### JWT Tokens
- Generated on successful login/registration
- Expires in 7 days (configurable via `JWT_EXPIRES_IN` env)
- Payload contains: `{ id: user_key }` 
- Stored in browser localStorage
- Validated on protected routes

### Database Flow
```
User Signs Up → Password Hashed → User Inserted to dim_user 
    ↓
dim_user.role_key ← References → dim_role.role_key
    ↓
JWT Generated with user_key → Sent to Frontend → Stored in localStorage
    ↓
Protected Requests Include Bearer Token → authMiddleware Validates → User Attached to Request
```

### Roles System
Roles are flexible and stored in `dim_role`:
- Current: admin, user, manager, viewer
- Can be extended easily
- Each user gets one role_key reference
- No need to modify code to add new roles

## Files Modified/Created

### Created:
- `/server/src/models/Role.js` - Role model
- `/server/src/models/index.js` - Models export/association setup
- `/server/src/seeds/seedDatabase.js` - Database seeding script

### Modified:
- `/server/src/models/User.js` - Updated to use `dim_user` schema
- `/server/src/services/userService.js` - Database integration
- `/server/src/middleware/authMiddleware.js` - User_key validation
- `/server/src/controllers/authController.js` - Updated getMe
- `/server/src/server.js` - Model association + role initialization
- `/server/package.json` - Added `db:seed:new` script
- `/README.md` - Updated with database setup instructions

## Environment Variables
Ensure your `.env` files are set up:

**Server `.env`**:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Stock_Inventory
DB_USER=postgres
DB_PASSWORD=rush@1108
PORT=5001
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

**Client `.env`**:
```
VITE_API_URL=http://localhost:5001
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Create new user (email, name, password)
- `POST /api/auth/login` - Login user (email, password)
- `GET /api/auth/me` - Get current user (requires JWT token)
- `POST /api/auth/demo-login` - Demo login (hidden from UI, for testing)

### Success Response Format
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_key": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role_key": 2,
      "is_active": true,
      "created_at": "2025-11-22T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## Next Steps

1. **Test the flow**:
   - Create a new account via signup
   - Verify user appears in `dim_user` table
   - Login with new credentials
   - Check dashboard access

2. **Production readiness**:
   - Change `JWT_SECRET` to a strong, random key
   - Add email verification (optional)
   - Add password reset functionality (optional)
   - Add rate limiting to auth endpoints

3. **Extended features**:
   - Wire other dashboard pages to fetch user-specific data
   - Add role-based access control (RBAC) to routes
   - Implement inventory operations linked to `created_by_key` in `fact_operation`

## Troubleshooting

### "User with this email already exists"
- Email already registered
- Use different email or check database for duplicates

### "Invalid credentials"
- Email/password mismatch
- Check seeded test credentials are correct
- Verify user is active (`is_active` = true)

### "Account is deactivated"
- User's `is_active` is set to false
- Contact admin to reactivate

### Database connection errors
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure `Stock_Inventory` database exists
- Check firewall/port 5432 access

## Security Notes
✅ Passwords are hashed before storage
✅ JWT tokens validate on protected routes
✅ User accounts are isolated by email uniqueness
✅ Active status prevents deactivated user access
✅ Role-based foundation in place for RBAC

---

**Status**: Full database integration complete. Users can now sign up and login with persistent database storage! 🎉
