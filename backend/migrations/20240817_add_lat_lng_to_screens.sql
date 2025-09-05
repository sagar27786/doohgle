-- Add latitude and longitude columns to screens table
ALTER TABLE screens 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_screens_location ON screens (latitude, longitude);
