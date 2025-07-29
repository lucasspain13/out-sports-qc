#!/usr/bin/env node

/**
 * Clear Locations Script
 * 
 * This script clears all existing locations from the database 
 * so the app will fall back to using the local file data.
 */

const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

async function clearLocations() {
  console.log("🗑️  Clearing all locations from database...");
  
  try {
    // Delete all existing locations
    const { error: deleteError } = await supabase
      .from("locations")
      .delete()
      .neq('id', 'this-will-never-match'); // Delete all rows

    if (deleteError) throw deleteError;
    console.log("✅ Cleared all locations from database");
    console.log("📍 App will now use local file data with only 2 red markers");
    
  } catch (error) {
    console.error("❌ Error clearing locations:", error);
    process.exit(1);
  }
}

// Run the clear operation
clearLocations()
  .then(() => {
    console.log("🎉 Database locations cleared successfully!");
    console.log("The app will now show only the 2 locations from the local file.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Clear operation failed:", error);
    process.exit(1);
  });
