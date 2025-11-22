# MERN + PostgreSQL App

A full-stack MERN application with PostgreSQL database.

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **ORM**: Sequelize/Prisma

## Project Structure

```
mern-postgres-app/
├── client/          # React frontend
├── server/          # Express backend
├── .env             # Root environment variables
├── .gitignore       # Git ignore file
├── package.json     # Root package.json (monorepo)
└── README.md        # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher) running locally or via Docker
- npm or yarn

### Installation & Environment Setup

1. **Clone the repository**

2. **Install root dependencies:**

```bash
npm install
```

3. **Install server dependencies:**

```bash
cd server
npm install
cd ..
```

4. **Install client dependencies:**

```bash
cd client
npm install
cd ..
```

5. **Create and configure `.env` files**

**Server .env** (`server/.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Stock_Inventory
DB_USER=postgres
DB_PASSWORD=rush@1108
NODE_ENV=development
PORT=5001
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Client .env** (`client/.env`):
```
VITE_API_URL=http://localhost:5001

# EmailJS (Optional - for password reset emails)
# See EMAILJS_QUICK_START.md for setup
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Database Setup

**Option A: Using PostgreSQL Locally**

1. Ensure PostgreSQL is running on `localhost:5432`
2. Create a database named `Stock_Inventory` (or update DB_NAME in .env)
3. Ensure the user `postgres` with password `rush@1108` has access (or update credentials in .env)

**Option B: Using Docker Compose**

1. Ensure Docker is installed and running
2. From the project root, run:

```powershell
docker-compose up -d
```

This will start PostgreSQL and pgAdmin. Access pgAdmin at `http://localhost:8080` (login: admin@local / admin).

### Running the Application

#### Development Mode (Separate Terminals)

**Terminal 1 - Backend Server:**
```powershell
cd server
npm run dev
```
Server will run on `http://localhost:5001`

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```
Frontend will run on `http://localhost:5173` (Vite will print the exact URL)

### 📧 Email Configuration (Optional)

The app includes **OTP-based password reset** functionality using **EmailJS**:

- **Without Setup**: OTP codes are logged to server console (perfect for development)
- **With Setup**: Real emails sent to users (takes 5 minutes)

**Quick Setup**: See `EMAILJS_QUICK_START.md` for 3-step guide  
**Detailed Guide**: See `EMAILJS_SETUP.md` for complete instructions

### Database Integration & Authentication

The application now uses the PostgreSQL schema with `dim_user` and `dim_role` tables for user management.

#### Initialize Default Roles and Users

Before first login, seed the database with default roles and test users:

```powershell
cd server
npm run db:seed:new
```

This creates:
- **Roles**: admin, user, manager, viewer
- **Test Admin**: admin@stockmaster.com / Admin@123456
- **Test User**: user@stockmaster.com / User@123456

#### Authentication Flow

1. **Sign Up**: Go to `/signup` and create a new account
   - Form validation for email and password
   - Password strength indicator
   - User is automatically assigned "user" role
   - User stored in `dim_user` table

2. **Sign In**: Go to `/login` with your credentials
   - Email and password authentication
   - JWT token generated (valid for 7 days)
   - Redirected to `/dashboard` on success

3. **Protected Routes**: Dashboard and other pages require valid JWT token
   - Token stored in localStorage
   - Token validated on every protected route request

#### Demo Credentials (No DB Required - Optional)

The app still includes a **demo-login** endpoint for testing without database setup:

To use demo login, you would need to uncomment the demo buttons in the login page (currently removed for cleaner UI). The endpoint exists at `POST /api/auth/demo-login`.

**Real Database Credentials** (after seeding):
- Email: `admin@stockmaster.com` | Password: `Admin@123456`
- Email: `user@stockmaster.com` | Password: `User@123456`

#### Production Mode

```bash
# Build frontend
npm run build --workspace=client

# Start server
npm start --workspace=server
```

## API Documentation

API endpoints will be available at `http://localhost:5000/api`

## License

ISC
