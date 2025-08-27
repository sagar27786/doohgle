-- 022_create_enhanced_booking_system.sql
-- Enhanced booking system with location-wide notifications

-- Create booking_requests table for handling requests to multiple owners
CREATE TABLE IF NOT EXISTS booking_requests (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  screen_owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  company_name VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  message TEXT,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_owner_id ON booking_requests(screen_owner_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_location ON booking_requests(location);
CREATE INDEX IF NOT EXISTS idx_booking_requests_booking_id ON booking_requests(booking_id);

-- Create notifications table for tracking all notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'booking_request', 'booking_approved', 'booking_rejected', 'payment_required'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Store additional data like booking_id, screen_id, etc.
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Update existing bookings table to match current usage
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update status column to use string instead of enum for flexibility
ALTER TABLE bookings ALTER COLUMN status TYPE VARCHAR(20);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booking_requests_updated_at 
    BEFORE UPDATE ON booking_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO notifications (user_id, type, title, message, data) 
SELECT 
    u.id,
    'booking_request',
    'New Booking Request in ' || s.city,
    'A customer is looking for screen advertising in your area.',
    jsonb_build_object('location', s.city, 'screen_count', count(*))
FROM users u
JOIN screens s ON s.user_id = u.id
WHERE s.ads_enabled = true AND s.is_active = true
GROUP BY u.id, s.city
ON CONFLICT DO NOTHING;
