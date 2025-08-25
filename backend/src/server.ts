import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDatabase } from "./database/connection";
import { initializeDatabase } from "./database/init";
import screenRoutes from "./routes/screens";
import campaignRoutes from "./routes/campaigns";
import campaignRequestRoutes from "./routes/campaignRequests";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(requestLogger);

// Routes
app.use("/api/screens", screenRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaign-requests", campaignRequestRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await connectDatabase();
    console.log("✅ Database connected successfully");

    await initializeDatabase();
    console.log("✅ Database initialized successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📺 Screens API: http://localhost:${PORT}/api/screens`);
      console.log(`🎯 Campaigns API: http://localhost:${PORT}/api/campaigns`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
