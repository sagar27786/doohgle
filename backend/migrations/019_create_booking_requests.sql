-- Create booking_requests table for the new booking request system
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name VARCHAR(255) NOT NULL,
  advertiser_id VARCHAR(255) NOT NULL,
  advertiser_name VARCHAR(255) NOT NULL,
  screen_id INTEGER NOT NULL REFERENCES screens(id),
  screen_name VARCHAR(255) NOT NULL,
  screen_owner_id VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME DEFAULT '09:00',
  end_time TIME DEFAULT '18:00',
  daily_budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  response_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_advertiser_id ON booking_requests(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_screen_id ON booking_requests(screen_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_screen_owner_id ON booking_requests(screen_owner_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booking_requests_updated_at
    BEFORE UPDATE ON booking_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_requests_updated_at();

-- Insert some sample booking requests for testing
INSERT INTO booking_requests (
  campaign_name, advertiser_id, advertiser_name, screen_id, screen_name,
  screen_owner_id, start_date, end_date, start_time, end_time,
  daily_budget, total_budget, message, status
) VALUES 
(
  'Summer Sale Campaign',
  'ads-manager-001', 
  'Ads Manager User',
  1,
  'Mall Central Screen',
  'owner-1',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '14 days',
  '10:00',
  '20:00',
  1500.00,
  12000.00,
  'Looking to promote our summer sale with high visibility during peak hours',
  'pending'
),
(
  'New Product Launch',
  'ads-manager-001',
  'Ads Manager User', 
  2,
  'Airport Terminal Display',
  'owner-2',
  CURRENT_DATE + INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '10 days',
  '06:00',
  '22:00',
  2000.00,
  16000.00,
  'Product launch campaign targeting business travelers',
  'accepted'
),
(
  'Brand Awareness Drive',
  'ads-manager-001',
  'Ads Manager User',
  3,  
  'Metro Station Screen',
  'owner-3',
  CURRENT_DATE - INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '5 days',
  '07:00',
  '21:00',
  1200.00,
  9600.00,
  'Brand awareness campaign for daily commuters',
  'rejected'
);
