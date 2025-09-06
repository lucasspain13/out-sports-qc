#!/usr/bin/env node

/**
 * Setup Kickball Sports Script
 * 
 * This script ensures that:
 * 1. Fall 2025 Kickball exists and is set to Active (NOT Coming Soon)
 * 2. Winter 2026 Kickball exists and is set to Coming Soon (NOT Active)
 * 3. Creates appropriate routes for each sport based on their status
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

async function setupKickballSports() {
  try {
    console.log("🏈 Setting up Kickball Sports...");
    
    // First, let's see what columns exist in the sports_info table
    const { data: tableInfo, error: schemaError } = await supabase
      .from('sports_info')
      .select('*')
      .limit(1);
    
    if (schemaError) {
      console.error("❌ Error querying table schema:", schemaError);
      return;
    }
    
    console.log("📋 Table columns available:", tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : "Table is empty, showing first insert to discover schema");
    
    // Let's also see what's currently in the database
    const { data: currentSports, error: queryError } = await supabase
      .from('sports_info')
      .select('*');
    
    if (queryError) {
      console.error("❌ Error querying sports info:", queryError);
      return;
    }
    
    console.log("📊 Current sports in database:", currentSports);
    
    // Define the sports we need - only fields that exist in the database
    const fallKickball = {
      name: 'Fall 2025 Kickball',
      description: 'Join our inclusive kickball league where everyone plays, everyone matters, and everyone has fun! Experience the thrill of kickball in a welcoming, LGBTQ+ friendly community atmosphere.',
      gradient: 'red',
      participants: 62,
      next_game: '2025-09-22',
      features: ['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
      total_teams: 4,
      coming_soon: false,
      is_active: true
    };
    
    const winterKickball = {
      name: 'Winter 2026 Kickball',
      description: 'Get ready for winter kickball fun! Join our inclusive community for another amazing season of kickball in a welcoming, LGBTQ+ friendly environment.',
      gradient: 'brown',
      participants: 0, // No participants yet since it's coming soon
      next_game: null,
      features: ['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
      total_teams: 0, // No teams yet since it's coming soon
      coming_soon: true,
      is_active: false
    };
    
    // Find existing records based on name
    const existingFall = currentSports?.find(sport => 
      sport.name.includes('Fall 2025 Kickball')
    );
    
    const existingWinter = currentSports?.find(sport => 
      sport.name.includes('Winter 2026 Kickball')
    );
    
    // Update or create Fall 2025 Kickball
    if (existingFall) {
      console.log("📝 Updating existing Fall 2025 Kickball...");
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({
          ...fallKickball
        })
        .eq('id', existingFall.id);
      
      if (updateError) {
        console.error("❌ Error updating Fall 2025 Kickball:", updateError);
      } else {
        console.log("✅ Successfully updated Fall 2025 Kickball as Active");
      }
    } else {
      console.log("📝 Creating new Fall 2025 Kickball...");
      const { error: createError } = await supabase
        .from('sports_info')
        .insert({
          ...fallKickball
        });
      
      if (createError) {
        console.error("❌ Error creating Fall 2025 Kickball:", createError);
      } else {
        console.log("✅ Successfully created Fall 2025 Kickball as Active");
      }
    }
    
    // Update or create Winter 2026 Kickball
    if (existingWinter) {
      console.log("📝 Updating existing Winter 2026 Kickball...");
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({
          ...winterKickball
        })
        .eq('id', existingWinter.id);
      
      if (updateError) {
        console.error("❌ Error updating Winter 2026 Kickball:", updateError);
      } else {
        console.log("✅ Successfully updated Winter 2026 Kickball as Coming Soon");
      }
    } else {
      console.log("📝 Creating new Winter 2026 Kickball...");
      const { error: createError } = await supabase
        .from('sports_info')
        .insert({
          ...winterKickball
        });
      
      if (createError) {
        console.error("❌ Error creating Winter 2026 Kickball:", createError);
      } else {
        console.log("✅ Successfully created Winter 2026 Kickball as Coming Soon");
      }
    }
    
    // Verify the final state
    console.log("\n🔍 Verifying final state...");
    const { data: finalSports, error: finalError } = await supabase
      .from('sports_info')
      .select('*')
      .or('name.eq.Fall 2025 Kickball,name.eq.Winter 2026 Kickball')
      .order('name');
    
    if (finalError) {
      console.error("❌ Error verifying final state:", finalError);
      return;
    }
    
    console.log("\n📊 Final Kickball Sports State:");
    finalSports?.forEach(sport => {
      // Parse the name to get season, year, sport
      const nameParts = sport.name.split(' ');
      const season = nameParts[0]; // Summer/Fall
      const year = nameParts[1]; // 2025
      const sportName = nameParts.slice(2).join(' '); // Kickball
      
      console.log(`- ${sport.name}: ${sport.coming_soon ? 'Coming Soon' : (sport.is_active ? 'Active' : 'Inactive')}`);
      console.log(`  Description: ${sport.description}`);
      console.log(`  Participants: ${sport.participants}`);
      console.log(`  Status: ${sport.coming_soon ? '� Coming Soon' : (sport.is_active ? '� Active' : '🔴 Inactive')}`);
      console.log("");
    });
    
    console.log("🎯 Route Configuration:");
    finalSports?.forEach(sport => {
      // Parse the name to get season, year, sport
      const nameParts = sport.name.split(' ');
      const season = nameParts[0]; // Summer/Fall
      const year = nameParts[1]; // 2025
      const sportName = nameParts.slice(2).join(' '); // Kickball
      
      if (!sport.coming_soon && sport.is_active) {
        console.log(`${sport.name} (Active) menu items in ${sportName} dropdown:`);
        console.log(`  - "${season} ${year} Schedule" linking to #schedule`);
        console.log(`  - "${season} ${year} Teams" linking to #teams`);
      } else if (sport.coming_soon) {
        console.log(`${sport.name} (Coming Soon) menu item in ${sportName} dropdown:`);
        console.log(`  - "${season} ${year} Registration" linking to #registration`);
      }
      console.log("");
    });
    console.log("✅ Kickball sports setup complete!");
    
  } catch (error) {
    console.error("❌ Script error:", error);
  }
}

// Run the setup
setupKickballSports();
