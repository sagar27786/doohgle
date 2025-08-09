import { Request, Response } from 'express';
import { pool } from '../db';
import { AuthUser } from '../middleware/auth';

export async function createScreen(req: Request & { user?: AuthUser }, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    screen_name,
    location_in_venue,
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
  } = req.body || {};

  if (!screen_name || !location_in_venue) {
    return res.status(400).json({ message: 'screen_name and location_in_venue are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO screens
       (user_id, screen_name, location_in_venue, screen_size_inches, resolution, orientation, device_type,
        device_model, ads_enabled, ad_frequency, viewing_distance, typical_viewer_duration, peak_viewing_hours)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::text[])
       RETURNING *`,
      [
        userId,
        screen_name,
        location_in_venue,
        screen_size_inches ?? null,
        resolution ?? null,
        orientation ?? 'landscape',
        device_type ?? 'smart_tv',
        device_model ?? null,
        !!ads_enabled,
        Number(ad_frequency) || 0,
        viewing_distance ?? 'close',
        typical_viewer_duration ?? null,
        (Array.isArray(peak_viewing_hours) ? peak_viewing_hours.map(String) : [])
      ]
    );

    return res.status(201).json({ message: 'Screen registered successfully', screen: result.rows[0] });
  } catch (err) {
    console.error('createScreen error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getMyScreens(req: Request & { user?: AuthUser }, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await pool.query('SELECT * FROM screens WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.json({ screens: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err });
  }
}
