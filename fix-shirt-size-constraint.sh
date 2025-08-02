#!/bin/bash

# Fix shirt size constraint to allow 4XL
# This script applies the migration to fix the shirt_size check constraint

echo "🔧 Applying shirt size constraint fix..."

# Apply the migration
npx supabase db push

echo "✅ Shirt size constraint fix applied!"
echo "The registration form should now accept 4XL shirt sizes."
