-- 008_create_screens_table.sql
-- Create the screens table with the columns expected by the application

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
  ads_enabled BOOLEAN DEFAULT FALSE,
  ad_frequency INTEGER DEFAULT 0,
  viewing_distance VARCHAR(20) DEFAULT 'close',
  typical_viewer_duration TEXT,
  peak_viewing_hours TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_screens_on_user_id ON screens(user_id);
CREATE INDEX IF NOT EXISTS idx_screens_on_screen_name ON screens(screen_name);
