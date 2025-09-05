import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getMyEarnings, getEarningsSummary } from '../controllers/earningsController';

const router = Router();

// Get all earnings for the logged-in screen owner
router.get('/', authMiddleware, getMyEarnings);

// Get earnings summary
router.get('/summary', authMiddleware, getEarningsSummary);

// Note: The processBookingEarnings and markEarningsAsPaid functions
// would typically be called from other services or admin endpoints

export default router;
