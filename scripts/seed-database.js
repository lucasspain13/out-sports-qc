#!/usr/bin/env node

/**
 * Data Migration Script
 *
 * This script transfers data from static files to the Supabase database.
 * It handles teams, players, games, locations, and schedules.
 *
 * Usage:
 * npm run seed-database
 * or
 * node scripts/seed-database.js
 */

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const fs = require("fs");

// Import static data (you'll need to adjust paths based on your file structure)
const {
  kickballTeams,
  dodgeballTeams,
  allTeams,
} = require("../src/data/teams");
const { gameLocations } = require("../src/data/locations");
const {
  kickballSchedule,
  dodgeballSchedule,
} = require("../src/data/schedules");

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!supabaseServiceKey && !supabaseAnonKey)) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Required:");
  console.log("- VITE_SUPABASE_URL");
  console.log(
    "- SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

// Create Supabase client with service role key if available
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function clearExistingData() {
  console.log("🗑️  Clearing existing data...");

  try {
    // Clear in dependency order
    await supabase
      .from("games")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("players")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("teams")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("locations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    console.log("✅ Existing data cleared");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

async function seedLocations() {
  console.log("📍 Seeding locations...");

  try {
    const locationData = gameLocations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      city: "Austin", // Default city
      state: "TX", // Default state
      zip_code: "78701", // Default zip
      latitude: location.coordinates?.lat || 30.2672, // Austin default
      longitude: location.coordinates?.lng || -97.7431,
      facilities: location.facilities || [],
      field_type: location.fieldType || "grass",
      capacity: location.capacity,
      parking: location.parking || true,
      restrooms: location.restrooms || true,
      concessions: location.concessions || false,
    }));

    const { error } = await supabase.from("locations").insert(locationData);

    if (error) throw error;

    console.log(`✅ Seeded ${locationData.length} locations`);
  } catch (error) {
    console.error("❌ Error seeding locations:", error);
    throw error;
  }
}

async function seedTeams() {
  console.log("🏀 Seeding teams...");

  try {
    const teamData = allTeams.map(team => ({
      id: team.id,
      name: team.name,
      sport: team.sportType,
      description: team.description,
      gradient: team.gradient,
      captain_id: team.captain,
      founded: team.founded,
      wins: team.wins,
      losses: team.losses,
      motto: team.motto,
    }));

    const { error } = await supabase.from("teams").insert(teamData);

    if (error) throw error;

    console.log(`✅ Seeded ${teamData.length} teams`);
  } catch (error) {
    console.error("❌ Error seeding teams:", error);
    throw error;
  }
}

async function seedPlayers() {
  console.log("👥 Seeding players...");

  try {
    const allPlayers = [];

    // Extract players from all teams
    allTeams.forEach(team => {
      team.players.forEach(player => {
        allPlayers.push({
          id: player.id,
          team_id: player.teamId,
          name: player.name,
          jersey_number: player.jerseyNumber,
          quote: player.quote,
          photo_url: player.avatar,
          sport_type: player.sportType,
        });
      });
    });

    // Insert in batches to avoid size limits
    const batchSize = 100;
    for (let i = 0; i < allPlayers.length; i += batchSize) {
      const batch = allPlayers.slice(i, i + batchSize);

      const { error } = await supabase.from("players").insert(batch);

      if (error) throw error;
    }

    console.log(`✅ Seeded ${allPlayers.length} players`);
  } catch (error) {
    console.error("❌ Error seeding players:", error);
    throw error;
  }
}

async function seedGames() {
  console.log("🎮 Seeding games...");

  try {
    const allGames = [];

    // Process kickball schedule
    kickballSchedule.weeks.forEach(week => {
      week.games.forEach(game => {
        allGames.push({
          id: game.id,
          home_team_id: game.homeTeam.id,
          away_team_id: game.awayTeam.id,
          location_id: game.location.id,
          scheduled_at: game.date.toISOString(),
          game_time: game.time,
          status: game.status,
          home_score: game.scores?.homeScore || null,
          away_score: game.scores?.awayScore || null,
          sport_type: game.sportType,
          week_number: game.week,
          season: game.season,
        });
      });
    });

    // Process dodgeball schedule
    dodgeballSchedule.weeks.forEach(week => {
      week.games.forEach(game => {
        allGames.push({
          id: game.id,
          home_team_id: game.homeTeam.id,
          away_team_id: game.awayTeam.id,
          location_id: game.location.id,
          scheduled_at: game.date.toISOString(),
          game_time: game.time,
          status: game.status,
          home_score: game.scores?.homeScore || null,
          away_score: game.scores?.awayScore || null,
          sport_type: game.sportType,
          week_number: game.week,
          season: game.season,
        });
      });
    });

    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < allGames.length; i += batchSize) {
      const batch = allGames.slice(i, i + batchSize);

      const { error } = await supabase.from("games").insert(batch);

      if (error) throw error;
    }

    console.log(`✅ Seeded ${allGames.length} games`);
  } catch (error) {
    console.error("❌ Error seeding games:", error);
    throw error;
  }
}

async function verifyData() {
  console.log("🔍 Verifying seeded data...");

  try {
    const [
      { count: teamsCount },
      { count: playersCount },
      { count: gamesCount },
      { count: locationsCount },
    ] = await Promise.all([
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("players").select("*", { count: "exact", head: true }),
      supabase.from("games").select("*", { count: "exact", head: true }),
      supabase.from("locations").select("*", { count: "exact", head: true }),
    ]);

    console.log("📊 Data verification:");
    console.log(`   Teams: ${teamsCount}`);
    console.log(`   Players: ${playersCount}`);
    console.log(`   Games: ${gamesCount}`);
    console.log(`   Locations: ${locationsCount}`);

    return {
      teams: teamsCount,
      players: playersCount,
      games: gamesCount,
      locations: locationsCount,
    };
  } catch (error) {
    console.error("❌ Error verifying data:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting data migration...\n");

  try {
    // Optional: Clear existing data first
    const shouldClear = process.argv.includes("--clear");
    if (shouldClear) {
      await clearExistingData();
    }

    // Seed data in dependency order
    await seedLocations();
    await seedTeams();
    await seedPlayers();
    await seedGames();

    // Verify the migration
    const counts = await verifyData();

    console.log("\n🎉 Data migration completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Update your components to use the database hooks");
    console.log("2. Test the application to ensure data loads correctly");
    console.log("3. Remove static data files if no longer needed");
  } catch (error) {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  main();
}

module.exports = {
  clearExistingData,
  seedLocations,
  seedTeams,
  seedPlayers,
  seedGames,
  verifyData,
};
