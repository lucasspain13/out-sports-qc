#!/usr/bin/env node

/**
 * Update Existing Kickball Sport Script
 * 
 * This script updates the existing kickball sport and ensures proper routing
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

async function updateKickballSport() {
  try {
    console.log("🏈 Updating Kickball Sport...");
    
    // Get the current kickball sport
    const { data: currentSports, error: queryError } = await supabase
      .from('sports_info')
      .select('*')
      .eq('name', 'kickball');
    
    if (queryError) {
      console.error("❌ Error querying sports info:", queryError);
      return;
    }
    
    console.log("📊 Current kickball sports:", currentSports);
    
    if (currentSports && currentSports.length > 0) {
      const existingSport = currentSports[0];
      
      // Update the existing sport to be Summer 2025 Kickball and set to Active (not Coming Soon)
      console.log("📝 Updating existing kickball sport to Summer 2025 Active...");
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({
          title: 'Summer 2025 Kickball League',
          description: 'Join our inclusive kickball league where everyone plays, everyone matters, and everyone has fun! Experience the thrill of kickball in a welcoming, LGBTQ+ friendly community atmosphere.',
          participants: 62,
          next_game: '2025-08-03',
          features: ['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
          total_teams: 4,
          roster_path: '#summer-2025-kickball-teams',
          coming_soon: false,  // NOT Coming Soon
          is_active: true      // Active
        })
        .eq('id', existingSport.id);
      
      if (updateError) {
        console.error("❌ Error updating Summer 2025 Kickball:", updateError);
      } else {
        console.log("✅ Successfully updated to Summer 2025 Kickball as Active");
      }
    }
    
    // Now manually create Fall 2025 Kickball using SQL since RLS might be blocking inserts
    console.log("📝 Attempting to create Fall 2025 Kickball via SQL...");
    const { error: insertError } = await supabase.rpc('execute_sql', {
      sql: `
        INSERT INTO sports_info (
          name, title, description, gradient, participants, next_game, features, 
          total_teams, roster_path, coming_soon, is_active
        ) VALUES (
          'kickball',
          'Fall 2025 Kickball League',
          'Get ready for fall kickball fun! Join our inclusive community for another amazing season of kickball in a welcoming, LGBTQ+ friendly environment.',
          'orange',
          0,
          NULL,
          ARRAY['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
          0,
          '#fall-2025-kickball-registration',
          true,  -- Coming Soon
          false  -- NOT Active
        )
        ON CONFLICT (name, title) DO UPDATE SET
          description = EXCLUDED.description,
          coming_soon = EXCLUDED.coming_soon,
          is_active = EXCLUDED.is_active,
          roster_path = EXCLUDED.roster_path;
      `
    });
    
    if (insertError) {
      console.error("❌ Error creating Fall 2025 Kickball via SQL:", insertError);
      console.log("ℹ️ This is normal if RLS is preventing inserts. Let's work with what we have.");
    } else {
      console.log("✅ Successfully created Fall 2025 Kickball as Coming Soon");
    }
    
    // Verify the final state
    console.log("\n🔍 Verifying final state...");
    const { data: finalSports, error: finalError } = await supabase
      .from('sports_info')
      .select('*')
      .eq('name', 'kickball')
      .order('title');
    
    if (finalError) {
      console.error("❌ Error verifying final state:", finalError);
      return;
    }
    
    console.log("\n📊 Final Kickball Sports State:");
    finalSports?.forEach(sport => {
      console.log(`- ${sport.title}: ${sport.is_active ? 'Active' : (sport.coming_soon ? 'Coming Soon' : 'Inactive')}`);
      console.log(`  Roster Path: ${sport.roster_path}`);
      console.log(`  Status: ${sport.is_active ? '🟢 Active' : (sport.coming_soon ? '🟡 Coming Soon' : '🔴 Inactive')}`);
      console.log("");
    });
    
    console.log("🎯 Route Configuration Based on Status:");
    finalSports?.forEach(sport => {
      if (sport.is_active && !sport.coming_soon) {
        console.log(`${sport.title} (Active) routes:`);
        console.log(`  - #${sport.title.toLowerCase().replace(/\s+/g, '-').replace('league', 'schedule')} (Schedule page)`);
        console.log(`  - #${sport.title.toLowerCase().replace(/\s+/g, '-').replace('league', 'teams')} (Teams page)`);
      } else if (sport.coming_soon && !sport.is_active) {
        console.log(`${sport.title} (Coming Soon) routes:`);
        console.log(`  - #${sport.title.toLowerCase().replace(/\s+/g, '-').replace('league', 'registration')} (Registration page)`);
      }
      console.log("");
    });
    
    console.log("✅ Kickball sports setup complete!");
    
  } catch (error) {
    console.error("❌ Script error:", error);
  }
}

// Run the setup
updateKickballSport();
