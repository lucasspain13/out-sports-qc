-- Create waiver_signatures table for storing legally binding digital signatures
CREATE TABLE IF NOT EXISTS waiver_signatures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Waiver Information
    waiver_type VARCHAR(50) NOT NULL CHECK (waiver_type IN ('liability', 'photo_release')),
    waiver_version VARCHAR(20) DEFAULT '1.0',
    
    -- Participant Information
    participant_name VARCHAR(255) NOT NULL,
    participant_email VARCHAR(255) NOT NULL,
    participant_phone VARCHAR(20) NOT NULL,
    participant_dob DATE NOT NULL,
    
    -- Emergency Contact
    emergency_name VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    emergency_relation VARCHAR(50) NOT NULL,
    
    -- Minor Information (if applicable)
    is_minor BOOLEAN DEFAULT FALSE,
    guardian_name VARCHAR(255),
    guardian_relation VARCHAR(50),
    
    -- Digital Signature
    digital_signature VARCHAR(255) NOT NULL,
    
    -- Legal Acknowledgments
    acknowledge_terms BOOLEAN NOT NULL DEFAULT FALSE,
    voluntary_signature BOOLEAN NOT NULL DEFAULT FALSE,
    legal_age_certification BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Audit Information
    ip_address INET,
    user_agent TEXT,
    signature_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- System Fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waiver_signatures_participant_email ON waiver_signatures(participant_email);
CREATE INDEX IF NOT EXISTS idx_waiver_signatures_waiver_type ON waiver_signatures(waiver_type);
CREATE INDEX IF NOT EXISTS idx_waiver_signatures_signature_timestamp ON waiver_signatures(signature_timestamp);
CREATE INDEX IF NOT EXISTS idx_waiver_signatures_participant_name ON waiver_signatures(participant_name);

-- Enable Row Level Security
ALTER TABLE waiver_signatures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON waiver_signatures
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON waiver_signatures
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waiver_signatures_updated_at 
    BEFORE UPDATE ON waiver_signatures 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE waiver_signatures IS 'Stores legally binding digital signatures for liability and photo release waivers';
COMMENT ON COLUMN waiver_signatures.waiver_type IS 'Type of waiver: liability or photo_release';
COMMENT ON COLUMN waiver_signatures.digital_signature IS 'Participants typed legal name as digital signature';
COMMENT ON COLUMN waiver_signatures.ip_address IS 'IP address for legal verification';
COMMENT ON COLUMN waiver_signatures.user_agent IS 'Browser/device information for legal verification';
COMMENT ON COLUMN waiver_signatures.signature_timestamp IS 'Exact timestamp when signature was provided';
