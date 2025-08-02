-- Add UPDATE policy to waiver_signatures to allow photo permission changes
-- This enables users to update their photo release waiver permission (GRANT <-> WITHHOLD)

-- Add policy to allow updates to waiver_signatures
CREATE POLICY "Enable waiver updates for all users" ON waiver_signatures
    FOR UPDATE USING (true) WITH CHECK (true);

-- Add comment explaining the policy
COMMENT ON POLICY "Enable waiver updates for all users" ON waiver_signatures IS 'Allows users to update their photo release waiver permissions (e.g., changing from GRANT to WITHHOLD or vice versa)';
