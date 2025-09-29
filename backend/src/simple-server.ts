import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./db-improved";

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roles?: string[];
  };
}
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
const db = new Pool({
  user: process.env.DB_USER || "vishaljha",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ads_manager_db",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Ads Manager Backend is running!" });
});

// Get all screens
app.get("/api/screens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM screens LIMIT 10");
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
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
    const params: any[] = [];
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

    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
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
    const result = await pool.query("SELECT * FROM screens WHERE id = $1", [
      id,
    ]);

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
  } catch (error) {
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
    const result = await pool.query("SELECT * FROM campaigns LIMIT 10");
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
});

app.post("/campaigns", async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      start_date,
      end_date,
      total_budget,
      screen_ids,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO campaigns (name, description, start_date, end_date, total_budget, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        name,
        description,
        start_date,
        end_date,
        total_budget,
        "draft",
        req.user?.id || 1,
      ] // Use authenticated user ID
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
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
      pool.query("SELECT COUNT(*) as total_screens FROM screens"),
      pool.query("SELECT COUNT(*) as total_campaigns FROM campaigns"),
      pool.query(
        "SELECT COALESCE(SUM(total_budget), 0) as total_budget FROM campaigns"
      ),
      pool.query(
        "SELECT COUNT(*) as active_campaigns FROM campaigns WHERE status = 'active'"
      ),
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
  } catch (error) {
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
