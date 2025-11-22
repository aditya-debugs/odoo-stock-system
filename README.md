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
#### Run PostgreSQL with Docker (recommended)

If you don't have a local Postgres server, you can run one with Docker using the provided `docker-compose.yml`.

1. Start Postgres and pgAdmin:

```powershell
docker-compose up -d
# or: docker compose up -d
```

2. Copy the example env into the server folder and update if needed:

```powershell
cd server
copy .env.example .env
```

3. Start the server (in project root or inside `server/`):

```powershell
# from project root
cd server; npm install; npm run dev

# or from inside server/
npm install; npm run dev
```

4. (Optional) Open pgAdmin at `http://localhost:8080` (login: `admin@local` / `admin`) and connect to host `host.docker.internal` or `localhost`, port `5432`, user and password from `.env`.

When finished, stop containers:

```powershell
docker-compose down
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
