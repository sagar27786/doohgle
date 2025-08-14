-- 006_create_screen_details.sql
-- This migration creates tables for screen assets, pricing, and availability.

-- Stores URLs for screen photos (day/night) and videos.
CREATE TABLE IF NOT EXISTS screen_assets (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL, -- e.g., 'photo_day', 'photo_night', 'video'
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_screen_assets_on_screen_id ON screen_assets(screen_id);

-- Stores pricing tiers for each screen.
CREATE TABLE IF NOT EXISTS screen_pricing (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  hourly_rate NUMERIC(10, 2),
  daily_rate NUMERIC(10, 2),
  weekly_rate NUMERIC(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  UNIQUE(screen_id)
);

-- Stores the availability for each screen on a given date.
CREATE TABLE IF NOT EXISTS screen_availability (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(screen_id, date)
);
