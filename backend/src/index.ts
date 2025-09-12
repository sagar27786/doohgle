import dotenv from "dotenv";
import path from "path";

// Load env vars with an explicit path to be safe
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
import express from "express";
import { pool } from "./db";
import authRoutes from "./routes/auth";
import screensRoutes from "./routes/screens";
import venueRoutes from "./routes/venue";
import earningsRoutes from "./routes/earnings";
import bookingRoutes from "./routes/bookings";
import locationRoutes from "./routes/locations";
import uploadRoutes from "./routes/upload";
import campaignRequestRoutes from "./routes/campaignRequests";
import adminRoutes from "./routes/admin";
import campaignRoutes from "./routes/campaigns";

// AWS Access Key logging (for debugging)
if (process.env.AWS_ACCESS_KEY_ID) {
  console.log(`Using AWS Access Key ID: ${process.env.AWS_ACCESS_KEY_ID}`);
}

// Initialize database with sample data if empty
const initializeDatabase = async () => {
  try {
    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create screens table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS screens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        screen_name TEXT NOT NULL,
        location_in_venue TEXT NOT NULL,
        city TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        screen_size_inches INTEGER,
        resolution TEXT,
        orientation VARCHAR(20) DEFAULT 'landscape',
        device_type VARCHAR(50) DEFAULT 'smart_tv',
        device_model TEXT,
        width_px INTEGER,
        height_px INTEGER,
        ads_enabled BOOLEAN DEFAULT FALSE,
        ad_frequency INTEGER DEFAULT 0,
        viewing_distance VARCHAR(20) DEFAULT 'close',
        typical_viewer_duration TEXT,
        peak_viewing_hours TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        video_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create campaigns table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        brand VARCHAR(255),
        status VARCHAR(20) DEFAULT 'draft',
        budget DECIMAL(10, 2),
        spent DECIMAL(10, 2) DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        ctr DECIMAL(5, 2) DEFAULT 0,
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add missing columns to existing tables if they don't exist
    try {
      await pool.query(`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS brand VARCHAR(255);`);
      await pool.query(`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS spent DECIMAL(10, 2) DEFAULT 0;`);
      await pool.query(`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0;`);
      await pool.query(`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;`);
      await pool.query(`ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS ctr DECIMAL(5, 2) DEFAULT 0;`);
      
      await pool.query(`ALTER TABLE screens ADD COLUMN IF NOT EXISTS image_url TEXT;`);
      await pool.query(`ALTER TABLE screens ADD COLUMN IF NOT EXISTS video_url TEXT;`);
      await pool.query(`ALTER TABLE screens ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`);
      
      console.log('✅ Table columns updated');
    } catch (error) {
      console.log('⚠️ Some columns might already exist:', (error as any).message);
    }

    // Insert sample data if tables are empty
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO users (name, email, phone, role) 
        VALUES ('Admin User', 'admin@doohgle.com', '+91 9876543210', 'admin');
      `);
      console.log('✅ Sample user created');
    }

    const screenCount = await pool.query('SELECT COUNT(*) FROM screens WHERE is_active = true');
    if (parseInt(screenCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO screens (screen_name, location_in_venue, city, latitude, longitude, screen_size_inches, resolution, ads_enabled, is_active, image_url) 
        VALUES 
          ('Mall Center Screen', 'Food Court Area', 'Mumbai', 19.0760, 72.8777, 55, '1920x1080', true, true, '/assets/screen1.png'),
          ('Metro Station Display', 'Platform 1', 'Delhi', 28.7041, 77.1025, 42, '1366x768', true, true, '/assets/screen2.png'),
          ('Shopping Complex LED', 'Main Entrance', 'Bangalore', 12.9716, 77.5946, 65, '1920x1080', true, true, '/assets/screen3.png'),
          ('Airport Terminal Screen', 'Arrival Hall', 'Chennai', 13.0827, 80.2707, 75, '4K', true, true, '/assets/screen1.png'),
          ('Bus Stop Digital Board', 'Central Station', 'Pune', 18.5204, 73.8567, 32, '1366x768', true, true, '/assets/screen2.png');
      `);
      console.log('✅ Sample screens created');
    }

    const campaignCount = await pool.query('SELECT COUNT(*) FROM campaigns');
    if (parseInt(campaignCount.rows[0].count) === 0) {
      // First, get a user_id to use for campaigns
      const userResult = await pool.query('SELECT id FROM users LIMIT 1');
      const userId = userResult.rows[0]?.id;
      
      if (userId) {
        await pool.query(`
          INSERT INTO campaigns (user_id, name, description, brand, status, budget, spent, impressions, clicks, ctr, start_date, end_date) 
          VALUES 
            ($1, 'Summer Fashion Collection', 'Trendy fashion campaign for summer season', 'Trendy Styles', 'active', 50000.00, 32000.00, 1200000, 15400, 1.28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
            ($1, 'Tech Product Launch', 'New product launch campaign', 'InnovateTech', 'active', 75000.00, 28000.00, 950000, 12800, 1.35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '45 days'),
            ($1, 'Restaurant Chain Promo', 'Food promotion campaign', 'Foodie Delights', 'paused', 30000.00, 18000.00, 780000, 9600, 1.23, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '25 days');
        `, [userId]);
        console.log('✅ Sample campaigns created with user_id');
      } else {
        console.log('⚠️ No users found, skipping campaign creation');
      }
    }

    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

// Load env vars

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }
  next();
});

// Permissive CORS (allow from anywhere)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/screens", screensRoutes);
app.use("/api/venue", venueRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/campaign-requests", campaignRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/campaigns", campaignRoutes);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Screens API: http://localhost:${PORT}/api/screens`);
  console.log(`Campaigns API: http://localhost:${PORT}/api/campaigns`);
  
  // Initialize database
  await initializeDatabase();
});
