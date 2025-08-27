-- Make email column nullable to support phone-only signups
-- Migration: 019_make_email_nullable.sql

BEGIN;

-- Remove the NOT NULL constraint from email column
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Update the unique constraint to handle nullable emails properly
-- Drop the existing unique constraint (only one exists)
DROP INDEX IF EXISTS idx_users_email;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Create a partial unique index that only applies to non-null emails
CREATE UNIQUE INDEX idx_users_email_unique ON users(email) WHERE email IS NOT NULL;

-- Add a check constraint to ensure at least email or phone is provided
ALTER TABLE users ADD CONSTRAINT users_email_or_phone_required 
  CHECK (email IS NOT NULL OR phone IS NOT NULL);

COMMIT;
