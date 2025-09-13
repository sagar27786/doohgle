"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load env vars with an explicit path to be safe
const envPath = path_1.default.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
console.log(`File exists: ${fs_1.default.existsSync(envPath)}`);
dotenv_1.default.config({ path: envPath });
// Ensure AWS credentials are properly loaded as strings
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
// Verify AWS credentials are loaded
console.log(`Using AWS Access Key ID: ${AWS_ACCESS_KEY_ID ? AWS_ACCESS_KEY_ID.substring(0, 5) + '...' : 'undefined'}`);
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const screens_1 = __importDefault(require("./routes/screens"));
const venue_1 = __importDefault(require("./routes/venue"));
const earnings_1 = __importDefault(require("./routes/earnings"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const locations_1 = __importDefault(require("./routes/locations"));
const upload_1 = __importDefault(require("./routes/upload"));
const campaignRequests_1 = __importDefault(require("./routes/campaignRequests"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Permissive CORS (allow from anywhere)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});
app.use("/api/auth", auth_1.default);
app.use("/api/screens", screens_1.default);
app.use("/api/venue", venue_1.default);
app.use("/api/earnings", earnings_1.default);
app.use("/api/bookings", bookings_1.default);
app.use("/api/locations", locations_1.default);
app.use("/api/upload", upload_1.default);
app.use("/api/campaign-requests", campaignRequests_1.default);
// app.use('/api/campaigns', campaignRoutes);
// Temporary campaigns endpoints
app.get("/api/campaigns", (req, res) => {
    // Mock campaigns data
    res.json({
        success: true,
        data: [
            {
                id: 1,
                name: "Summer Fashion Campaign",
                description: "Promoting latest summer collection across metro areas",
                budget: 15000,
                start_date: "2025-08-01",
                end_date: "2025-08-31",
                status: "active",
                impressions: 125000,
                clicks: 2500,
                conversions: 125,
            },
            {
                id: 2,
                name: "Tech Product Launch",
                description: "New smartphone launch campaign in tech hubs",
                budget: 25000,
                start_date: "2025-08-10",
                end_date: "2025-09-10",
                status: "active",
                impressions: 89000,
                clicks: 1800,
                conversions: 90,
            },
            {
                id: 3,
                name: "Food Delivery Promo",
                description: "Weekend food delivery discount promotion",
                budget: 8000,
                start_date: "2025-08-05",
                end_date: "2025-08-25",
                status: "paused",
                impressions: 45000,
                clicks: 900,
                conversions: 45,
            },
        ],
        total: 3,
    });
});
app.post("/api/campaigns", (req, res) => {
    const newCampaign = {
        id: Date.now(),
        ...req.body,
        status: "draft",
        impressions: 0,
        clicks: 0,
        conversions: 0,
    };
    res.json({ success: true, data: newCampaign });
});
app.put("/api/campaigns/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    res.json({
        success: true,
        message: `Campaign ${id} status updated to ${status}`,
        data: { id: parseInt(id), status },
    });
});
app.delete("/api/campaigns/:id", (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Campaign ${id} deleted successfully`,
    });
});
// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        services: {
            auth: "active",
            screens: "active",
            campaigns: "active",
            venue: "active",
        },
    });
});
// Use a different port to avoid conflicts
const PORT = process.env.PORT || 4002;
// Add a function to check if port is in use and try alternative ports
const startServer = () => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
        console.log(`Screens API: http://localhost:${PORT}/api/screens`);
        console.log(`Campaigns API: http://localhost:${PORT}/api/campaigns`);
    });
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use. Please stop the other server or use a different port.`);
            process.exit(1);
        }
        else {
            console.error('Server error:', error);
        }
    });
};
startServer();
