-- Create substitute_registrations table for managing substitute players
CREATE TABLE IF NOT EXISTS substitute_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sport_type TEXT NOT NULL CHECK (sport_type IN ('kickball', 'dodgeball')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    preferred_pronouns TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    phone TEXT NOT NULL,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    agree_to_terms BOOLEAN DEFAULT true,
    agree_to_text_updates BOOLEAN DEFAULT false,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_substitute_registrations_sport_type ON substitute_registrations(sport_type);
CREATE INDEX IF NOT EXISTS idx_substitute_registrations_is_active ON substitute_registrations(is_active);
CREATE INDEX IF NOT EXISTS idx_substitute_registrations_created_at ON substitute_registrations(created_at);

-- Add comments for documentation
COMMENT ON TABLE substitute_registrations IS 'Registration data for substitute players who can fill in when regular players are unavailable';
COMMENT ON COLUMN substitute_registrations.sport_type IS 'The sport the substitute is registering for (kickball or dodgeball)';
COMMENT ON COLUMN substitute_registrations.age IS 'Age (must be 18 or older)';
COMMENT ON COLUMN substitute_registrations.is_active IS 'Whether the substitute is currently available for games';

-- Enable RLS (Row Level Security)
ALTER TABLE substitute_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (registration)
CREATE POLICY "Allow public insert" ON substitute_registrations
    FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to read registrations
CREATE POLICY "Users can view registrations" ON substitute_registrations
    FOR SELECT USING (true);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_substitute_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER substitute_registrations_updated_at
    BEFORE UPDATE ON substitute_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_substitute_registrations_updated_at();