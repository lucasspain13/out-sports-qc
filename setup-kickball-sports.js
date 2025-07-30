#!/usr/bin/env node

/**
 * Setup Kickball Sports Script
 * 
 * This script ensures that:
 * 1. Summer 2025 Kickball exists and is set to Active (NOT Coming Soon)
 * 2. Fall 2025 Kickball exists and is set to Coming Soon (NOT Active)
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
    
    // First, let's see what's currently in the database
    const { data: currentSports, error: queryError } = await supabase
      .from('sports_info')
      .select('*')
      .like('name', '%Kickball');
    
    if (queryError) {
      console.error("❌ Error querying sports info:", queryError);
      return;
    }
    
    console.log("📊 Current kickball sports:", currentSports);
    
    // Define the sports we need (using new naming format: [Season] [Year] [Sport])
    const summerKickball = {
      name: 'Summer 2025 Kickball',
      title: 'Summer 2025 Kickball League',
      description: 'Join our inclusive kickball league where everyone plays, everyone matters, and everyone has fun! Experience the thrill of kickball in a welcoming, LGBTQ+ friendly community atmosphere.',
      gradient: 'orange',
      participants: 62,
      nextGame: '2025-08-03',
      features: ['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
      totalTeams: 4,
      rosterPath: '#summer-2025-kickball-teams',
      comingSoon: false,
      isActive: true,
      season: 'Summer',
      year: 2025
    };
    
    const fallKickball = {
      name: 'Fall 2025 Kickball',
      title: 'Fall 2025 Kickball League',
      description: 'Get ready for fall kickball fun! Join our inclusive community for another amazing season of kickball in a welcoming, LGBTQ+ friendly environment.',
      gradient: 'orange',
      participants: 0, // No participants yet since it's coming soon
      nextGame: null,
      features: ['All skill levels welcome', 'Equipment provided', 'Weekend games', 'LGBTQ+ friendly environment'],
      totalTeams: 0, // No teams yet since it's coming soon
      rosterPath: '#fall-2025-kickball-registration',
      comingSoon: true,
      isActive: false,
      season: 'Fall',
      year: 2025
    };
    
    // Find existing records by the new naming format
    const existingSummer = currentSports?.find(sport => 
      sport.name === 'Summer 2025 Kickball'
    );
    
    const existingFall = currentSports?.find(sport => 
      sport.name === 'Fall 2025 Kickball'
    );
    
    // Update or create Summer 2025 Kickball
    if (existingSummer) {
      console.log("📝 Updating existing Summer 2025 Kickball...");
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({
          ...summerKickball,
          features: JSON.stringify(summerKickball.features)
        })
        .eq('id', existingSummer.id);
      
      if (updateError) {
        console.error("❌ Error updating Summer 2025 Kickball:", updateError);
      } else {
        console.log("✅ Successfully updated Summer 2025 Kickball as Active");
      }
    } else {
      console.log("📝 Creating new Summer 2025 Kickball...");
      const { error: createError } = await supabase
        .from('sports_info')
        .insert({
          ...summerKickball,
          features: JSON.stringify(summerKickball.features)
        });
      
      if (createError) {
        console.error("❌ Error creating Summer 2025 Kickball:", createError);
      } else {
        console.log("✅ Successfully created Summer 2025 Kickball as Active");
      }
    }
    
    // Update or create Fall 2025 Kickball
    if (existingFall) {
      console.log("📝 Updating existing Fall 2025 Kickball...");
      const { error: updateError } = await supabase
        .from('sports_info')
        .update({
          ...fallKickball,
          features: JSON.stringify(fallKickball.features)
        })
        .eq('id', existingFall.id);
      
      if (updateError) {
        console.error("❌ Error updating Fall 2025 Kickball:", updateError);
      } else {
        console.log("✅ Successfully updated Fall 2025 Kickball as Coming Soon");
      }
    } else {
      console.log("📝 Creating new Fall 2025 Kickball...");
      const { error: createError } = await supabase
        .from('sports_info')
        .insert({
          ...fallKickball,
          features: JSON.stringify(fallKickball.features)
        });
      
      if (createError) {
        console.error("❌ Error creating Fall 2025 Kickball:", createError);
      } else {
        console.log("✅ Successfully created Fall 2025 Kickball as Coming Soon");
      }
    }
    
    // Verify the final state
    console.log("\n🔍 Verifying final state...");
    const { data: finalSports, error: finalError } = await supabase
      .from('sports_info')
      .select('*')
      .like('name', '%Kickball')
      .order('year', { ascending: true });
    
    if (finalError) {
      console.error("❌ Error verifying final state:", finalError);
      return;
    }
    
    console.log("\n📊 Final Kickball Sports State:");
    finalSports?.forEach(sport => {
      console.log(`- ${sport.name}: ${sport.isActive ? 'Active' : (sport.comingSoon ? 'Coming Soon' : 'Inactive')}`);
      console.log(`  Title: ${sport.title}`);
      console.log(`  Roster Path: ${sport.rosterPath}`);
      console.log(`  Status: ${sport.isActive ? '🟢 Active' : (sport.comingSoon ? '🟡 Coming Soon' : '🔴 Inactive')}`);
      console.log("");
    });
    
    console.log("🎯 Route Configuration:");
    console.log("Summer 2025 Kickball (Active) routes:");
    console.log("  - #summer-2025-kickball-schedule (Schedule page)");
    console.log("  - #summer-2025-kickball-teams (Teams page)");
    console.log("");
    console.log("Fall 2025 Kickball (Coming Soon) routes:");
    console.log("  - #fall-2025-kickball-registration (Registration page)");
    console.log("");
    console.log("✅ Kickball sports setup complete!");
    
  } catch (error) {
    console.error("❌ Script error:", error);
  }
}

// Run the setup
setupKickballSports();
