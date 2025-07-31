-- Add date_of_birth column to player_registrations table
-- This migration assumes the player_registrations table already exists

-- Add the date_of_birth column
ALTER TABLE player_registrations 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add a comment to document the new field
COMMENT ON COLUMN player_registrations.date_of_birth IS 'Player date of birth (used to calculate age and verify 18+ requirement)';

-- Create an index for performance on date queries
CREATE INDEX IF NOT EXISTS idx_player_registrations_date_of_birth ON player_registrations(date_of_birth);

-- Optional: Add a check constraint to ensure reasonable birth dates (not in the future, not too old)
ALTER TABLE player_registrations 
ADD CONSTRAINT IF NOT EXISTS chk_reasonable_birth_date 
CHECK (date_of_birth >= '1900-01-01' AND date_of_birth <= CURRENT_DATE);

-- Optional: Add a check constraint to ensure players are 18 or older
ALTER TABLE player_registrations 
ADD CONSTRAINT IF NOT EXISTS chk_minimum_age 
CHECK (date_of_birth <= (CURRENT_DATE - INTERVAL '18 years'));
