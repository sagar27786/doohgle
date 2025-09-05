ALTER TABLE booking_requests
ALTER COLUMN creative_url TYPE TEXT[] USING ARRAY[creative_url],
ALTER COLUMN creative_type TYPE TEXT[] USING ARRAY[creative_type];