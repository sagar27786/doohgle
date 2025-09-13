import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDatabase } from "./database/connection";
import { initializeDatabase } from "./database/init";
import screenRoutes from "./routes/screens";
import campaignRoutes from "./routes/campaigns";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";
import venueRoutes from "./routes/venue";
import bookingRoutes from "./routes/bookings";
import earningsRoutes from "./routes/earnings";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import { ensureBucketExists } from "./config/s3Config";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:3000"],
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
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/venue", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/earnings", earningsRoutes);

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

// Start server with S3 verification
async function startServer() {
  try {
    // Verify S3 connection
    await ensureBucketExists();
    console.log("✅ S3 bucket connection verified");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📺 Screens API: http://localhost:${PORT}/api/screens`);
      console.log(`🎯 Campaigns API: http://localhost:${PORT}/api/campaigns`);
      console.log(`☁️ S3 bucket: ${process.env.S3_BUCKET_NAME} (${process.env.AWS_REGION})`);
    });
  } catch (error) {
    console.error("❌ S3 connection failed:", error);
    console.log("⚠️ Starting server without S3 verification...");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (S3 not verified)`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  }
}

startServer();

// Commented out database connection for testing
// async function startServer() {
//   try {
//     await connectDatabase();
//     console.log("✅ Database connected successfully");
//
//     await initializeDatabase();
//     console.log("✅ Database initialized successfully");
//
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📊 Health check: http://localhost:${PORT}/health`);
//       console.log(`📺 Screens API: http://localhost:${PORT}/api/screens`);
//       console.log(`🎯 Campaigns API: http://localhost:${PORT}/api/campaigns`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// }
//
// startServer();

export default app;
