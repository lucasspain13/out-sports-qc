-- Fix waiver_signatures RLS policies to allow anonymous waiver submissions
-- This allows people to submit waivers without having to create an account

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON waiver_signatures;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON waiver_signatures;

-- Create new policies that allow anonymous waiver submissions
-- Allow anyone to submit waivers (insert)
CREATE POLICY "Enable waiver submission for all users" ON waiver_signatures
    FOR INSERT WITH CHECK (true);

-- Allow anyone to read waiver data (needed for admin dashboard and status checking)
CREATE POLICY "Enable read access for all users" ON waiver_signatures
    FOR SELECT USING (true);

-- Update comments
COMMENT ON TABLE waiver_signatures IS 'Stores legally binding digital signatures for liability and photo release waivers. Allows anonymous submissions for participant access.';
