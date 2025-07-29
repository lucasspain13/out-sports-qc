#!/usr/bin/env node

/**
 * Update Locations Script
 * 
 * This script clears all existing locations from the database and 
 * re-seeds it with only the current locations from the local file.
 */

const { createClient } = require("@supabase/supabase-js");
const { gameLocations } = require("../src/data/locations");

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

async function updateLocations() {
  console.log("🗑️  Clearing existing locations...");
  
  try {
    // Delete all existing locations
    const { error: deleteError } = await supabase
      .from("locations")
      .delete()
      .neq('id', 'this-will-never-match'); // Delete all rows

    if (deleteError) throw deleteError;
    console.log("✅ Cleared existing locations");

    console.log("📍 Adding new locations...");
    
    // Insert updated locations
    const locationData = gameLocations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zip_code: location.zipCode,
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
      facilities: location.facilities || [],
      field_type: location.fieldType || "grass",
      parking: location.parking || true,
      restrooms: location.restrooms || true,
      water_fountains: location.waterFountains || true,
      marker_color: location.markerColor || null,
    }));

    const { error: insertError } = await supabase
      .from("locations")
      .insert(locationData);

    if (insertError) throw insertError;

    console.log(`✅ Added ${locationData.length} locations:`);
    locationData.forEach(loc => {
      console.log(`   - ${loc.name} (${loc.marker_color || 'default'} marker)`);
    });
    
  } catch (error) {
    console.error("❌ Error updating locations:", error);
    process.exit(1);
  }
}

// Run the update
updateLocations()
  .then(() => {
    console.log("🎉 Location update complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Update failed:", error);
    process.exit(1);
  });
