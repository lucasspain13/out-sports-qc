-- Create registration_details table to store configurable registration form information
CREATE TABLE IF NOT EXISTS registration_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sport TEXT NOT NULL,
    season TEXT NOT NULL,
    duration TEXT NOT NULL,
    game_time TEXT NOT NULL,
    location TEXT NOT NULL,
    team_size TEXT NOT NULL,
    sport_type TEXT NOT NULL CHECK (sport_type IN ('kickball', 'dodgeball')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE registration_details ENABLE ROW LEVEL SECURITY;

-- Allow public read access to registration details
CREATE POLICY "Public users can view registration details" ON registration_details
    FOR SELECT USING (true);

-- Only authenticated users can modify registration details
CREATE POLICY "Authenticated users can modify registration details" ON registration_details
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default values for kickball
INSERT INTO registration_details (sport, season, duration, game_time, location, team_size, sport_type)
VALUES ('Kickball', 'Fall 2025', '7 weeks', 'Sundays 2-4pm', 'TBD', '16 players', 'kickball')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registration_details_updated_at 
    BEFORE UPDATE ON registration_details 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
