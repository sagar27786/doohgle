"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const venueController_1 = require("../controllers/venueController");
const router = (0, express_1.Router)();
// All routes in this file are for venue owners and require authentication
router.use(auth_1.authMiddleware);
router.use(venueController_1.isVenueOwner);
// Route to add an asset to a screen
router.post('/screens/assets', venueController_1.addScreenAsset);
// Route to set pricing for a screen
router.post('/screens/pricing', venueController_1.setScreenPricing);
// Route to get all bookings for the venue owner's screens
router.get('/bookings', venueController_1.getVenueBookings);
// Route to get all booking requests for the venue owner's screens
router.get('/booking-requests', venueController_1.getVenueBookingRequests);
// Route to update a booking's status
router.patch('/bookings/status', venueController_1.updateBookingStatus);
// Route to update a booking request's status
router.patch('/booking-requests/status', venueController_1.updateBookingRequestStatus);
// Route to add proof of play for a booking
router.post('/bookings/proof', venueController_1.addProofOfPlay);
exports.default = router;
