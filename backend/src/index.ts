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

// Load env vars

const app = express();
app.use(express.json());

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
// app.use('/api/campaigns', campaignRoutes);

// Temporary campaigns endpoints
app.get("/api/campaigns", (req, res) => {
  // Mock campaigns data
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Summer Fashion Campaign",
        description: "Promoting latest summer collection across metro areas",
        budget: 15000,
        start_date: "2025-08-01",
        end_date: "2025-08-31",
        status: "active",
        impressions: 125000,
        clicks: 2500,
        conversions: 125,
      },
      {
        id: 2,
        name: "Tech Product Launch",
        description: "New smartphone launch campaign in tech hubs",
        budget: 25000,
        start_date: "2025-08-10",
        end_date: "2025-09-10",
        status: "active",
        impressions: 89000,
        clicks: 1800,
        conversions: 90,
      },
      {
        id: 3,
        name: "Food Delivery Promo",
        description: "Weekend food delivery discount promotion",
        budget: 8000,
        start_date: "2025-08-05",
        end_date: "2025-08-25",
        status: "paused",
        impressions: 45000,
        clicks: 900,
        conversions: 45,
      },
    ],
    total: 3,
  });
});

app.post("/api/campaigns", (req, res) => {
  const newCampaign = {
    id: Date.now(),
    ...req.body,
    status: "draft",
    impressions: 0,
    clicks: 0,
    conversions: 0,
  };
  res.json({ success: true, data: newCampaign });
});

app.put("/api/campaigns/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  res.json({
    success: true,
    message: `Campaign ${id} status updated to ${status}`,
    data: { id: parseInt(id), status },
  });
});

app.delete("/api/campaigns/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: `Campaign ${id} deleted successfully`,
  });
});

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
