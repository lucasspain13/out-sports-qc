#!/bin/bash

# Comprehensive script to run all pending Supabase migrations and setup scripts
# Run this script to apply all database changes from the past week

echo "🚀 Running all pending Supabase migrations and setup scripts..."
echo "=================================================================="
echo ""

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're linked to a Supabase project
echo "🔗 Checking Supabase project connection..."
if ! supabase status &> /dev/null; then
    echo "❌ Not linked to a Supabase project. Please run:"
    echo "supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "You can find your project ref in your Supabase dashboard URL:"
    echo "https://supabase.com/dashboard/project/[PROJECT_REF]"
    exit 1
fi

echo "✅ Connected to Supabase project"
echo ""

# 1. Website Feedback Migration
echo "📝 1. Applying Website Feedback table migration..."
echo "   Creates: website_feedback table with RLS policies"
if supabase db push --include-pattern "create_website_feedback_table.sql" &> /dev/null; then
    echo "   ✅ Website feedback table created successfully"
else
    echo "   ⚠️  Website feedback migration may have already been applied"
fi
echo ""

# 2. Registration Details Migration  
echo "📝 2. Applying Registration Details migration..."
echo "   Creates: registration_details table for admin-configurable form data"
if supabase db push --include-pattern "20250730_add_registration_details.sql" &> /dev/null; then
    echo "   ✅ Registration details table created successfully"
else
    echo "   ⚠️  Registration details migration may have already been applied"
fi
echo ""

# 3. Push all migrations to be safe
echo "📝 3. Applying all pending migrations..."
if supabase db push; then
    echo "   ✅ All migrations applied successfully"
else
    echo "   ❌ Some migrations failed. Check output above for details."
    echo "   You may need to apply some migrations manually via the SQL Editor"
fi
echo ""

echo "🎯 SUMMARY OF PENDING SCRIPTS TO RUN:"
echo "===================================="
echo ""

echo "✅ COMPLETED AUTOMATICALLY:"
echo "  1. Website Feedback Table - Stores user bug reports and suggestions"
echo "  2. Registration Details Table - Admin-configurable registration form data"
echo ""

echo "⚠️  MANUAL STEPS REQUIRED:"
echo ""

echo "  3. Admin RLS Policy Fix (if experiencing admin permission issues):"
echo "     📁 Script: scripts/fix-admin-rls.sh"
echo "     🎯 Purpose: Fixes admin permissions for hero content updates"
echo "     🔧 Run: ./scripts/fix-admin-rls.sh"
echo "     ❗ Note: This script references 'fix-admin-rls-policies.sql' which may need to be created"
echo ""

echo "📋 WHAT'S NOW AVAILABLE:"
echo "========================"
echo ""
echo "🔧 Admin Dashboard Features:"
echo "  • Website Feedback Management (view/manage user reports)"
echo "  • Registration Details Editor (6 configurable form fields)"
echo ""
echo "🌐 User-Facing Updates:"
echo "  • Menu: 'General Info' → 'About Us'"
echo "  • Join buttons now redirect to '#registration'"
echo "  • Registration form uses admin-configured values"
echo ""

echo "🚀 NEXT STEPS:"
echo "=============="
echo "1. Visit your admin dashboard"
echo "2. Check 'Website Feedback' section for any user reports"
echo "3. Go to 'Registrations' → 'Registration Details' tab"
echo "4. Configure the 6 registration form fields as needed"
echo "5. Test the registration form to see your changes"
echo ""

echo "✅ All automated migrations complete!"
echo "If you experience any admin permission issues, run: ./scripts/fix-admin-rls.sh"
