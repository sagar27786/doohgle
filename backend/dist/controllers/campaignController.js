"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterOptions = exports.getCitiesList = exports.updateCampaignStatus = exports.getAllScreens = exports.getCampaignAnalytics = exports.deleteCampaign = exports.updateCampaign = exports.getCampaignById = exports.getCampaigns = exports.getAvailableTimeSlots = exports.processPayment = exports.getProofOfPlay = exports.getCampaignTracking = exports.getUserCampaigns = exports.estimateBudget = exports.createCampaign = exports.getScreenDetails = exports.searchScreens = void 0;
const db_1 = require("../db");
// 1. SEARCH SCREENS with filters
const searchScreens = async (req, res) => {
    try {
        const { city, location, type, minPrice, maxPrice, minSize, maxSize, startDate, endDate, page = 1, limit = 10, } = req.query;
        let query = `
      SELECT s.*, sm.media_url, sm.media_type,
             CASE WHEN sa.screen_id IS NULL THEN true ELSE false END as available
      FROM screens s
      LEFT JOIN screen_media sm ON s.id = sm.screen_id
      LEFT JOIN screen_availability sa ON s.id = sa.screen_id 
        AND sa.date BETWEEN $1 AND $2
      WHERE 1=1
    `;
        const params = [startDate || new Date(), endDate || new Date()];
        let paramIndex = 2;
        if (city) {
            query += ` AND LOWER(s.city) LIKE LOWER($${++paramIndex})`;
            params.push(`%${city}%`);
        }
        if (location) {
            query += ` AND LOWER(s.location) LIKE LOWER($${++paramIndex})`;
            params.push(`%${location}%`);
        }
        if (type) {
            query += ` AND LOWER(s.type) = LOWER($${++paramIndex})`;
            params.push(type);
        }
        if (minPrice) {
            query += ` AND s.price_per_day >= $${++paramIndex}`;
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ` AND s.price_per_day <= $${++paramIndex}`;
            params.push(maxPrice);
        }
        if (minSize) {
            query += ` AND (s.width * s.height) >= $${++paramIndex}`;
            params.push(minSize);
        }
        if (maxSize) {
            query += ` AND (s.width * s.height) <= $${++paramIndex}`;
            params.push(maxSize);
        }
        query += ` GROUP BY s.id, sm.media_url, sm.media_type, sa.screen_id`;
        query += ` ORDER BY s.created_at DESC`;
        query += ` LIMIT $${++paramIndex} OFFSET $${++paramIndex}`;
        params.push(limit, (Number(page) - 1) * Number(limit));
        const result = await db_1.pool.query(query, params);
        // Get total count for pagination
        let countQuery = `SELECT COUNT(DISTINCT s.id) FROM screens s WHERE 1=1`;
        const countParams = [];
        let countParamIndex = 0;
        if (city) {
            countQuery += ` AND LOWER(s.city) LIKE LOWER($${++countParamIndex})`;
            countParams.push(`%${city}%`);
        }
        if (location) {
            countQuery += ` AND LOWER(s.location) LIKE LOWER($${++countParamIndex})`;
            countParams.push(`%${location}%`);
        }
        if (type) {
            countQuery += ` AND LOWER(s.type) = LOWER($${++countParamIndex})`;
            countParams.push(type);
        }
        const countResult = await db_1.pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);
        res.json({
            screens: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        console.error("Search screens error:", error);
        res.status(500).json({ error: "Failed to search screens" });
    }
};
exports.searchScreens = searchScreens;
// 2. GET SCREEN DETAILS with all info
const getScreenDetails = async (req, res) => {
    try {
        const { id } = req.params;
        // Get screen basic info
        const screenQuery = `
      SELECT s.*, 
             AVG(a.impressions) as avg_daily_impressions,
             COUNT(c.id) as total_campaigns
      FROM screens s
      LEFT JOIN analytics a ON s.id = a.screen_id
      LEFT JOIN campaign_screens cs ON s.id = cs.screen_id
      LEFT JOIN campaigns c ON cs.campaign_id = c.id
      WHERE s.id = $1
      GROUP BY s.id
    `;
        const screenResult = await db_1.pool.query(screenQuery, [id]);
        if (screenResult.rows.length === 0) {
            return res.status(404).json({ error: "Screen not found" });
        }
        // Get media files
        const mediaQuery = `SELECT * FROM screen_media WHERE screen_id = $1`;
        const mediaResult = await db_1.pool.query(mediaQuery, [id]);
        // Get availability for next 30 days
        const availabilityQuery = `
      SELECT date, time_slot, is_available 
      FROM screen_availability 
      WHERE screen_id = $1 AND date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY date, time_slot
    `;
        const availabilityResult = await db_1.pool.query(availabilityQuery, [id]);
        const screen = screenResult.rows[0];
        screen.media = mediaResult.rows;
        screen.availability = availabilityResult.rows;
        res.json({ screen });
    }
    catch (error) {
        console.error("Get screen details error:", error);
        res.status(500).json({ error: "Failed to get screen details" });
    }
};
exports.getScreenDetails = getScreenDetails;
// 3. CREATE CAMPAIGN with step-by-step process
const createCampaign = async (req, res) => {
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const { name, description, budget, startDate, endDate, selectedScreens, timeSlots, creatives, } = req.body;
        const userId = req.user?.id;
        // Create campaign
        const campaignQuery = `
      INSERT INTO campaigns (user_id, name, description, budget, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'draft')
      RETURNING *
    `;
        const campaignResult = await client.query(campaignQuery, [
            userId,
            name,
            description,
            budget,
            startDate,
            endDate,
        ]);
        const campaign = campaignResult.rows[0];
        // Add screens to campaign
        for (const screenData of selectedScreens) {
            const screenCampaignQuery = `
        INSERT INTO campaign_screens (campaign_id, screen_id, start_date, end_date, time_slots)
        VALUES ($1, $2, $3, $4, $5)
      `;
            await client.query(screenCampaignQuery, [
                campaign.id,
                screenData.screenId,
                startDate,
                endDate,
                JSON.stringify(timeSlots),
            ]);
            // Update screen availability
            for (const timeSlot of timeSlots) {
                const availabilityQuery = `
          INSERT INTO screen_availability (screen_id, date, time_slot, is_available)
          VALUES ($1, $2, $3, false)
          ON CONFLICT (screen_id, date, time_slot) 
          DO UPDATE SET is_available = false
        `;
                await client.query(availabilityQuery, [
                    screenData.screenId,
                    startDate,
                    timeSlot,
                ]);
            }
        }
        // Add creatives
        for (const creative of creatives) {
            const creativeQuery = `
        INSERT INTO creatives (campaign_id, file_url, file_type, file_size, duration)
        VALUES ($1, $2, $3, $4, $5)
      `;
            await client.query(creativeQuery, [
                campaign.id,
                creative.fileUrl,
                creative.fileType,
                creative.fileSize,
                creative.duration || 30,
            ]);
        }
        await client.query("COMMIT");
        res.status(201).json({
            message: "Campaign created successfully",
            campaign: {
                ...campaign,
                selectedScreens,
                creatives,
            },
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Create campaign error:", error);
        res.status(500).json({ error: "Failed to create campaign" });
    }
    finally {
        client.release();
    }
};
exports.createCampaign = createCampaign;
// 4. BUDGET ESTIMATOR
const estimateBudget = async (req, res) => {
    try {
        const { screenIds, startDate, endDate, timeSlots } = req.body;
        if (!screenIds || !Array.isArray(screenIds)) {
            return res.status(400).json({ error: "Screen IDs are required" });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        let totalCost = 0;
        const screenCosts = [];
        for (const screenId of screenIds) {
            const screenQuery = `SELECT id, name, price_per_day, price_per_hour FROM screens WHERE id = $1`;
            const screenResult = await db_1.pool.query(screenQuery, [screenId]);
            if (screenResult.rows.length > 0) {
                const screen = screenResult.rows[0];
                const hoursPerDay = timeSlots ? timeSlots.length : 24;
                let screenCost;
                if (hoursPerDay === 24) {
                    screenCost = screen.price_per_day * days;
                }
                else {
                    screenCost = screen.price_per_hour * hoursPerDay * days;
                }
                totalCost += screenCost;
                screenCosts.push({
                    screenId: screen.id,
                    screenName: screen.name,
                    pricePerDay: screen.price_per_day,
                    pricePerHour: screen.price_per_hour,
                    days,
                    hoursPerDay,
                    totalCost: screenCost,
                });
            }
        }
        // Add platform fee (5%)
        const platformFee = totalCost * 0.05;
        const taxes = totalCost * 0.18; // 18% GST
        const grandTotal = totalCost + platformFee + taxes;
        res.json({
            estimation: {
                screenCosts,
                subtotal: totalCost,
                platformFee,
                taxes,
                grandTotal,
                days,
                totalScreens: screenIds.length,
            },
        });
    }
    catch (error) {
        console.error("Budget estimation error:", error);
        res.status(500).json({ error: "Failed to estimate budget" });
    }
};
exports.estimateBudget = estimateBudget;
// 5. GET USER CAMPAIGNS with tracking
const getUserCampaigns = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { status, page = 1, limit = 10 } = req.query;
        let query = `
      SELECT c.*, 
             COUNT(DISTINCT cs.screen_id) as screen_count,
             COALESCE(SUM(a.impressions), 0) as total_impressions,
             COALESCE(SUM(p.amount), 0) as total_spent
      FROM campaigns c
      LEFT JOIN campaign_screens cs ON c.id = cs.campaign_id
      LEFT JOIN analytics a ON cs.screen_id = a.screen_id 
        AND a.date BETWEEN c.start_date AND c.end_date
      LEFT JOIN payments p ON c.id = p.campaign_id AND p.status = 'completed'
      WHERE c.user_id = $1
    `;
        const params = [userId];
        let paramIndex = 1;
        if (status) {
            query += ` AND c.status = $${++paramIndex}`;
            params.push(String(status));
        }
        query += ` GROUP BY c.id ORDER BY c.created_at DESC`;
        query += ` LIMIT $${++paramIndex} OFFSET $${++paramIndex}`;
        params.push(Number(limit), (Number(page) - 1) * Number(limit));
        const result = await db_1.pool.query(query, params);
        res.json({
            campaigns: result.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
            },
        });
    }
    catch (error) {
        console.error("Get user campaigns error:", error);
        res.status(500).json({ error: "Failed to get campaigns" });
    }
};
exports.getUserCampaigns = getUserCampaigns;
// 6. GET CAMPAIGN TRACKING DETAILS
const getCampaignTracking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // Get campaign details
        const campaignQuery = `
      SELECT c.*, 
             COUNT(DISTINCT cs.screen_id) as screen_count,
             COALESCE(SUM(a.impressions), 0) as total_impressions,
             COALESCE(SUM(a.clicks), 0) as total_clicks,
             COALESCE(SUM(p.amount), 0) as total_spent
      FROM campaigns c
      LEFT JOIN campaign_screens cs ON c.id = cs.campaign_id
      LEFT JOIN analytics a ON cs.screen_id = a.screen_id 
        AND a.date BETWEEN c.start_date AND c.end_date
      LEFT JOIN payments p ON c.id = p.campaign_id AND p.status = 'completed'
      WHERE c.id = $1 AND c.user_id = $2
      GROUP BY c.id
    `;
        const campaignResult = await db_1.pool.query(campaignQuery, [id, userId]);
        if (campaignResult.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        // Get screens used
        const screensQuery = `
      SELECT s.*, cs.start_date, cs.end_date, cs.time_slots,
             COALESCE(SUM(a.impressions), 0) as impressions,
             COALESCE(SUM(a.clicks), 0) as clicks
      FROM campaign_screens cs
      JOIN screens s ON cs.screen_id = s.id
      LEFT JOIN analytics a ON s.id = a.screen_id 
        AND a.date BETWEEN cs.start_date AND cs.end_date
      WHERE cs.campaign_id = $1
      GROUP BY s.id, cs.start_date, cs.end_date, cs.time_slots
    `;
        const screensResult = await db_1.pool.query(screensQuery, [id]);
        // Get daily analytics
        const analyticsQuery = `
      SELECT a.date, 
             SUM(a.impressions) as daily_impressions,
             SUM(a.clicks) as daily_clicks,
             COUNT(DISTINCT a.screen_id) as active_screens
      FROM analytics a
      JOIN campaign_screens cs ON a.screen_id = cs.screen_id
      WHERE cs.campaign_id = $1 
        AND a.date BETWEEN cs.start_date AND cs.end_date
      GROUP BY a.date
      ORDER BY a.date
    `;
        const analyticsResult = await db_1.pool.query(analyticsQuery, [id]);
        const campaign = campaignResult.rows[0];
        res.json({
            campaign,
            screens: screensResult.rows,
            dailyAnalytics: analyticsResult.rows,
            summary: {
                totalScreens: screensResult.rows.length,
                totalImpressions: campaign.total_impressions,
                totalClicks: campaign.total_clicks,
                totalSpent: campaign.total_spent,
                ctr: campaign.total_impressions > 0
                    ? ((campaign.total_clicks / campaign.total_impressions) *
                        100).toFixed(2)
                    : 0,
                avgDailyCost: campaign.total_spent / Math.max(1, analyticsResult.rows.length),
            },
        });
    }
    catch (error) {
        console.error("Get campaign tracking error:", error);
        res.status(500).json({ error: "Failed to get campaign tracking" });
    }
};
exports.getCampaignTracking = getCampaignTracking;
// 7. GET PROOF OF PLAY
const getProofOfPlay = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { date, screenId } = req.query;
        // Verify campaign ownership
        const campaignCheck = await db_1.pool.query("SELECT id FROM campaigns WHERE id = $1 AND user_id = $2", [id, userId]);
        if (campaignCheck.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        let proofQuery = `
      SELECT pop.*, s.name as screen_name, s.location
      FROM proof_of_play pop
      JOIN campaign_screens cs ON pop.screen_id = cs.screen_id
      JOIN screens s ON cs.screen_id = s.id
      WHERE cs.campaign_id = $1
    `;
        const params = [id];
        let paramIndex = 1;
        if (date) {
            proofQuery += ` AND DATE(pop.timestamp) = $${++paramIndex}`;
            params.push(String(date));
        }
        if (screenId) {
            proofQuery += ` AND pop.screen_id = $${++paramIndex}`;
            params.push(String(screenId));
        }
        proofQuery += ` ORDER BY pop.timestamp DESC`;
        const result = await db_1.pool.query(proofQuery, params);
        res.json({
            proofOfPlay: result.rows,
            totalEntries: result.rows.length,
        });
    }
    catch (error) {
        console.error("Get proof of play error:", error);
        res.status(500).json({ error: "Failed to get proof of play" });
    }
};
exports.getProofOfPlay = getProofOfPlay;
// 8. PAYMENT PROCESSING
const processPayment = async (req, res) => {
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const { campaignId, amount, paymentMethod, paymentDetails } = req.body;
        const userId = req.user?.id;
        // Verify campaign ownership
        const campaignCheck = await client.query("SELECT id, status FROM campaigns WHERE id = $1 AND user_id = $2", [campaignId, userId]);
        if (campaignCheck.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        // Create payment record
        const paymentQuery = `
      INSERT INTO payments (campaign_id, user_id, amount, payment_method, status, transaction_id)
      VALUES ($1, $2, $3, $4, 'completed', $5)
      RETURNING *
    `;
        const transactionId = `TXN_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const paymentResult = await client.query(paymentQuery, [
            campaignId,
            userId,
            amount,
            paymentMethod,
            transactionId,
        ]);
        // Update campaign status to active
        await client.query("UPDATE campaigns SET status = $1 WHERE id = $2", [
            "active",
            campaignId,
        ]);
        await client.query("COMMIT");
        res.json({
            message: "Payment processed successfully",
            payment: paymentResult.rows[0],
            transactionId,
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error("Payment processing error:", error);
        res.status(500).json({ error: "Failed to process payment" });
    }
    finally {
        client.release();
    }
};
exports.processPayment = processPayment;
// 9. GET AVAILABLE TIME SLOTS for screens
const getAvailableTimeSlots = async (req, res) => {
    try {
        const { screenIds, date } = req.query;
        if (!screenIds) {
            return res.status(400).json({ error: "Screen IDs are required" });
        }
        const ids = Array.isArray(screenIds) ? screenIds : [screenIds];
        const targetDate = date || new Date().toISOString().split("T")[0];
        const query = `
      SELECT screen_id, time_slot, is_available
      FROM screen_availability
      WHERE screen_id = ANY($1) AND date = $2
      ORDER BY screen_id, time_slot
    `;
        const result = await db_1.pool.query(query, [ids, targetDate]);
        // Group by screen_id
        const availabilityByScreen = result.rows.reduce((acc, row) => {
            if (!acc[row.screen_id]) {
                acc[row.screen_id] = [];
            }
            acc[row.screen_id].push({
                timeSlot: row.time_slot,
                available: row.is_available,
            });
            return acc;
        }, {});
        res.json({ availability: availabilityByScreen });
    }
    catch (error) {
        console.error("Get available time slots error:", error);
        res.status(500).json({ error: "Failed to get available time slots" });
    }
};
exports.getAvailableTimeSlots = getAvailableTimeSlots;
// Additional compatibility functions for existing routes
exports.getCampaigns = exports.getUserCampaigns;
exports.getCampaignById = exports.getCampaignTracking;
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const updates = req.body;
        const allowedFields = [
            "name",
            "description",
            "start_date",
            "end_date",
            "status",
        ];
        const updateFields = Object.keys(updates).filter((key) => allowedFields.includes(key));
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }
        const setClause = updateFields
            .map((field, index) => `${field} = $${index + 3}`)
            .join(", ");
        const values = updateFields.map((field) => updates[field]);
        const query = `
      UPDATE campaigns
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
        const result = await db_1.pool.query(query, [id, userId, ...values]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json({
            success: true,
            data: result.rows[0],
            message: "Campaign updated successfully",
        });
    }
    catch (error) {
        console.error("Update campaign error:", error);
        res.status(500).json({ error: "Failed to update campaign" });
    }
};
exports.updateCampaign = updateCampaign;
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const result = await db_1.pool.query("UPDATE campaigns SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING id", ["cancelled", id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json({
            success: true,
            message: "Campaign cancelled successfully",
        });
    }
    catch (error) {
        console.error("Delete campaign error:", error);
        res.status(500).json({ error: "Failed to delete campaign" });
    }
};
exports.deleteCampaign = deleteCampaign;
exports.getCampaignAnalytics = exports.getCampaignTracking;
// ADDITIONAL COMPLETE FEATURES
// GET ALL SCREENS ENDPOINT
const getAllScreens = async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT s.*, 
             COUNT(sm.id) as media_count,
             (SELECT COUNT(*) FROM screen_availability sa 
              WHERE sa.screen_id = s.id AND sa.date >= CURRENT_DATE AND sa.is_available = true) as available_slots
      FROM screens s
      LEFT JOIN screen_media sm ON s.id = sm.screen_id
      WHERE s.is_active = true
      GROUP BY s.id
      ORDER BY s.traffic_estimate DESC
      LIMIT 50
    `);
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).json({ error: "Failed to fetch screens" });
    }
};
exports.getAllScreens = getAllScreens;
// UPDATE CAMPAIGN STATUS
const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        if (!["active", "paused", "completed", "cancelled"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Must be: active, paused, completed, cancelled",
            });
        }
        const result = await db_1.pool.query(`
      UPDATE campaigns 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `, [status, id, userId]);
        if (result.rows.length === 0) {
            return res
                .status(404)
                .json({ error: "Campaign not found or unauthorized" });
        }
        res.json({
            success: true,
            message: "Campaign status updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        console.error("Error updating campaign status:", error);
        res.status(500).json({ error: "Failed to update campaign status" });
    }
};
exports.updateCampaignStatus = updateCampaignStatus;
// GET CITIES LIST FOR SEARCH DROPDOWN
const getCitiesList = async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT 
        city,
        COUNT(*) as screen_count,
        MIN(price_per_day) as min_price,
        MAX(price_per_day) as max_price,
        AVG(traffic_estimate)::INTEGER as avg_traffic
      FROM screens 
      WHERE is_active = true AND city IS NOT NULL
      GROUP BY city
      ORDER BY screen_count DESC
    `);
        res.json({
            success: true,
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ error: "Failed to fetch cities" });
    }
};
exports.getCitiesList = getCitiesList;
// GET ADVANCED FILTERS OPTIONS
const getFilterOptions = async (req, res) => {
    try {
        const [screenTypes, cities, priceRanges] = await Promise.all([
            // Get screen types
            db_1.pool.query(`
        SELECT screen_type, COUNT(*) as count 
        FROM screens 
        WHERE is_active = true AND screen_type IS NOT NULL
        GROUP BY screen_type 
        ORDER BY count DESC
      `),
            // Get cities with screen counts
            db_1.pool.query(`
        SELECT city, COUNT(*) as screen_count
        FROM screens 
        WHERE is_active = true AND city IS NOT NULL
        GROUP BY city 
        ORDER BY screen_count DESC
      `),
            // Get price ranges
            db_1.pool.query(`
        SELECT 
          MIN(price_per_day) as min_price,
          MAX(price_per_day) as max_price,
          PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price_per_day) as price_25th,
          PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price_per_day) as price_75th
        FROM screens 
        WHERE is_active = true AND price_per_day IS NOT NULL
      `),
        ]);
        res.json({
            success: true,
            data: {
                screen_types: screenTypes.rows,
                cities: cities.rows,
                price_ranges: priceRanges.rows[0],
            },
        });
    }
    catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ error: "Failed to fetch filter options" });
    }
};
exports.getFilterOptions = getFilterOptions;
