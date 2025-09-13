"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const earningsController_1 = require("../controllers/earningsController");
const router = (0, express_1.Router)();
// Get all earnings for the logged-in screen owner
router.get('/', auth_1.authMiddleware, earningsController_1.getMyEarnings);
// Get earnings summary
router.get('/summary', auth_1.authMiddleware, earningsController_1.getEarningsSummary);
// Note: The processBookingEarnings and markEarningsAsPaid functions
// would typically be called from other services or admin endpoints
exports.default = router;
