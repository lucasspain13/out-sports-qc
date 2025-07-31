-- Make contact fields nullable in waiver_signatures table since they're now collected in registration
-- This allows waivers to be signed independently from registration

-- Make participant contact fields nullable
ALTER TABLE waiver_signatures 
ALTER COLUMN participant_email DROP NOT NULL,
ALTER COLUMN participant_phone DROP NOT NULL;

-- Make emergency contact fields nullable
ALTER TABLE waiver_signatures 
ALTER COLUMN emergency_name DROP NOT NULL,
ALTER COLUMN emergency_phone DROP NOT NULL,
ALTER COLUMN emergency_relation DROP NOT NULL;

-- Update comments to reflect the changes
COMMENT ON COLUMN waiver_signatures.participant_email IS 'Participant email (optional - may be collected in registration instead)';
COMMENT ON COLUMN waiver_signatures.participant_phone IS 'Participant phone (optional - may be collected in registration instead)';
COMMENT ON COLUMN waiver_signatures.emergency_name IS 'Emergency contact name (optional - may be collected in registration instead)';
COMMENT ON COLUMN waiver_signatures.emergency_phone IS 'Emergency contact phone (optional - may be collected in registration instead)';
COMMENT ON COLUMN waiver_signatures.emergency_relation IS 'Emergency contact relation (optional - may be collected in registration instead)';
