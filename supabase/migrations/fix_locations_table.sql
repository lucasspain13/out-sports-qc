-- Fix locations table - Add missing columns or create new table
-- This handles the case where locations table already exists with different schema

-- First, let's try to add the missing column if the table exists
DO $$ 
BEGIN 
    -- Try to add water_fountains column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'water_fountains'
    ) THEN
        ALTER TABLE locations ADD COLUMN water_fountains BOOLEAN DEFAULT false;
    END IF;
    
    -- Try to add other potentially missing columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'facilities'
    ) THEN
        ALTER TABLE locations ADD COLUMN facilities TEXT[] DEFAULT ARRAY[]::TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'field_type'
    ) THEN
        ALTER TABLE locations ADD COLUMN field_type TEXT CHECK (field_type IN ('grass', 'turf', 'indoor', 'court')) DEFAULT 'grass';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'marker_color'
    ) THEN
        ALTER TABLE locations ADD COLUMN marker_color TEXT CHECK (marker_color IN ('green', 'red', 'blue', 'yellow', 'orange')) DEFAULT 'blue';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'capacity'
    ) THEN
        ALTER TABLE locations ADD COLUMN capacity INTEGER;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'concessions'
    ) THEN
        ALTER TABLE locations ADD COLUMN concessions BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'zip_code'
    ) THEN
        ALTER TABLE locations ADD COLUMN zip_code TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE locations ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'locations' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE locations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
    
EXCEPTION 
    WHEN undefined_table THEN
        -- Table doesn't exist, create it
        CREATE TABLE locations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT,
          state TEXT,
          zip_code TEXT,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          facilities TEXT[] DEFAULT ARRAY[]::TEXT[],
          field_type TEXT CHECK (field_type IN ('grass', 'turf', 'indoor', 'court')) DEFAULT 'grass',
          parking BOOLEAN DEFAULT false,
          restrooms BOOLEAN DEFAULT false,
          water_fountains BOOLEAN DEFAULT false,
          marker_color TEXT CHECK (marker_color IN ('green', 'red', 'blue', 'yellow', 'orange')) DEFAULT 'blue',
          capacity INTEGER,
          concessions BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
END $$;

-- Create indexes for common queries (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_field_type ON locations(field_type);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (in case they exist with different names)
DROP POLICY IF EXISTS "Enable read for all users" ON locations;
DROP POLICY IF EXISTS "Enable insert for admins" ON locations;
DROP POLICY IF EXISTS "Enable update for admins" ON locations;
DROP POLICY IF EXISTS "Enable delete for admins" ON locations;

-- Create policies for different user roles
-- Allow all users to view locations (for public game schedules)
CREATE POLICY "Enable read for all users" ON locations
  FOR SELECT USING (true);

-- Only admins can create, update, or delete locations
CREATE POLICY "Enable insert for admins" ON locations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Enable update for admins" ON locations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Enable delete for admins" ON locations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- Create trigger for updated_at (safe to run multiple times)
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default locations for testing (only if they don't exist)
INSERT INTO locations (name, address, city, state, zip_code, latitude, longitude, facilities, field_type, parking, restrooms, water_fountains)
SELECT 'Riverside Park', '123 River Dr', 'Davenport', 'IA', '52801', 41.5236, -90.5776, ARRAY['Scoreboard', 'Dugouts'], 'grass', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Riverside Park');

INSERT INTO locations (name, address, city, state, zip_code, latitude, longitude, facilities, field_type, parking, restrooms, water_fountains)
SELECT 'Community Center Fields', '456 Center St', 'Bettendorf', 'IA', '52722', 41.5448, -90.5151, ARRAY['Indoor Facility', 'Parking Lot'], 'turf', true, true, false
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Community Center Fields');

INSERT INTO locations (name, address, city, state, zip_code, latitude, longitude, facilities, field_type, parking, restrooms, water_fountains)
SELECT 'Downtown Sports Complex', '789 Main St', 'Rock Island', 'IL', '61201', 41.5095, -90.5787, ARRAY['Concessions', 'Bleachers'], 'grass', true, true, true
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Downtown Sports Complex');
