import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createCampaignRequest,
  getMyRequests,
  getIncomingRequests,
  approveCampaignRequest,
  rejectCampaignRequest,
  getCampaignRequest,
  getNotifications,
  markNotificationRead,
} from "../controllers/campaignRequestController";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Campaign Request Routes

// Create new campaign request (Advertiser)
router.post("/requests", createCampaignRequest);

// Get my sent requests (Advertiser)
router.get("/requests/sent", getMyRequests);

// Get incoming requests to approve/reject (Venue Owner)
router.get("/requests/incoming", getIncomingRequests);

// Get specific campaign request details
router.get("/requests/:id", getCampaignRequest);

// Approve campaign request (Venue Owner)
router.post("/requests/:id/approve", approveCampaignRequest);

// Reject campaign request (Venue Owner)
router.post("/requests/:id/reject", rejectCampaignRequest);

// Notification Routes

// Get user notifications
router.get("/notifications", getNotifications);

// Mark notification as read
router.patch("/notifications/:id/read", markNotificationRead);

export default router;
