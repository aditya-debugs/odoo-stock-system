import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("dev"));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to MERN + PostgreSQL API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
