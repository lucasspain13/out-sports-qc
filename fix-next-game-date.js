#!/usr/bin/env node

/**
 * Fix Next Game Date Script
 * 
 * This script updates the next game date to August 3, 2025 for kickball
 */

const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Required:");
  console.log("- VITE_SUPABASE_URL");
  console.log("- SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

async function fixNextGameDate() {
  try {
    console.log("🔍 Checking current sports info...");
    
    // First, let's see what's currently in the database
    const { data: currentSports, error: queryError } = await supabase
      .from('sports_info')
      .select('*');
    
    if (queryError) {
      console.error("❌ Error querying sports info:", queryError);
      return;
    }
    
    console.log("📊 Current sports info:", currentSports);
    
    // Find kickball sport
    const kickballSport = currentSports?.find(sport => 
      sport.name === 'kickball' || sport.title?.toLowerCase().includes('kickball')
    );
    
    if (kickballSport) {
      console.log("🏈 Found kickball sport:", kickballSport);
      console.log("📅 Current nextGame value:", kickballSport.nextGame);
      
      // Update the next game date to August 3, 2025
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({ 
          nextGame: '2025-08-03'
        })
        .eq('id', kickballSport.id);
      
      if (updateError) {
        console.error("❌ Error updating next game date:", updateError);
      } else {
        console.log("✅ Successfully updated next game date to August 3, 2025");
      }
    } else {
      console.log("ℹ️ No kickball sport found in database. This is normal if using static data.");
      
      // Let's also check if the table exists
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'sports_info');
      
      if (tableError) {
        console.log("ℹ️ sports_info table may not exist - using static data fallback");
      } else {
        console.log("📋 sports_info table exists but no kickball data found");
      }
    }
    
  } catch (error) {
    console.error("❌ Script error:", error);
  }
}

// Run the script
fixNextGameDate().then(() => {
  console.log("🏁 Script completed");
  process.exit(0);
});
