import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createScreen, getMyScreens } from '../controllers/screensController';

const router = Router();

router.post('/', authMiddleware, createScreen);
router.get('/mine', authMiddleware, getMyScreens);

export default router;
