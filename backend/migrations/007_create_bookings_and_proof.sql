-- 007_create_bookings_and_proof.sql
-- This migration creates tables for bookings and proof of play.

-- Define booking_status type if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM('pending', 'accepted', 'rejected', 'cancelled');
  END IF;
END $$;

-- Stores booking requests from advertisers.
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  end_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bookings_on_screen_id ON bookings(screen_id);
CREATE INDEX IF NOT EXISTS idx_bookings_on_advertiser_id ON bookings(advertiser_id);

-- Define proof_type type if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'proof_type') THEN
    CREATE TYPE proof_type AS ENUM('photo', 'video');
  END IF;
END $$;

-- Stores URLs to proof of play assets.
CREATE TABLE IF NOT EXISTS proof_of_play (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type proof_type NOT NULL,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_proof_of_play_on_booking_id ON proof_of_play(booking_id);
