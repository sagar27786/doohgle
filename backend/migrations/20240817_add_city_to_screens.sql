-- Add city column to screens table
ALTER TABLE screens 
ADD COLUMN IF NOT EXISTS city TEXT;

-- Create an index for city-based queries
CREATE INDEX IF NOT EXISTS idx_screens_city ON screens (city);
