"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const screens_1 = __importDefault(require("./routes/screens"));
const campaigns_1 = __importDefault(require("./routes/campaigns"));
const auth_1 = __importDefault(require("./routes/auth"));
const upload_1 = __importDefault(require("./routes/upload"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const venue_1 = __importDefault(require("./routes/venue"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const earnings_1 = __importDefault(require("./routes/earnings"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(logger_1.requestLogger);
// Routes
app.use("/api/screens", screens_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/campaigns", campaigns_1.default);
app.use("/api/upload", upload_1.default);
app.use("/api/analytics", analytics_1.default);
app.use("/api/venue", venue_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/earnings", earnings_1.default);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start server without database connection for testing
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📺 Screens API: http://localhost:${PORT}/api/screens`);
    console.log(`🎯 Campaigns API: http://localhost:${PORT}/api/campaigns`);
});
// Commented out database connection for testing
// async function startServer() {
//   try {
//     await connectDatabase();
//     console.log("✅ Database connected successfully");
//
//     await initializeDatabase();
//     console.log("✅ Database initialized successfully");
//
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📊 Health check: http://localhost:${PORT}/health`);
//       console.log(`📺 Screens API: http://localhost:${PORT}/api/screens`);
//       console.log(`🎯 Campaigns API: http://localhost:${PORT}/api/campaigns`);
//     });
//   } catch (error) {
//     console.error("❌ Failed to start server:", error);
//     process.exit(1);
//   }
// }
//
// startServer();
exports.default = app;
