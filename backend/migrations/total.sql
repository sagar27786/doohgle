-- total.sql
-- Complete DB schema for Doohgle (run on an empty Postgres database)
-- Run with: psql "$DATABASE_URL" -f backend/migrations/total.sql

BEGIN;

-- 1) Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name TEXT,
  phone VARCHAR(20),
  role VARCHAR(20), -- 'advertiser' | 'venue_owner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2) OTPs table (email nullable to support phone-only OTPs)
CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otps(phone);

-- 3) Screens table
CREATE TABLE IF NOT EXISTS screens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  screen_name TEXT NOT NULL,
  location_in_venue TEXT NOT NULL,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_screens_on_user_id ON screens(user_id);
CREATE INDEX IF NOT EXISTS idx_screens_on_screen_name ON screens(screen_name);

-- 4) Screen assets
CREATE TABLE IF NOT EXISTS screen_assets (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  asset_type VARCHAR(20) NOT NULL, -- e.g., 'photo_day', 'photo_night', 'video'
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_screen_assets_on_screen_id ON screen_assets(screen_id);

-- 5) Screen pricing
CREATE TABLE IF NOT EXISTS screen_pricing (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  hourly_rate NUMERIC(10, 2),
  daily_rate NUMERIC(10, 2),
  weekly_rate NUMERIC(10, 2),
  currency VARCHAR(10) DEFAULT 'INR',
  UNIQUE(screen_id)
);

-- 6) Screen availability
CREATE TABLE IF NOT EXISTS screen_availability (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(screen_id, date)
);

-- 7) Booking status enum type
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM('pending', 'accepted', 'rejected', 'cancelled');
  END IF;
END $$;

-- 8) Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  end_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bookings_on_screen_id ON bookings(screen_id);
CREATE INDEX IF NOT EXISTS idx_bookings_on_advertiser_id ON bookings(advertiser_id);

-- 9) Proof type enum type
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'proof_type') THEN
    CREATE TYPE proof_type AS ENUM('photo', 'video');
  END IF;
END $$;

-- 10) Proof of play table
CREATE TABLE IF NOT EXISTS proof_of_play (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type proof_type NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_proof_of_play_on_booking_id ON proof_of_play(booking_id);

-- 11) Optional: add users_phone_unique constraint if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'UNIQUE' AND table_name = 'users' AND constraint_name = 'users_phone_unique'
  ) THEN
    BEGIN
      ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
    EXCEPTION WHEN duplicate_table THEN
      -- ignore
    END;
  END IF;
END$$;

-- 12) Ensure users has password_hash column (for older schemas that used `password`)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'password'
    ) THEN
      ALTER TABLE users RENAME COLUMN password TO password_hash;
    ELSE
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    END IF;
  END IF;
END$$;

-- 13) Triggers: generic updated_at setter
CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_users') THEN
    CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_screens') THEN
    CREATE TRIGGER set_updated_at_screens
    BEFORE UPDATE ON screens
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();
  END IF;
END$$;

COMMIT;
