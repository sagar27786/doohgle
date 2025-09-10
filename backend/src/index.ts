import dotenv from "dotenv";
import path from "path";

// Load env vars with an explicit path to be safe
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import express from "express";
import authRoutes from "./routes/auth";
import screensRoutes from "./routes/screens";
import venueRoutes from "./routes/venue";
import earningsRoutes from "./routes/earnings";
import bookingRoutes from "./routes/bookings";
import locationRoutes from "./routes/locations";
import uploadRoutes from "./routes/upload";
import campaignRequestRoutes from "./routes/campaignRequests";
import adminRoutes from "./routes/admin";
import campaignRoutes from "./routes/campaigns";

// Load env vars

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Permissive CORS (allow from anywhere)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/screens", screensRoutes);
app.use("/api/venue", venueRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/campaign-requests", campaignRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/campaigns', campaignRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      auth: "active",
      screens: "active",
      campaigns: "active",
      venue: "active",
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Screens API: http://localhost:${PORT}/api/screens`);
  console.log(`Campaigns API: http://localhost:${PORT}/api/campaigns`);
});
