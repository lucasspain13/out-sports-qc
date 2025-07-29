-- Create website_feedback table for storing user feedback, bug reports, and suggestions
-- This table supports the feedback system in the Out Sports League Management app

CREATE TABLE IF NOT EXISTS website_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  feedback_type TEXT CHECK (feedback_type IN ('bug', 'suggestion', 'content', 'other')) DEFAULT 'other',
  status TEXT CHECK (status IN ('new', 'in_progress', 'resolved', 'dismissed')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_website_feedback_status ON website_feedback(status);
CREATE INDEX IF NOT EXISTS idx_website_feedback_priority ON website_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_website_feedback_feedback_type ON website_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_website_feedback_created_at ON website_feedback(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE website_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for different user roles
-- Allow all authenticated users to create feedback
CREATE POLICY "Enable insert for authenticated users" ON website_feedback
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow admins to view all feedback
CREATE POLICY "Enable read for admins" ON website_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update feedback (status, priority, admin notes)
CREATE POLICY "Enable update for admins" ON website_feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to delete feedback if needed
CREATE POLICY "Enable delete for admins" ON website_feedback
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
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
DROP TRIGGER IF EXISTS update_website_feedback_updated_at ON website_feedback;
CREATE TRIGGER update_website_feedback_updated_at
    BEFORE UPDATE ON website_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment on table and columns for documentation
COMMENT ON TABLE website_feedback IS 'Stores user feedback, bug reports, and suggestions for the website';
COMMENT ON COLUMN website_feedback.id IS 'Unique identifier for the feedback entry';
COMMENT ON COLUMN website_feedback.url IS 'The URL where the feedback was submitted from';
COMMENT ON COLUMN website_feedback.user_agent IS 'Browser user agent string for debugging context';
COMMENT ON COLUMN website_feedback.issue_description IS 'The actual feedback/issue description from the user';
COMMENT ON COLUMN website_feedback.feedback_type IS 'Category of feedback: bug, suggestion, content, or other';
COMMENT ON COLUMN website_feedback.status IS 'Current status: new, in_progress, resolved, or dismissed';
COMMENT ON COLUMN website_feedback.priority IS 'Priority level: low, medium, or high';
COMMENT ON COLUMN website_feedback.resolved_at IS 'Timestamp when the feedback was marked as resolved';
COMMENT ON COLUMN website_feedback.admin_notes IS 'Internal notes added by administrators';
