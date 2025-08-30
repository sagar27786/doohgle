import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";
import { generatePresignedUrl } from "../config/s3Config";

export async function createScreen(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const {
    screen_name,
    location_in_venue,
    city,
    latitude,
    longitude,
    screen_size_inches,
    resolution,
    orientation,
    device_type,
    device_model,
    ads_enabled,
    ad_frequency,
    viewing_distance,
    typical_viewer_duration,
    peak_viewing_hours,
    day_photo_url,
    night_photo_url,
    video_url,
    hourly_rate,
    daily_rate,
    weekly_rate,
    width_px,
    height_px,
  } = req.body || {};

  if (!screen_name || !location_in_venue) {
    return res
      .status(400)
      .json({ message: "screen_name and location_in_venue are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO screens
       (user_id, screen_name, location_in_venue, city, latitude, longitude, screen_size_inches, resolution, 
        orientation, device_type, device_model, ads_enabled, ad_frequency, viewing_distance, 
        typical_viewer_duration, peak_viewing_hours, day_photo_url, night_photo_url, video_url, hourly_rate, daily_rate, weekly_rate, width_px, height_px)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::text[], $17, $18, $19, $20, $21, $22, $23, $24)
       RETURNING *`,
      [
        userId,
        screen_name,
        location_in_venue,
        city || null,
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
        screen_size_inches ?? null,
        resolution ?? null,
        orientation ?? "landscape",
        device_type ?? "smart_tv",
        device_model ?? null,
        !!ads_enabled,
        Number(ad_frequency) || 0,
        viewing_distance ?? "close",
        typical_viewer_duration ?? null,
        Array.isArray(peak_viewing_hours) ? peak_viewing_hours.map(String) : [],
        day_photo_url || null,
        night_photo_url || null,
        video_url || null,
        hourly_rate ? Number(hourly_rate) : null,
        daily_rate ? Number(daily_rate) : null,
        weekly_rate ? Number(weekly_rate) : null,
        width_px ? Number(width_px) : null,
        height_px ? Number(height_px) : null,
      ]
    );

    return res.status(201).json({
      message: "Screen registered successfully",
      screen: result.rows[0],
    });
  } catch (err) {
    console.error("createScreen error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMyScreens(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const result = await pool.query(
      `SELECT s.*
       FROM screens s
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );

    const screensWithAssets = await Promise.all(
      result.rows.map(async (row) => {
        const assets = await buildAssetsFromScreenRow(row);
        return { ...row, assets };
      })
    );

    return res.json({ screens: screensWithAssets });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}

// ==================== ADS MANAGER FUNCTIONS (EXTENDING EXISTING) ====================

// Get all screens for ads manager with filters
export async function getAllScreens(req: Request, res: Response) {
  try {
    const {
      city,        // Filter screens by city name
      state,       // Filter screens by state
      screen_type, // Filter by type of screen (e.g., LED, LCD)
      min_footfall,// Minimum daily foot traffic requirement
      max_budget,  // Maximum budget constraint for filtering screens
      limit = "20",// Number of results to return, defaults to 20
    } = req.query;

    let query = `
      SELECT s.*
      FROM screens s
      WHERE s.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(s.city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND LOWER(s.device_type) LIKE LOWER($${paramIndex})`;
      params.push(`%${screen_type}%`);
      paramIndex++;
    }

    if (max_budget) {
      query += ` AND s.daily_rate <= $${paramIndex}`;
      params.push(parseFloat(max_budget as string));
      paramIndex++;
    }

    query += ` ORDER BY s.city, s.daily_rate DESC, s.created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit as string));

    const result = await pool.query(query, params);
    console.log("results before formatting : ", result.rows);

    // Format results to include pricing information
    const formattedResults = result.rows.map((row) => {
      const cost_per_10_seconds = row.daily_rate ? row.daily_rate / 8640 : 50;

      let resolution_width = 1280;
      let resolution_height = 720;
      if (row.resolution === "1080p") {
        resolution_width = 1920;
        resolution_height = 1080;
      } else if (row.resolution === "4K") {
        resolution_width = 3840;
        resolution_height = 2160;
      }

      return {
        id: row.id,
        user_id: row.user_id,
        name: row.screen_name,
        description: "Premium advertising display",
        screen_type: row.device_type,
        location_name: row.location_in_venue,
        address: `${row.location_in_venue}, ${row.city}`,
        city: row.city,
        state: "India",
        // pincode: "000000",
        latitude: row.latitude,
        longitude: row.longitude,
        screen_size_width: row.width_px,
        screen_size_height: row.height_px,
        width_px : row.width_px,
        height_px : row.height_px,
        // daily_footfall: 5000 + Math.floor(Math.random() * 20000),
        // vehicle_count: 2000 + Math.floor(Math.random() * 8000),
        peak_hours: row.peak_viewing_hours,
        demographics: "Mixed demographics",
        day_photo_url: row.day_photo_url,
        night_photo_url : row.night_photo_url,
        video_url: row.video_url,
        is_active: row.is_active,
        hourly_rate: row.hourly_rate,
        daily_rate: row.daily_rate,
        weekly_rate: row.weekly_rate,
        device_type : row.device_type,
        cost_per_10_seconds: cost_per_10_seconds,
      };
    });

    res.json({
      success: true,
      data: formattedResults,
      total: result.rows.length,
      filters: { city, state, screen_type, min_footfall, max_budget },
    });
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch screens",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Search screens for ads manager
export async function searchScreens(req: Request, res: Response) {
  try {
    const { city, location, screen_type, min_size, max_price } = req.query;

    let query = `
      SELECT 
        s.id,
        s.screen_name as name,
        s.location_in_venue as location_name,
        s.city,
        s.latitude,
        s.longitude,
        s.screen_size_inches,
        s.resolution,
        s.orientation,
        s.device_type,
        s.device_model,
        s.ads_enabled,
        s.ad_frequency,
        s.viewing_distance,
        s.typical_viewer_duration,
        s.peak_viewing_hours as peak_hours,
        s.is_active,
        s.created_at,
        s.updated_at,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
        (
          SELECT sa.url 
          FROM screen_assets sa 
          WHERE sa.screen_id = s.id AND sa.asset_type = 'photo_day' 
          LIMIT 1
        ) as image_url
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(s.city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (location) {
      query += ` AND LOWER(s.location_in_venue) LIKE LOWER($${paramIndex})`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND LOWER(s.device_type) LIKE LOWER($${paramIndex})`;
      params.push(`%${screen_type}%`);
      paramIndex++;
    }

    if (min_size) {
      query += ` AND s.screen_size_inches >= $${paramIndex}`;
      params.push(parseInt(min_size as string));
      paramIndex++;
    }

    if (max_price) {
      query += ` AND p.daily_rate <= $${paramIndex}`;
      params.push(parseFloat(max_price as string));
      paramIndex++;
    }

    query += " ORDER BY s.city, s.created_at DESC LIMIT 50";

    const result = await pool.query(query, params);

    // Format the response to include pricing and other details
    const formattedResults = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      location_name: row.location_name,
      city: row.city,
      latitude: row.latitude,
      longitude: row.longitude,
      screen_size_inches: row.screen_size_inches,
      resolution: row.resolution,
      orientation: row.orientation,
      device_type: row.device_type,
      device_model: row.device_model,
      ads_enabled: row.ads_enabled,
      ad_frequency: row.ad_frequency,
      viewing_distance: row.viewing_distance,
      typical_viewer_duration: row.typical_viewer_duration,
      peak_hours: row.peak_hours,
      is_active: row.is_active,
      image_url: row.image_url,
      pricing: {
        hourly: row.hourly_rate || 0,
        daily: row.daily_rate || 0,
        weekly: row.weekly_rate || 0,
      },
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: result.rows.length,
      filters: { city, location, screen_type, min_size, max_price },
    });
  } catch (error) {
    console.error("Error searching screens:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search screens",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get screen by ID for ads manager
export async function getScreenById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const screenQuery = `
      SELECT 
        s.*,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
        (
          SELECT json_agg(
            jsonb_build_object(
              'date', sa.date,
              'is_available', sa.is_available
            )
          )
          FROM screen_availability sa
          WHERE sa.screen_id = s.id
            AND sa.date >= CURRENT_DATE
            AND sa.date <= CURRENT_DATE + INTERVAL '30 days'
        ) as availability
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.id = $1 AND s.is_active = true
    `;

    const result = await pool.query(screenQuery, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Screen not found",
      });
      return;
    }

    const screen = result.rows[0];
    const assets = await buildAssetsFromScreenRow(screen);

    const response = {
      ...screen,
      assets,
      pricing: {
        hourly: screen.hourly_rate || 0,
        daily: screen.daily_rate || 0,
        weekly: screen.weekly_rate || 0,
      },
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching screen:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch screen",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get screen types for filtering
export async function getScreenTypes(req: Request, res: Response) {
  try {
    const screenTypes = [
      {
        value: "LED_billboard",
        label: "LED Billboard",
        description: "Large outdoor LED displays",
      },
      {
        value: "mall_screen",
        label: "Mall Screen",
        description: "Indoor mall displays",
      },
      {
        value: "metro_display",
        label: "Metro Display",
        description: "Transit station displays",
      },
      {
        value: "bus_stop",
        label: "Bus Stop",
        description: "Bus stop displays",
      },
      {
        value: "digital_hoarding",
        label: "Digital Hoarding",
        description: "Highway digital boards",
      },
      {
        value: "airport_display",
        label: "Airport Display",
        description: "Airport terminal screens",
      },
    ];

    res.json({
      success: true,
      data: screenTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch screen types",
    });
  }
}

// Get popular cities
export async function getPopularCities(req: Request, res: Response) {
  try {
    const query = `
      SELECT 
        s.city,
        'India' as state,
        COUNT(*) as screen_count,
        ROUND(AVG(COALESCE(p.daily_rate, 3000))) as avg_daily_price
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.is_active = true AND s.city IS NOT NULL
      GROUP BY s.city
      ORDER BY screen_count DESC, avg_daily_price ASC
      LIMIT 10
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        name: row.city,
        state: row.state,
        count: parseInt(row.screen_count),
        avgPrice: parseInt(row.avg_daily_price) || 3000,
      })),
    });
  } catch (error) {
    console.error("Error fetching popular cities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular cities",
    });
  }
}

// Dashboard analytics endpoints for ads manager
export async function getDashboardStats(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get campaign statistics
    const campaignStatsQuery = `
      SELECT
        COUNT(*) as total_campaigns,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_campaigns,
        COALESCE(SUM(total_budget), 0) as total_budget,
        COALESCE(SUM(spent_amount), 0) as total_spent
      FROM campaigns
      WHERE user_id = $1
    `;

    const campaignStats = await pool.query(campaignStatsQuery, [userId]);

    // Get impression statistics
    const analyticsQuery = `
      SELECT
        COALESCE(SUM(ca.impressions), 0) as total_impressions,
        COALESCE(SUM(ca.plays), 0) as total_plays,
        COUNT(DISTINCT ca.screen_id) as screens_used
      FROM campaign_analytics ca
      JOIN campaigns c ON ca.campaign_id = c.id
      WHERE c.user_id = $1
    `;

    const analyticsStats = await pool.query(analyticsQuery, [userId]);

    // Get recent performance
    const recentPerformanceQuery = `
      SELECT
        c.name as campaign_name,
        c.id as campaign_id,
        SUM(ca.impressions) as impressions,
        SUM(ca.plays) as plays,
        c.spent_amount,
        c.total_budget
      FROM campaigns c
      LEFT JOIN campaign_analytics ca ON c.id = ca.campaign_id
      WHERE c.user_id = $1
        AND c.status = 'active'
        AND ca.date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY c.id, c.name, c.spent_amount, c.total_budget
      ORDER BY impressions DESC
      LIMIT 5
    `;

    const recentPerformance = await pool.query(recentPerformanceQuery, [
      userId,
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          ...campaignStats.rows[0],
          ...analyticsStats.rows[0],
        },
        recent_performance: recentPerformance.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}

// Helper: check if a string is an HTTP(S) URL
function isHttpUrl(value?: string | null): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

// Helper: try to extract S3 object key from a known S3 URL
function extractS3KeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.host.toLowerCase();

    if (!host.includes("amazonaws.com")) {
      // Not an S3 URL (could be CDN or public URL) -> we won't try to presign
      return null;
    }

    // Path always starts with "/"
    const pathname = decodeURIComponent(u.pathname.replace(/^\/+/, ""));

    // Handle path-style: https://s3.amazonaws.com/bucket/key or https://s3.<region>.amazonaws.com/bucket/key
    if (host === "s3.amazonaws.com" || host.startsWith("s3.")) {
      const segments = pathname.split("/");
      if (segments.length >= 2) {
        // first segment is bucket, rest is key
        return segments.slice(1).join("/");
      }
      return null;
    }

    // Handle virtual-hosted-style: https://bucket.s3.amazonaws.com/key or https://bucket.s3.<region>.amazonaws.com/key
    // In this case, pathname is the key
    return pathname || null;
  } catch {
    return null;
  }
}

// Given a DB field (which can be a key or URL), return a presigned URL if private, or the original if already public
async function getRenderableUrl(urlOrKey?: string | null): Promise<string | null> {
  if (!urlOrKey) return null;

  // If it's a URL
  if (isHttpUrl(urlOrKey)) {
    const key = extractS3KeyFromUrl(urlOrKey);
    if (key) {
      // It's an S3 URL -> generate presigned
      return await generatePresignedUrl(key);
    }
    // Not an S3 URL (e.g., CDN or public HTTPS) -> return as-is
    return urlOrKey;
  }

  // Otherwise, treat as a raw S3 key
  return await generatePresignedUrl(urlOrKey);
}

// Build assets array from the three columns in the screens table
async function buildAssetsFromScreenRow(screen: any) {
  const assets: { asset_type: "photo_day" | "photo_night" | "video"; url: string }[] = [];

  const dayUrl = await getRenderableUrl(screen.day_photo_url);
  if (dayUrl) assets.push({ asset_type: "photo_day", url: dayUrl });

  const nightUrl = await getRenderableUrl(screen.night_photo_url);
  if (nightUrl) assets.push({ asset_type: "photo_night", url: nightUrl });

  const videoUrl = await getRenderableUrl(screen.video_url);
  if (videoUrl) assets.push({ asset_type: "video", url: videoUrl });

  return assets;
}
