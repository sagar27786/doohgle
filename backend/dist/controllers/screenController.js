"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenAvailability = exports.getNearbyScreens = exports.searchScreens = exports.getScreenById = exports.getAllScreens = void 0;
const db_1 = require("../db");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllScreens = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const query = `
      SELECT 
        s.*,
        u.name as owner_name,
        COUNT(*) OVER() as total_count
      FROM screens s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await db_1.pool.query(query, [limit, offset]);
        const totalCount = result.rows.length > 0 ? result.rows[0].total_count : 0;
        res.json({
            success: true,
            data: result.rows.map((row) => {
                const { total_count, ...screen } = row;
                return screen;
            }),
            pagination: {
                page,
                limit,
                total: parseInt(totalCount),
                pages: Math.ceil(totalCount / limit),
            },
        });
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to fetch screens", 500);
    }
};
exports.getAllScreens = getAllScreens;
const getScreenById = async (req, res) => {
    try {
        const { id } = req.params;
        const screenQuery = `
      SELECT 
        s.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM screens s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.is_active = true
    `;
        const screenResult = await db_1.pool.query(screenQuery, [id]);
        if (screenResult.rows.length === 0) {
            throw (0, errorHandler_1.createError)("Screen not found", 404);
        }
        const screen = screenResult.rows[0];
        // Get availability for next 30 days
        const availabilityQuery = `
      SELECT date, start_time, end_time, is_available
      FROM screen_availability
      WHERE screen_id = $1 
        AND date >= CURRENT_DATE 
        AND date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY date, start_time
    `;
        const availabilityResult = await db_1.pool.query(availabilityQuery, [id]);
        // Get recent analytics if available
        const analyticsQuery = `
      SELECT 
        date,
        SUM(impressions) as daily_impressions,
        SUM(plays) as daily_plays
      FROM campaign_analytics ca
      JOIN campaign_screens cs ON ca.campaign_id = cs.campaign_id
      WHERE cs.screen_id = $1
        AND date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date DESC
    `;
        const analyticsResult = await db_1.pool.query(analyticsQuery, [id]);
        res.json({
            success: true,
            data: {
                ...screen,
                availability: availabilityResult.rows,
                recent_analytics: analyticsResult.rows,
            },
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === "Screen not found") {
            throw error;
        }
        throw (0, errorHandler_1.createError)("Failed to fetch screen details", 500);
    }
};
exports.getScreenById = getScreenById;
const searchScreens = async (req, res) => {
    try {
        const { city, state, screen_type, min_footfall, max_budget, latitude, longitude, radius = 10, } = req.query;
        let query = `
      SELECT 
        s.*,
        u.name as owner_name,
        CASE 
          WHEN $7 IS NOT NULL AND $8 IS NOT NULL THEN
            ST_Distance(
              ST_Point(s.longitude, s.latitude)::geography,
              ST_Point($8, $7)::geography
            ) / 1000
          ELSE NULL
        END as distance_km
      FROM screens s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
    `;
        const params = [];
        let paramIndex = 1;
        if (city) {
            query += ` AND LOWER(s.city) LIKE LOWER($${paramIndex})`;
            params.push(`%${city}%`);
            paramIndex++;
        }
        if (state) {
            query += ` AND LOWER(s.state) LIKE LOWER($${paramIndex})`;
            params.push(`%${state}%`);
            paramIndex++;
        }
        if (screen_type) {
            query += ` AND s.screen_type = $${paramIndex}`;
            params.push(screen_type);
            paramIndex++;
        }
        if (min_footfall) {
            query += ` AND s.daily_footfall >= $${paramIndex}`;
            params.push(min_footfall);
            paramIndex++;
        }
        if (max_budget) {
            query += ` AND s.cost_per_10_seconds <= $${paramIndex}`;
            params.push(max_budget);
            paramIndex++;
        }
        // Add latitude and longitude as parameters for distance calculation
        params.push(latitude || null);
        params.push(longitude || null);
        if (latitude && longitude && radius) {
            query += ` AND ST_Distance(
        ST_Point(s.longitude, s.latitude)::geography,
        ST_Point($8, $7)::geography
      ) <= $${paramIndex} * 1000`;
            params.push(radius);
            paramIndex++;
        }
        query += ` ORDER BY 
      CASE WHEN distance_km IS NOT NULL THEN distance_km END ASC,
      s.daily_footfall DESC,
      s.created_at DESC
    `;
        const result = await db_1.pool.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            filters_applied: {
                city,
                state,
                screen_type,
                min_footfall,
                max_budget,
                location: latitude && longitude ? { latitude, longitude, radius } : null,
            },
        });
    }
    catch (error) {
        console.error("Search error:", error);
        throw (0, errorHandler_1.createError)("Failed to search screens", 500);
    }
};
exports.searchScreens = searchScreens;
const getNearbyScreens = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;
        if (!latitude || !longitude) {
            throw (0, errorHandler_1.createError)("Latitude and longitude are required", 400);
        }
        const query = `
      SELECT 
        s.*,
        u.name as owner_name,
        ST_Distance(
          ST_Point(s.longitude, s.latitude)::geography,
          ST_Point($2, $1)::geography
        ) / 1000 as distance_km
      FROM screens s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
        AND ST_Distance(
          ST_Point(s.longitude, s.latitude)::geography,
          ST_Point($2, $1)::geography
        ) <= $3 * 1000
      ORDER BY distance_km ASC
    `;
        const result = await db_1.pool.query(query, [latitude, longitude, radius]);
        res.json({
            success: true,
            data: result.rows,
            center: { latitude, longitude },
            radius_km: radius,
        });
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to fetch nearby screens", 500);
    }
};
exports.getNearbyScreens = getNearbyScreens;
const getScreenAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.query;
        if (!start_date || !end_date) {
            throw (0, errorHandler_1.createError)("start_date and end_date are required", 400);
        }
        const query = `
      SELECT 
        date,
        start_time,
        end_time,
        is_available,
        CASE 
          WHEN booked_by IS NOT NULL THEN 'booked'
          WHEN is_available = false THEN 'unavailable'
          ELSE 'available'
        END as status
      FROM screen_availability
      WHERE screen_id = $1 
        AND date >= $2 
        AND date <= $3
      ORDER BY date, start_time
    `;
        const result = await db_1.pool.query(query, [id, start_date, end_date]);
        // Group by date for easier frontend consumption
        const availabilityByDate = result.rows.reduce((acc, row) => {
            const date = row.date.toISOString().split("T")[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({
                start_time: row.start_time,
                end_time: row.end_time,
                status: row.status,
            });
            return acc;
        }, {});
        res.json({
            success: true,
            data: {
                screen_id: id,
                date_range: { start_date, end_date },
                availability: availabilityByDate,
            },
        });
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to fetch screen availability", 500);
    }
};
exports.getScreenAvailability = getScreenAvailability;
