import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  checkScreenAvailability,
  createBooking,
  getMyBookings,
  cancelBooking,
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

export default router;
