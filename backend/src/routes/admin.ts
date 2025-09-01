import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  isAdmin,
  getDashboardStats,
  getAllScreensForAdmin,
  updateScreenStatus,
  getAllBookingRequests,
  getRevenueAnalytics,
  updateBookingStatus,
  deleteBookingRequest,
  getBookingDetails,
  bulkUpdateBookings
} from '../controllers/adminController';

const router = Router();

// All routes in this file are for admins and require authentication
router.use(authMiddleware);
router.use(isAdmin);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Screen management
router.get('/screens', getAllScreensForAdmin);
router.patch('/screens/status', updateScreenStatus);

// Booking management
router.get('/bookings', getAllBookingRequests);
router.get('/bookings/:bookingId', getBookingDetails);
router.patch('/bookings/:bookingId/status', updateBookingStatus);
router.delete('/bookings/:bookingId', deleteBookingRequest);
router.post('/bookings/bulk-action', bulkUpdateBookings);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);

export default router;
