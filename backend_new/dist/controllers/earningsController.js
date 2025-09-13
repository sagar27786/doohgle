"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyEarnings = getMyEarnings;
exports.getEarningsSummary = getEarningsSummary;
exports.processBookingEarnings = processBookingEarnings;
exports.markEarningsAsPaid = markEarningsAsPaid;
const db_1 = require("../db");
/**
 * Get all earnings for the logged-in screen owner
 */
async function getMyEarnings(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const query = `
      SELECT e.*, 
             b.start_ts as booking_start,
             b.end_ts as booking_end,
             s.screen_name,
             s.location_in_venue
      FROM earnings e
      JOIN bookings b ON e.booking_id = b.id
      JOIN screens s ON e.screen_id = s.id
      WHERE e.screen_owner_id = $1
      ORDER BY e.created_at DESC
    `;
        const result = await db_1.pool.query(query, [userId]);
        // Return in paginated response format
        return res.json({
            data: result.rows,
            total: result.rows.length,
            page: 1,
            limit: result.rows.length,
            totalPages: 1
        });
    }
    catch (err) {
        console.error('Error fetching earnings:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
/**
 * Get earnings summary for the logged-in screen owner
 */
async function getEarningsSummary(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const query = `
      SELECT 
        COUNT(*) as total_earnings,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_payout,
        COALESCE(SUM(amount), 0) as total_earned,
        COUNT(DISTINCT screen_id) as total_screens
      FROM earnings
      WHERE screen_owner_id = $1
    `;
        const result = await db_1.pool.query(query, [userId]);
        return res.json({ summary: result.rows[0] });
    }
    catch (err) {
        console.error('Error fetching earnings summary:', err);
        return res.status(500).json({ message: 'Server error' });
    }
}
/**
 * Process a booking and create earnings record
 * This would typically be called when a booking is completed
 */
async function processBookingEarnings(bookingId) {
    const client = await db_1.pool.connect();
    try {
        await client.query('BEGIN');
        // Get booking details with screen pricing
        const bookingQuery = `
      SELECT 
        b.id as booking_id,
        b.screen_id,
        s.user_id as screen_owner_id,
        b.start_ts,
        b.end_ts,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
        p.currency
      FROM bookings b
      JOIN screens s ON b.screen_id = s.id
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE b.id = $1 AND b.status = 'completed'
      AND NOT EXISTS (SELECT 1 FROM earnings WHERE booking_id = $1)
      FOR UPDATE
    `;
        const bookingResult = await client.query(bookingQuery, [bookingId]);
        if (bookingResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return { success: false, message: 'Booking not found or already processed' };
        }
        const booking = bookingResult.rows[0];
        // Calculate earnings based on booking duration and pricing
        const hours = (new Date(booking.end_ts).getTime() - new Date(booking.start_ts).getTime()) / (1000 * 60 * 60);
        let amount = 0;
        // Use the most cost-effective rate for the screen owner
        if (booking.weekly_rate && hours >= 24 * 7) {
            const weeks = Math.ceil(hours / (24 * 7));
            amount = weeks * booking.weekly_rate;
        }
        else if (booking.daily_rate && hours >= 24) {
            const days = Math.ceil(hours / 24);
            amount = days * booking.daily_rate;
        }
        else if (booking.hourly_rate) {
            amount = Math.ceil(hours) * booking.hourly_rate;
        }
        if (amount <= 0) {
            await client.query('ROLLBACK');
            return { success: false, message: 'Invalid pricing configuration' };
        }
        // Create earnings record
        const insertQuery = `
      INSERT INTO earnings 
        (screen_owner_id, booking_id, screen_id, amount, currency, 
         status, period_start, period_end)
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
      RETURNING *
    `;
        const earningsResult = await client.query(insertQuery, [
            booking.screen_owner_id,
            booking.booking_id,
            booking.screen_id,
            amount,
            booking.currency || 'INR',
            booking.start_ts,
            booking.end_ts
        ]);
        await client.query('COMMIT');
        return {
            success: true,
            earnings: earningsResult.rows[0]
        };
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing booking earnings:', err);
        return { success: false, message: 'Error processing earnings' };
    }
    finally {
        client.release();
    }
}
/**
 * Mark earnings as paid
 * This would typically be called when a payout is processed
 */
async function markEarningsAsPaid(earningsId, paymentMethod, reference) {
    try {
        const query = `
      UPDATE earnings
      SET status = 'paid',
          payment_method = $1,
          payment_reference = $2,
          paid_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const result = await db_1.pool.query(query, [paymentMethod, reference, earningsId]);
        if (result.rows.length === 0) {
            return { success: false, message: 'Earnings record not found' };
        }
        return { success: true, earnings: result.rows[0] };
    }
    catch (err) {
        console.error('Error marking earnings as paid:', err);
        return { success: false, message: 'Error updating earnings' };
    }
}
