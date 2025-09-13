"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const screensController_1 = require("../controllers/screensController");
const router = (0, express_1.Router)();
// Existing routes (preserved)
router.post("/", auth_1.authMiddleware, screensController_1.createScreen);
router.get("/mine", auth_1.authMiddleware, screensController_1.getMyScreens);
// Dashboard analytics for ads manager
router.get("/dashboard/stats", auth_1.authMiddleware, screensController_1.getDashboardStats);
// New ads manager routes (public access for browsing screens)
router.get("/", screensController_1.getAllScreens);
router.get("/search", screensController_1.searchScreens);
router.get("/types", screensController_1.getScreenTypes);
router.get("/cities", screensController_1.getPopularCities);
router.get("/:id", screensController_1.getScreenById);
exports.default = router;
