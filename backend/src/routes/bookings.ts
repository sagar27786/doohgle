import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  checkScreenAvailability,
  createBookingWithAuth,
  getMyBookings,
  cancelBooking,
  processBookingApproval,
  getOwnerBookingRequests,
  getAdsManagerNotifications,
  markNotificationAsRead,
} from "../controllers/bookingController";

const router = express.Router();

// Check screen availability before booking
router.get("/availability", checkScreenAvailability);

// Create a new booking (protected - advertiser only)
router.post("/", authMiddleware, createBookingWithAuth);

// Get user's bookings (protected - advertiser view)
router.get("/my-bookings", authMiddleware, getMyBookings);

// Cancel a booking (protected - advertiser only)
router.patch("/:booking_id/cancel", authMiddleware, cancelBooking);

// === NEW ENHANCED BOOKING SYSTEM ===

// Get booking requests for screen owner (Screen Manager)
router.get("/requests", authMiddleware, getOwnerBookingRequests);

// Process booking request approval/rejection (Screen Manager)
router.patch("/requests/:requestId/process", authMiddleware, processBookingApproval);

// Get notifications for ads manager
router.get("/notifications", authMiddleware, getAdsManagerNotifications);

// Mark notification as read
router.patch("/notifications/:notificationId/read", authMiddleware, markNotificationAsRead);

export default router;
