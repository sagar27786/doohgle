import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  checkScreenAvailability,
  createBooking,
  getMyBookings,
  cancelBooking,
  sendBookingRequest,
  getMyBookingRequests,
  getAvailableCities,
} from "../controllers/bookingController";

const router = express.Router();

// Check screen availability before booking
router.get("/availability", checkScreenAvailability);

// Create a new booking (protected - advertiser only)
router.post("/", authMiddleware, createBooking);

// Get user's bookings (protected - advertiser view)
router.get("/my-bookings", authMiddleware, getMyBookings);

// Cancel a booking (protected - advertiser only)
router.patch("/:booking_id/cancel", authMiddleware, cancelBooking);

// ===== New Booking Request System =====

// Send booking request to screen owner
router.post("/request", sendBookingRequest);

// Get my booking requests
router.get("/requests", getMyBookingRequests);

// Get available cities with screen counts
router.get("/cities", getAvailableCities);

export default router;
