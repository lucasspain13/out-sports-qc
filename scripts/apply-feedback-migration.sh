#!/bin/bash

# Script to apply the website feedback table migration
# This should be run in your Supabase SQL editor or via the Supabase CLI

echo "To apply the website feedback migration:"
echo "1. Open your Supabase dashboard"
echo "2. Go to the SQL Editor"
echo "3. Copy and run the contents of: supabase/migrations/create_website_feedback_table.sql"
echo ""
echo "Or if you have Supabase CLI installed:"
echo "supabase db push"
echo ""
echo "The migration will create:"
echo "- website_feedback table with proper schema"
echo "- Indexes for performance"
echo "- Row Level Security policies"
echo "- Auto-update triggers for updated_at"
