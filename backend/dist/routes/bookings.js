"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
// Check screen availability before booking
router.get("/availability", bookingController_1.checkScreenAvailability);
// Create a new booking (protected - advertiser only)
router.post("/", auth_1.authMiddleware, bookingController_1.createBooking);
// Get user's bookings (protected - advertiser view)
router.get("/my-bookings", auth_1.authMiddleware, bookingController_1.getMyBookings);
// Cancel a booking (protected - advertiser only)
router.patch("/:booking_id/cancel", auth_1.authMiddleware, bookingController_1.cancelBooking);
// ===== New Booking Request System =====
// Send booking request to screen owner
router.post("/request", bookingController_1.sendBookingRequest);
// Get my booking requests
router.get("/requests", bookingController_1.getMyBookingRequests);
// Get booking requests for a screen owner
router.get("/requests/owner", bookingController_1.getBookingRequestsForOwner);
// Get available cities with screen counts
router.get("/cities", bookingController_1.getAvailableCities);
// Get booked time slots for a screen
router.get("/booked-time-slots", bookingController_1.getBookedTimeSlots);
exports.default = router;
