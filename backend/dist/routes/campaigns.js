"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const campaignController_1 = require("../controllers/campaignController");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authMiddleware);
// 1. SEARCH & DISCOVERY ROUTES - COMPLETE FUNCTIONALITY
// Search screens with ALL filters (city, location, type, price, size, availability)
router.get("/screens/search", campaignController_1.searchScreens);
// Get ALL available screens for dashboard/listing
router.get("/screens/all", campaignController_1.getAllScreens);
// Get detailed screen information with media, availability, pricing
router.get("/screens/:id/details", campaignController_1.getScreenDetails);
// Get cities list for search dropdown
router.get("/cities", campaignController_1.getCitiesList);
// Get ALL filter options (screen types, cities, price ranges)
router.get("/filters", campaignController_1.getFilterOptions);
// Get available time slots for specific screens and dates
router.get("/screens/availability", campaignController_1.getAvailableTimeSlots);
// 2. BUDGET & ESTIMATION ROUTES
// Estimate campaign budget based on selected screens, dates, and time slots
router.post("/estimate-budget", campaignController_1.estimateBudget);
// 3. CAMPAIGN MANAGEMENT ROUTES - COMPLETE CRUD
// Create new campaign with screens, creatives, and scheduling
router.post("/", campaignController_1.createCampaign);
// Get user's campaigns with pagination and filtering
router.get("/", campaignController_1.getUserCampaigns);
// Get specific campaign details
router.get("/:id", campaignController_1.getCampaignById);
// Update campaign details
router.put("/:id", campaignController_1.updateCampaign);
// Update campaign status (pause/resume/stop) - NEW
router.put("/:id/status", campaignController_1.updateCampaignStatus);
// Cancel/Delete campaign
router.delete("/:id", campaignController_1.deleteCampaign);
// 4. CAMPAIGN TRACKING & ANALYTICS ROUTES - COMPLETE ANALYTICS
// Get comprehensive campaign tracking data
router.get("/:id/tracking", campaignController_1.getCampaignTracking);
// Get detailed analytics dashboard - NEW
router.get("/:id/analytics", campaignController_1.getCampaignAnalytics);
// Get campaign analytics (impressions, clicks, performance)
router.get("/:id/analytics", campaignController_1.getCampaignAnalytics);
// Get proof of play data (video/photo logs)
router.get("/:id/proof-of-play", campaignController_1.getProofOfPlay);
// 5. PAYMENT PROCESSING ROUTES
// Process campaign payment
router.post("/:id/payment", campaignController_1.processPayment);
exports.default = router;
