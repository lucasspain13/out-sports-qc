/**
 * FORCE DELETE ALL DODGEBALL TEAMS AND PLAYERS - Browser Console Version
 *
 * This version works by accessing the supabase client from the React app
 * Run this in the browser console while on the admin dashboard
 *
 * ⚠️ WARNING: This will permanently delete ALL dodgeball data!
 *
 * Instructions:
 * 1. Go to localhost:3001/#sports-admin (make sure you're logged in as admin)
 * 2. Open browser console (F12 → Console tab)
 * 3. Copy and paste this entire script
 * 4. Press Enter and follow the prompts
 */

async function forceDeleteAllDodgeballDataBrowser() {
  console.log("🚨 FORCE DELETE: Starting complete dodgeball data removal...");
  console.log("⚠️ This will delete ALL dodgeball teams, players, and games!");

  try {
    // Try to find the supabase client in the React app
    let supabase = null;

    // Method 1: Look for it in window/global scope
    if (window.supabase) {
      supabase = window.supabase;
      console.log("✅ Found supabase in window scope");
    }
    // Method 2: Try to find it in React DevTools or fiber
    else if (window.React) {
      console.log("🔍 React detected, searching for supabase instance...");

      // Look for React root and try to find supabase in the context
      const reactRoot = document.querySelector("#root");
      if (reactRoot && reactRoot._reactInternalFiber) {
        console.log("Found React fiber, searching...");
        // This is complex and might not work reliably
      }

      // Try to access it from module resolution if available
      try {
        if (window.__modules && window.__modules["./lib/supabase"]) {
          supabase = window.__modules["./lib/supabase"].supabase;
          console.log("✅ Found supabase in module cache");
        }
      } catch (e) {
        console.log("Module access failed:", e.message);
      }
    }

    // Method 3: Manual injection - user needs to run this first
    if (!supabase) {
      console.error("❌ Could not find supabase client automatically");
      console.log("🔧 SOLUTION: Run this command first to expose supabase:");
      console.log(`
// Copy this code block and run it first:
(async function() {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    // You need to replace these with your actual values from .env
    const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
    
    window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client created and available as window.supabase');
    console.log('Now you can run the deletion script!');
  } catch (error) {
    console.error('Failed to create supabase client:', error);
  }
})();
      `);

      alert(
        "Could not find supabase client. Check the console for instructions on how to set it up manually, or use the SQL approach instead."
      );
      return;
    }

    // Now proceed with deletion using the found supabase client
    console.log("🎯 Supabase client found, proceeding with deletion...");

    let results = {
      games: { deleted: 0, errors: [] },
      players: { deleted: 0, errors: [] },
      teams: { deleted: 0, errors: [] },
    };

    // Step 1: Delete all dodgeball games first
    console.log("1️⃣ Deleting all dodgeball games...");
    try {
      const { data: games, error: gamesError } = await supabase
        .from("games")
        .delete()
        .eq("sport_type", "dodgeball");

      if (gamesError) {
        console.warn("⚠️ Games deletion failed:", gamesError);
        results.games.errors.push(gamesError.message);
      } else {
        results.games.deleted = games ? games.length : 0;
        console.log(`✅ Deleted ${results.games.deleted} dodgeball games`);
      }
    } catch (error) {
      console.warn("⚠️ Games deletion error:", error);
      results.games.errors.push(error.message);
    }

    // Step 2: Get dodgeball teams for reference
    console.log("2️⃣ Getting dodgeball teams...");
    const { data: teamsToDelete, error: teamsQueryError } = await supabase
      .from("teams")
      .select("id, name")
      .eq("sport", "dodgeball");

    if (teamsQueryError) {
      console.warn("⚠️ Could not query teams:", teamsQueryError);
    } else {
      console.log(
        `Found ${teamsToDelete?.length || 0} dodgeball teams to delete`
      );
    }

    // Step 3: Delete all dodgeball players
    console.log("3️⃣ Deleting all dodgeball players...");
    try {
      // Try by sport_type first
      const { data: players, error: playersError } = await supabase
        .from("players")
        .delete()
        .eq("sport_type", "dodgeball");

      if (playersError) {
        console.warn(
          "⚠️ Players deletion by sport failed, trying by teams:",
          playersError
        );
        results.players.errors.push(playersError.message);

        // Try deleting by team association
        if (teamsToDelete && teamsToDelete.length > 0) {
          for (const team of teamsToDelete) {
            const { data: teamPlayers, error: teamPlayersError } =
              await supabase.from("players").delete().eq("team_id", team.id);

            if (teamPlayersError) {
              console.warn(
                `⚠️ Failed to delete players for team ${team.name}:`,
                teamPlayersError
              );
              results.players.errors.push(
                `Team ${team.name}: ${teamPlayersError.message}`
              );
            } else {
              const deletedCount = teamPlayers ? teamPlayers.length : 0;
              results.players.deleted += deletedCount;
              console.log(
                `✅ Deleted ${deletedCount} players from team ${team.name}`
              );
            }
          }
        }
      } else {
        results.players.deleted = players ? players.length : 0;
        console.log(`✅ Deleted ${results.players.deleted} dodgeball players`);
      }
    } catch (error) {
      console.warn("⚠️ Players deletion error:", error);
      results.players.errors.push(error.message);
    }

    // Step 4: Delete all dodgeball teams
    console.log("4️⃣ Deleting all dodgeball teams...");
    try {
      const { data: teams, error: teamsError } = await supabase
        .from("teams")
        .delete()
        .eq("sport", "dodgeball");

      if (teamsError) {
        console.warn(
          "⚠️ Teams bulk deletion failed, trying individual:",
          teamsError
        );
        results.teams.errors.push(teamsError.message);

        // Try individual team deletion
        if (teamsToDelete && teamsToDelete.length > 0) {
          for (const team of teamsToDelete) {
            const { error: singleTeamError } = await supabase
              .from("teams")
              .delete()
              .eq("id", team.id);

            if (singleTeamError) {
              console.warn(
                `⚠️ Failed to delete team ${team.name}:`,
                singleTeamError
              );
              results.teams.errors.push(
                `${team.name}: ${singleTeamError.message}`
              );
            } else {
              results.teams.deleted += 1;
              console.log(`✅ Deleted team ${team.name}`);
            }
          }
        }
      } else {
        results.teams.deleted = teams ? teams.length : 0;
        console.log(`✅ Deleted ${results.teams.deleted} dodgeball teams`);
      }
    } catch (error) {
      console.warn("⚠️ Teams deletion error:", error);
      results.teams.errors.push(error.message);
    }

    // Step 5: Verification
    console.log("5️⃣ Verifying deletion...");
    const [
      { data: remainingGames },
      { data: remainingPlayers },
      { data: remainingTeams },
    ] = await Promise.all([
      supabase.from("games").select("id").eq("sport_type", "dodgeball"),
      supabase.from("players").select("id").eq("sport_type", "dodgeball"),
      supabase.from("teams").select("id").eq("sport", "dodgeball"),
    ]);

    const remaining = {
      games: remainingGames?.length || 0,
      players: remainingPlayers?.length || 0,
      teams: remainingTeams?.length || 0,
    };

    // Final report
    console.log("\n🎯 DELETION SUMMARY:");
    console.log("===================");
    console.log(`✅ Games deleted: ${results.games.deleted}`);
    console.log(`✅ Players deleted: ${results.players.deleted}`);
    console.log(`✅ Teams deleted: ${results.teams.deleted}`);

    console.log("\n📊 REMAINING RECORDS:");
    console.log(`Games: ${remaining.games}`);
    console.log(`Players: ${remaining.players}`);
    console.log(`Teams: ${remaining.teams}`);

    if (
      results.games.errors.length > 0 ||
      results.players.errors.length > 0 ||
      results.teams.errors.length > 0
    ) {
      console.log("\n⚠️ ERRORS ENCOUNTERED:");
      if (results.games.errors.length > 0)
        console.log("Games:", results.games.errors);
      if (results.players.errors.length > 0)
        console.log("Players:", results.players.errors);
      if (results.teams.errors.length > 0)
        console.log("Teams:", results.teams.errors);
    }

    if (
      remaining.games === 0 &&
      remaining.players === 0 &&
      remaining.teams === 0
    ) {
      console.log("\n🎉 SUCCESS: All dodgeball data completely removed!");
      console.log("✅ You can now start fresh with dodgeball teams");
    } else {
      console.log("\n⚠️ PARTIAL SUCCESS: Some records may still exist");
      console.log("💡 Try refreshing the admin dashboard to see current state");
      console.log(
        "🔧 If issues persist, use the SQL approach in Supabase dashboard"
      );
    }
  } catch (error) {
    console.error("\n❌ CRITICAL ERROR during deletion:", error);
    console.log(
      "💡 Alternative approach: Use the SQL script in Supabase dashboard"
    );
    console.log("File: scripts/force-delete-dodgeball.sql");
  }
}

// Confirmation prompts
console.log("🚨 DODGEBALL DATA DELETION SCRIPT LOADED");
console.log(
  "This will permanently delete ALL dodgeball teams, players, and games!"
);

const confirmed = confirm(
  "⚠️ DANGER: This will permanently delete ALL dodgeball data!\n\n" +
    "• All dodgeball teams will be deleted\n" +
    "• All dodgeball players will be deleted\n" +
    "• All dodgeball games will be deleted\n\n" +
    "This action cannot be undone.\n\n" +
    "Are you absolutely sure you want to continue?"
);

if (confirmed) {
  const finalCheck = prompt(
    "🚨 FINAL CONFIRMATION\n\n" +
      "Type exactly: DELETE ALL DODGEBALL\n\n" +
      "(This confirms you understand this will permanently delete all dodgeball data)"
  );

  if (finalCheck === "DELETE ALL DODGEBALL") {
    console.log("🎯 Confirmation received, starting deletion...");
    forceDeleteAllDodgeballDataBrowser();
  } else {
    console.log(
      "❌ Confirmation text didn't match. Deletion cancelled for safety."
    );
  }
} else {
  console.log("❌ Deletion cancelled by user.");
}
