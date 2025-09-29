import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createScreen,
  getMyScreens,
  getAllScreens,
  searchScreens,
  getScreenById,
  getScreenTypes,
  getPopularCities,
  getDashboardStats,
  toggleFavoriteScreen,
  getUserFavoriteScreens,
  checkFavoriteStatus,
} from "../controllers/screensController";

const router = Router();

// Existing routes (preserved)
router.post("/", authMiddleware, createScreen);
router.get("/mine", authMiddleware, getMyScreens);

// Dashboard analytics for ads manager
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

// Favorite screens routes (protected)
router.post("/:screenId/favorite", authMiddleware, toggleFavoriteScreen);
router.get("/favorites/mine", authMiddleware, getUserFavoriteScreens);
router.post("/favorites/check", authMiddleware, checkFavoriteStatus);

// New ads manager routes (public access for browsing screens)
router.get("/", getAllScreens);
router.get("/search", searchScreens);
router.get("/types", getScreenTypes);
router.get("/cities", getPopularCities);
router.get("/:id", getScreenById);

export default router;
