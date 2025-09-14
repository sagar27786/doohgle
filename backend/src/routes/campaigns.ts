import express from "express";
import { authMiddleware } from "../middleware/auth";
import { pool } from "../db";
import {
  searchScreens,
  getScreenDetails,
  createCampaign,
  estimateBudget,
  getUserCampaigns,
  getCampaignTracking,
  getProofOfPlay,
  processPayment,
  getAvailableTimeSlots,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignAnalytics,
  getAllScreens,
  updateCampaignStatus,
  getCitiesList,
  getFilterOptions,
} from "../controllers/campaignController";

const router = express.Router();

// Public campaigns route (no auth required)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns ORDER BY created_at DESC");
    res.json({
      success: true,
      campaigns: result.rows,
      pagination: {
        page: 1,
        limit: result.rows.length,
        total: result.rows.length,
      },
    });
  } catch (error: any) {
    res.json({
      success: false,
      error: error.message,
      campaigns: [],
    });
  }
});

// Apply authentication middleware to all other routes
router.use(authMiddleware);

// 1. SEARCH & DISCOVERY ROUTES - COMPLETE FUNCTIONALITY
// Search screens with ALL filters (city, location, type, price, size, availability)
router.get("/screens/search", searchScreens);

// Get ALL available screens for dashboard/listing
router.get("/screens/all", getAllScreens);

// Get detailed screen information with media, availability, pricing
router.get("/screens/:id/details", getScreenDetails);

// Get cities list for search dropdown
router.get("/cities", getCitiesList);

// Get ALL filter options (screen types, cities, price ranges)
router.get("/filters", getFilterOptions);

// Get available time slots for specific screens and dates
router.get("/screens/availability", getAvailableTimeSlots);

// 2. BUDGET & ESTIMATION ROUTES
// Estimate campaign budget based on selected screens, dates, and time slots
router.post("/estimate-budget", estimateBudget);

// 3. CAMPAIGN MANAGEMENT ROUTES - COMPLETE CRUD
// Create new campaign with screens, creatives, and scheduling
router.post("/", createCampaign);

// Get user's campaigns with pagination and filtering
router.get("/", getUserCampaigns);

// Get specific campaign details
router.get("/:id", getCampaignById);

// Update campaign details
router.put("/:id", updateCampaign);

// Update campaign status (pause/resume/stop) - NEW
router.put("/:id/status", updateCampaignStatus);

// Cancel/Delete campaign
router.delete("/:id", deleteCampaign);

// 4. CAMPAIGN TRACKING & ANALYTICS ROUTES - COMPLETE ANALYTICS
// Get comprehensive campaign tracking data
router.get("/:id/tracking", getCampaignTracking);

// Get detailed analytics dashboard - NEW
router.get("/:id/analytics", getCampaignAnalytics);

// Get campaign analytics (impressions, clicks, performance)
router.get("/:id/analytics", getCampaignAnalytics);

// Get proof of play data (video/photo logs)
router.get("/:id/proof-of-play", getProofOfPlay);

// 5. PAYMENT PROCESSING ROUTES
// Process campaign payment
router.post("/:id/payment", processPayment);

export default router;
