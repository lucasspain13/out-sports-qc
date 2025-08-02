-- Fix shirt size constraint to include 4XL
-- Drop the existing constraint and create a new one with 4XL included

-- First, let's see what the current constraint looks like
-- We'll drop it and recreate it with the correct values

-- Drop the existing check constraint
ALTER TABLE player_registrations 
DROP CONSTRAINT IF EXISTS player_registrations_shirt_size_check;

-- Add the new constraint with 4XL included
ALTER TABLE player_registrations 
ADD CONSTRAINT player_registrations_shirt_size_check 
CHECK (shirt_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'));
