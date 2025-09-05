-- Add phone and role columns to users table
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS role VARCHAR(20);

-- Add unique constraints if appropriate
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'UNIQUE' AND table_name = 'users' AND constraint_name = 'users_phone_unique'
  ) THEN
    BEGIN
      ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
    EXCEPTION WHEN duplicate_table THEN
      -- ignore
    END;
  END IF;
END$$;
