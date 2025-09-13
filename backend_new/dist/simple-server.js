"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Database connection
const db = new pg_1.Pool({
    user: process.env.DB_USER || "vishaljha",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "ads_manager_db",
    password: process.env.DB_PASSWORD || "",
    port: parseInt(process.env.DB_PORT || "5432"),
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get("/", (req, res) => {
    res.json({ message: "Ads Manager Backend is running!" });
});
// Get all screens
app.get("/api/screens", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM screens LIMIT 10");
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch screens",
        });
    }
});
// Search screens
app.get("/api/screens/search", async (req, res) => {
    try {
        const { city, state, screen_type } = req.query;
        let query = "SELECT * FROM screens WHERE 1=1";
        const params = [];
        let paramCount = 0;
        if (city) {
            paramCount++;
            query += ` AND city ILIKE $${paramCount}`;
            params.push(`%${city}%`);
        }
        if (state) {
            paramCount++;
            query += ` AND state ILIKE $${paramCount}`;
            params.push(`%${state}%`);
        }
        if (screen_type) {
            paramCount++;
            query += ` AND screen_type = $${paramCount}`;
            params.push(screen_type);
        }
        query += " LIMIT 20";
        const result = await db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search screens",
        });
    }
});
// Get screen by ID
app.get("/api/screens/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM screens WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Screen not found",
            });
            return;
        }
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch screen",
        });
    }
});
// Basic campaign endpoints
app.get("/api/campaigns", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM campaigns LIMIT 10");
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch campaigns",
        });
    }
});
app.post("/api/campaigns", async (req, res) => {
    try {
        const { name, description, start_date, end_date, total_budget, screen_ids, } = req.body;
        const result = await db.query("INSERT INTO campaigns (name, description, start_date, end_date, total_budget, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [name, description, start_date, end_date, total_budget, "draft", 1] // Using dummy user_id = 1
        );
        res.json({
            success: true,
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create campaign",
        });
    }
});
// Dashboard stats
app.get("/api/analytics/dashboard", async (req, res) => {
    try {
        const stats = await Promise.all([
            db.query("SELECT COUNT(*) as total_screens FROM screens"),
            db.query("SELECT COUNT(*) as total_campaigns FROM campaigns"),
            db.query("SELECT COALESCE(SUM(total_budget), 0) as total_budget FROM campaigns"),
            db.query("SELECT COUNT(*) as active_campaigns FROM campaigns WHERE status = 'active'"),
        ]);
        res.json({
            success: true,
            data: {
                total_screens: parseInt(stats[0].rows[0].total_screens),
                total_campaigns: parseInt(stats[1].rows[0].total_campaigns),
                total_budget: parseFloat(stats[2].rows[0].total_budget),
                active_campaigns: parseInt(stats[3].rows[0].active_campaigns),
            },
        });
    }
    catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
        });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}`);
    console.log(`🔍 Screens API: http://localhost:${PORT}/api/screens`);
});
