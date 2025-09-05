-- Migration: Create Campaign Requests System
-- This creates a system where advertisers create campaign requests that venue owners can approve/reject

BEGIN;

-- Create campaign_requests table
CREATE TABLE IF NOT EXISTS campaign_requests (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  campaign_name VARCHAR(255) NOT NULL,
  campaign_description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  requested_hours INTEGER[] DEFAULT '{}', -- Array of hours (0-23)
  budget_offered NUMERIC(10, 2) NOT NULL,
  creative_assets JSONB DEFAULT '[]', -- Array of creative assets
  target_audience TEXT,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT
);

-- Create indexes for campaign_requests
CREATE INDEX IF NOT EXISTS idx_campaign_requests_advertiser_id ON campaign_requests(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_campaign_requests_venue_owner_id ON campaign_requests(venue_owner_id);
CREATE INDEX IF NOT EXISTS idx_campaign_requests_screen_id ON campaign_requests(screen_id);
CREATE INDEX IF NOT EXISTS idx_campaign_requests_status ON campaign_requests(status);
CREATE INDEX IF NOT EXISTS idx_campaign_requests_created_at ON campaign_requests(created_at);

-- Create campaigns table (if not exists)
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  advertiser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_request_id INTEGER REFERENCES campaign_requests(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  budget NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed, cancelled
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_advertiser_id ON campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);

-- Create campaign_screens junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS campaign_screens (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  campaign_request_id INTEGER REFERENCES campaign_requests(id) ON DELETE SET NULL,
  allocated_budget NUMERIC(10, 2),
  scheduled_hours INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, screen_id)
);

-- Create indexes for campaign_screens
CREATE INDEX IF NOT EXISTS idx_campaign_screens_campaign_id ON campaign_screens(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_screens_screen_id ON campaign_screens(screen_id);

-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'campaign_request', 'request_approved', 'request_rejected', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id INTEGER, -- ID of related entity (campaign_request_id, booking_id, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Update bookings table to link with campaign_requests
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS campaign_request_id INTEGER REFERENCES campaign_requests(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL;

-- Update trigger for campaign_requests
CREATE OR REPLACE FUNCTION update_campaign_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaign_requests_updated_at
  BEFORE UPDATE ON campaign_requests
  FOR EACH ROW EXECUTE PROCEDURE update_campaign_requests_updated_at();

-- Update trigger for campaigns
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE PROCEDURE update_campaigns_updated_at();

COMMIT;
 