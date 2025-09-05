-- Add ads manager functionality to existing schema
-- This extends the existing database without modifying current tables

-- Add columns to existing screens table if they don't exist
DO $$ 
BEGIN
    -- Add cost_per_10_seconds column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='screens' AND column_name='cost_per_10_seconds') THEN
        ALTER TABLE screens ADD COLUMN cost_per_10_seconds DECIMAL(10,2) DEFAULT 10.00;
    END IF;
    
    -- Add additional columns for ads manager
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='screens' AND column_name='peak_hours') THEN
        ALTER TABLE screens ADD COLUMN peak_hours TEXT DEFAULT '09:00-12:00,17:00-21:00';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='screens' AND column_name='demographics') THEN
        ALTER TABLE screens ADD COLUMN demographics TEXT DEFAULT 'General audience';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='screens' AND column_name='image_url') THEN
        ALTER TABLE screens ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='screens' AND column_name='video_url') THEN
        ALTER TABLE screens ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- Create campaigns table for ads manager
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME DEFAULT '00:00:00',
    end_time TIME DEFAULT '23:59:59',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'paused', 'cancelled'
    total_budget DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign screens mapping
CREATE TABLE IF NOT EXISTS campaign_screens (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    cost_per_slot DECIMAL(10,2) NOT NULL,
    total_slots INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, screen_id)
);

-- Creatives table
CREATE TABLE IF NOT EXISTS creatives (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image', 'video', 'html5'
    file_url TEXT NOT NULL,
    file_size INTEGER,
    duration INTEGER DEFAULT 10,
    width INTEGER,
    height INTEGER,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    plays INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    engagement_time INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, screen_id, date)
);

-- Proof of play
CREATE TABLE IF NOT EXISTS proof_of_play (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    creative_id INTEGER REFERENCES creatives(id) ON DELETE CASCADE,
    play_time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    proof_image_url TEXT,
    proof_video_url TEXT,
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screen availability (for booking time slots)
CREATE TABLE IF NOT EXISTS screen_availability (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booked_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(screen_id, date, start_time, end_time)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_screens_campaign ON campaign_screens(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_date ON campaign_analytics(date);
CREATE INDEX IF NOT EXISTS idx_proof_of_play_time ON proof_of_play(play_time);
CREATE INDEX IF NOT EXISTS idx_screen_availability_date ON screen_availability(screen_id, date);
