-- Migration: Create favorite_screens table for user's favorite screens
-- This allows users to mark screens as favorites like Instagram's heart feature

CREATE TABLE IF NOT EXISTS favorite_screens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure a user can only favorite a screen once
  UNIQUE(user_id, screen_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorite_screens_user_id ON favorite_screens(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_screens_screen_id ON favorite_screens(screen_id);
CREATE INDEX IF NOT EXISTS idx_favorite_screens_created_at ON favorite_screens(created_at);

-- Add comments for documentation
COMMENT ON TABLE favorite_screens IS 'Stores user favorite screens like Instagram heart feature';
COMMENT ON COLUMN favorite_screens.user_id IS 'Reference to the user who favorited the screen';
COMMENT ON COLUMN favorite_screens.screen_id IS 'Reference to the favorited screen';
COMMENT ON COLUMN favorite_screens.created_at IS 'When the screen was favorited';
COMMENT ON COLUMN favorite_screens.updated_at IS 'When the favorite was last updated';