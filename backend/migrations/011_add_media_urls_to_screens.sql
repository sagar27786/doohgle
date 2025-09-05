-- Migration: Add media URL columns to screens table
-- This allows direct storage of S3 URLs for uploaded images and videos

BEGIN;

-- Add columns for storing S3 URLs directly in screens table
ALTER TABLE screens 
ADD COLUMN IF NOT EXISTS day_photo_url TEXT,
ADD COLUMN IF NOT EXISTS night_photo_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_screens_day_photo_url ON screens(day_photo_url) WHERE day_photo_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_screens_night_photo_url ON screens(night_photo_url) WHERE night_photo_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_screens_video_url ON screens(video_url) WHERE video_url IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN screens.day_photo_url IS 'S3 URL for daytime photo of the screen';
COMMENT ON COLUMN screens.night_photo_url IS 'S3 URL for nighttime photo of the screen';
COMMENT ON COLUMN screens.video_url IS 'S3 URL for video demonstration of the screen';

COMMIT;