import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
    isVenueOwner,
    addScreenAsset,
    setScreenPricing,
    getVenueBookings,
    updateBookingStatus,
    addProofOfPlay
} from '../controllers/venueController';

const router = Router();

// All routes in this file are for venue owners and require authentication
router.use(authMiddleware);
router.use(isVenueOwner);

// Route to add an asset to a screen
router.post('/screens/assets', addScreenAsset);

// Route to set pricing for a screen
router.post('/screens/pricing', setScreenPricing);

// Route to get all bookings for the venue owner's screens
router.get('/bookings', getVenueBookings);

// Route to update a booking's status
router.patch('/bookings/status', updateBookingStatus);

// Route to add proof of play for a booking
router.post('/bookings/proof', addProofOfPlay);

export default router;
