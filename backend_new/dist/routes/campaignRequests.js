"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const campaignRequestController_1 = require("../controllers/campaignRequestController");
const router = express_1.default.Router();
// Apply auth middleware to all routes
router.use(auth_1.authMiddleware);
// Campaign Request Routes
// Create new campaign request (Advertiser)
router.post("/requests", campaignRequestController_1.createCampaignRequest);
// Get my sent requests (Advertiser)
router.get("/requests/sent", campaignRequestController_1.getMyRequests);
// Get incoming requests to approve/reject (Venue Owner)
router.get("/requests/incoming", campaignRequestController_1.getIncomingRequests);
// Get specific campaign request details
router.get("/requests/:id", campaignRequestController_1.getCampaignRequest);
// Approve campaign request (Venue Owner)
router.post("/requests/:id/approve", campaignRequestController_1.approveCampaignRequest);
// Reject campaign request (Venue Owner)
router.post("/requests/:id/reject", campaignRequestController_1.rejectCampaignRequest);
// Notification Routes
// Get user notifications
router.get("/notifications", campaignRequestController_1.getNotifications);
// Mark notification as read
router.patch("/notifications/:id/read", campaignRequestController_1.markNotificationRead);
exports.default = router;
