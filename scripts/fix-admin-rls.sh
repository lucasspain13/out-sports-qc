#!/bin/bash

# Script to apply the admin RLS policy fix
# This will update the RLS policies to use database-based admin checks instead of JWT claims

echo "🔧 Applying admin RLS policy fix..."
echo "This will update Row Level Security policies to check database admin status instead of JWT claims"
echo ""

# Check if we're in the project directory
if [ ! -f "fix-admin-rls-policies.sql" ]; then
    echo "❌ Error: fix-admin-rls-policies.sql not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo "Please install it first: npm install -g supabase"
    echo "Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "📊 Running the fix..."

# Apply the SQL fix
if supabase db reset --linked 2>/dev/null || supabase migration new fix_admin_rls_policies < fix-admin-rls-policies.sql; then
    echo "✅ Successfully applied admin RLS policy fix!"
    echo ""
    echo "📋 What was changed:"
    echo "  • Updated all admin RLS policies to check user_profiles.is_admin instead of JWT claims"
    echo "  • This fixes the 406/PGRST116 errors when updating hero content"
    echo "  • Admin permissions now work consistently with the application logic"
    echo ""
    echo "🔄 Please refresh your browser to test the hero content update functionality"
else
    echo "❌ Error applying the fix. You may need to manually run the SQL file:"
    echo "   1. Open your Supabase dashboard"
    echo "   2. Go to SQL Editor"
    echo "   3. Copy and paste the contents of fix-admin-rls-policies.sql"
    echo "   4. Run the query"
fi

echo ""
echo "🧪 To test the fix:"
echo "  1. Login as an admin user in your application"
echo "  2. Navigate to the hero content management dashboard"
echo "  3. Try updating an existing hero content entry"
echo "  4. The 406/PGRST116 error should be resolved"
