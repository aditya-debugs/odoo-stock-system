import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import adjustmentRoutes from "./routes/adjustmentRoutes.js";
import stockMovementRoutes from "./routes/stockMovementRoutes.js";
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
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/operations/receipts", receiptRoutes);
app.use("/api/operations/deliveries", deliveryRoutes);
app.use("/api/operations/transfers", transferRoutes);
app.use("/api/operations/adjustments", adjustmentRoutes);
app.use("/api/operations/stock-movements", stockMovementRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
