#!/bin/bash

# Setup script for registration details feature
# Run this script after ensuring Supabase is properly linked

echo "Setting up registration details feature..."

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Run the migration
echo "📝 Creating registration_details table..."
npx supabase db push

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo "✅ Registration details table created successfully!"
    echo ""
    echo "📋 What's been updated:"
    echo "1. ✅ Menu title changed from 'General Info' to 'About Us'"
    echo "2. ✅ Join buttons now redirect to '#registration'"
    echo "3. ✅ All '#fall-kickball-registration' changed to '#registration'"
    echo "4. ✅ Admin dashboard now has Registration Details tab"
    echo "5. ✅ Registration form now uses database values for info boxes"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Visit the admin dashboard"
    echo "2. Go to 'Registrations' section"
    echo "3. Click on 'Registration Details' tab"
    echo "4. Update the 6 text boxes as needed"
    echo "5. Registration form will automatically use these values"
else
    echo "❌ Migration failed. Please check your Supabase configuration."
    echo "Make sure you've run: supabase link --project-ref YOUR_PROJECT_REF"
fi
