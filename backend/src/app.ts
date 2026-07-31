import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./modules/auth/index.js";
import { animalRoutes } from "./modules/animals/index.js";
import { productionRoutes } from "./modules/production/index.js";
import { temperatureLogsRoutes } from "./modules/temperature-logs/index.js";
import { customerRoutes } from "./modules/customers/index.js";
import { orderRoutes } from "./modules/orders/index.js";
import { deliveryRoutes } from "./modules/deliveries/index.js";
import { userRoutes } from "./modules/users/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Milk Supplier Management System API is running.",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/production",productionRoutes);
app.use("/api/temperature-logs", temperatureLogsRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;