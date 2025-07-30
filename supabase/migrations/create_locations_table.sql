-- Create locations table for storing game locations
-- This table supports the location management system in the Out Sports League Management app

CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  facilities TEXT[], -- Array of facility names
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

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_field_type ON locations(field_type);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

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

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default locations for testing (optional)
INSERT INTO locations (name, address, city, state, zip_code, latitude, longitude, facilities, field_type, parking, restrooms, water_fountains)
VALUES 
  ('Riverside Park', '123 River Dr', 'Davenport', 'IA', '52801', 41.5236, -90.5776, ARRAY['Scoreboard', 'Dugouts'], 'grass', true, true, true),
  ('Community Center Fields', '456 Center St', 'Bettendorf', 'IA', '52722', 41.5448, -90.5151, ARRAY['Indoor Facility', 'Parking Lot'], 'turf', true, true, false),
  ('Downtown Sports Complex', '789 Main St', 'Rock Island', 'IL', '61201', 41.5095, -90.5787, ARRAY['Concessions', 'Bleachers'], 'grass', true, true, true)
ON CONFLICT (name) DO NOTHING;

-- Comment on table and columns for documentation
COMMENT ON TABLE locations IS 'Stores game locations for the Out Sports League';
COMMENT ON COLUMN locations.id IS 'Unique identifier for the location';
COMMENT ON COLUMN locations.name IS 'Display name of the location';
COMMENT ON COLUMN locations.address IS 'Street address of the location';
COMMENT ON COLUMN locations.city IS 'City where the location is situated';
COMMENT ON COLUMN locations.state IS 'State/province where the location is situated';
COMMENT ON COLUMN locations.zip_code IS 'Postal/ZIP code for the location';
COMMENT ON COLUMN locations.latitude IS 'Latitude coordinate for mapping';
COMMENT ON COLUMN locations.longitude IS 'Longitude coordinate for mapping';
COMMENT ON COLUMN locations.facilities IS 'Array of available facilities at this location';
COMMENT ON COLUMN locations.field_type IS 'Type of playing surface: grass, turf, indoor, or court';
COMMENT ON COLUMN locations.parking IS 'Whether parking is available';
COMMENT ON COLUMN locations.restrooms IS 'Whether restrooms are available';
COMMENT ON COLUMN locations.water_fountains IS 'Whether water fountains are available';
COMMENT ON COLUMN locations.marker_color IS 'Color for map markers when displaying this location';
COMMENT ON COLUMN locations.capacity IS 'Maximum capacity/seating at this location';
COMMENT ON COLUMN locations.concessions IS 'Whether concessions are available';
