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
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all workspaces:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories
   - Update the values according to your setup

4. Set up the database:
   ```bash
   npm run db:migrate --workspace=server
   npm run db:seed --workspace=server
   ```

### Running the Application

#### Development Mode
Run both client and server concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

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
