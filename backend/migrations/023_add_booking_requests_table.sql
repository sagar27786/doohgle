-- 023_add_booking_requests_table.sql
-- Just add the booking_requests table we need

CREATE TABLE IF NOT EXISTS booking_requests (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER,
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_booking_requests_owner_id ON booking_requests(screen_owner_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_location ON booking_requests(location);

-- Add missing columns to notifications table if they don't exist
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS data JSONB,
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;

-- Create index for read column
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
