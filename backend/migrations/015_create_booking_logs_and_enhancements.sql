-- 015_create_booking_logs_and_enhancements.sql
-- Enhanced booking system with logs and synchronization

-- Create booking logs table for audit trail
CREATE TABLE IF NOT EXISTS booking_logs (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  details JSONB,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_booking_logs_on_booking_id ON booking_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_logs_on_created_at ON booking_logs(created_at);

-- Add missing columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_hours JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS content_url TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES campaigns(id);

-- Update booking_status enum to include more statuses
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'confirmed';
    ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'active';
    ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'completed';
  END IF;
END $$;

-- Create screen availability view for quick lookups
CREATE OR REPLACE VIEW screen_availability AS
SELECT 
  s.id as screen_id,
  s.screen_name,
  s.location_name,
  s.city,
  s.state,
  s.is_active,
  COUNT(CASE 
    WHEN b.status IN ('pending', 'confirmed', 'active') 
         AND b.start_date <= CURRENT_DATE + INTERVAL '30 days' 
    THEN 1 
  END) as active_bookings_count,
  ARRAY_AGG(
    CASE 
      WHEN b.status IN ('pending', 'confirmed', 'active') 
           AND b.start_date <= CURRENT_DATE + INTERVAL '30 days' 
      THEN json_build_object(
        'start_date', b.start_date,
        'end_date', b.end_date,
        'status', b.status
      )
    END
  ) FILTER (WHERE b.status IN ('pending', 'confirmed', 'active')) as upcoming_bookings
FROM screens s
LEFT JOIN bookings b ON s.id = b.screen_id
WHERE s.is_active = true
GROUP BY s.id, s.screen_name, s.location_name, s.city, s.state, s.is_active;

-- Create booking summary view
CREATE OR REPLACE VIEW booking_summary AS
SELECT 
  b.id,
  b.screen_id,
  b.advertiser_id,
  b.campaign_id,
  b.start_date,
  b.end_date,
  b.total_amount,
  b.status,
  s.screen_name,
  s.location_name,
  s.city,
  s.state,
  s.user_id as screen_owner_id,
  c.name as campaign_name,
  u.email as advertiser_email,
  owner.email as owner_email,
  (
    SELECT COUNT(*) 
    FROM proof_of_play pp 
    WHERE pp.booking_id = b.id
  ) as proof_count,
  b.created_at,
  b.cancelled_at
FROM bookings b
JOIN screens s ON b.screen_id = s.id
LEFT JOIN campaigns c ON b.campaign_id = c.id
LEFT JOIN users u ON b.advertiser_id = u.id
LEFT JOIN users owner ON s.user_id = owner.id;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_on_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_on_end_date ON bookings(end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_on_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_on_campaign_id ON bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bookings_on_created_at ON bookings(created_at);

-- Create function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_screen_id INTEGER,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_booking_id INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM bookings
  WHERE screen_id = p_screen_id
    AND status IN ('pending', 'confirmed', 'active')
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
    AND (
      (start_date <= p_start_date AND end_date >= p_start_date)
      OR (start_date <= p_end_date AND end_date >= p_end_date)
      OR (start_date >= p_start_date AND end_date <= p_end_date)
    );
  
  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log booking changes
CREATE OR REPLACE FUNCTION log_booking_changes() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_logs (booking_id, action, details)
    VALUES (NEW.id, 'created', json_build_object('status', NEW.status));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO booking_logs (booking_id, action, details)
      VALUES (NEW.id, 'status_changed', json_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      ));
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO booking_logs (booking_id, action, details)
    VALUES (OLD.id, 'deleted', json_build_object('status', OLD.status));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS booking_changes_trigger ON bookings;
CREATE TRIGGER booking_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION log_booking_changes();

-- Sample data to test the system
INSERT INTO booking_logs (booking_id, action, details, created_at) 
SELECT 
  b.id,
  'system_initialized',
  json_build_object('status', b.status, 'created_at', b.created_at),
  CURRENT_TIMESTAMP
FROM bookings b 
WHERE NOT EXISTS (SELECT 1 FROM booking_logs WHERE booking_id = b.id);
