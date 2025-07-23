/**
 * Fix the specific "Blitz Blue" player / "Blue Blitz" team duplicate issue
 *
 * Run this in the browser console on the admin dashboard:
 * 1. Go to localhost:3000/#sports-admin
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 */

async function fixBlitzBlueIssue() {
  console.log("🔍 Investigating Blitz Blue / Blue Blitz issue...");

  try {
    // Import supabase from the global context
    const { supabase } = window;
    if (!supabase) {
      throw new Error(
        "Supabase not found. Make sure you're on the admin dashboard."
      );
    }

    // Step 1: Find the problematic records
    console.log("1. Finding Blitz Blue player and Blue Blitz team...");

    const [playersResponse, teamsResponse] = await Promise.all([
      supabase.from("players").select("*").ilike("name", "%blitz%"),
      supabase.from("teams").select("*").ilike("name", "%blitz%"),
    ]);

    if (playersResponse.error) throw playersResponse.error;
    if (teamsResponse.error) throw teamsResponse.error;

    const blitzPlayers = playersResponse.data || [];
    const blitzTeams = teamsResponse.data || [];

    console.log("📊 Found Blitz-related records:");
    console.log("Players:", blitzPlayers);
    console.log("Teams:", blitzTeams);

    // Step 2: Find the specific problematic player
    const blitzBluePlayer = blitzPlayers.find(
      p =>
        p.name.toLowerCase().includes("blitz") &&
        p.name.toLowerCase().includes("blue")
    );

    const blueBlitzTeam = blitzTeams.find(
      t =>
        t.name.toLowerCase().includes("blue") &&
        t.name.toLowerCase().includes("blitz")
    );

    if (!blitzBluePlayer && !blueBlitzTeam) {
      console.log("✅ No problematic Blitz Blue / Blue Blitz records found!");
      return;
    }

    console.log("🎯 Problematic records identified:");
    if (blitzBluePlayer) console.log("Player to delete:", blitzBluePlayer);
    if (blueBlitzTeam) console.log("Team:", blueBlitzTeam);

    // Step 3: Check for foreign key relationships
    if (blitzBluePlayer) {
      console.log("3. Checking foreign key relationships for player...");

      const gameRelationsResponse = await supabase
        .from("games")
        .select("id, home_team_id, away_team_id")
        .or(
          `home_team_id.eq.${blitzBluePlayer.team_id},away_team_id.eq.${blitzBluePlayer.team_id}`
        );

      if (gameRelationsResponse.error) throw gameRelationsResponse.error;

      const relatedGames = gameRelationsResponse.data || [];
      console.log(
        `Found ${relatedGames.length} games referencing this player's team`
      );
    }

    // Step 4: Safe deletion strategy
    console.log("4. Attempting safe deletion...");

    if (blitzBluePlayer) {
      // Check if this player is actually a duplicate of the team name
      const isDuplicate =
        blueBlitzTeam &&
        blitzBluePlayer.name.toLowerCase().replace(/\s+/g, "") ===
          blueBlitzTeam.name.toLowerCase().replace(/\s+/g, "");

      if (isDuplicate) {
        console.log("🚨 CONFIRMED: Player is duplicate of team name");

        // Delete the duplicate player
        const deleteResponse = await supabase
          .from("players")
          .delete()
          .eq("id", blitzBluePlayer.id);

        if (deleteResponse.error) {
          console.error(
            "❌ Failed to delete duplicate player:",
            deleteResponse.error
          );
          throw deleteResponse.error;
        }

        console.log(
          "✅ Successfully deleted duplicate player:",
          blitzBluePlayer.name
        );
        console.log("🎉 You should now be able to manage the team normally!");
      } else {
        console.log(
          "⚠️ Player doesn't appear to be a direct duplicate. Manual review needed."
        );
      }
    }

    // Step 5: Verify cleanup
    console.log("5. Verifying cleanup...");
    const verifyResponse = await supabase
      .from("players")
      .select("*")
      .ilike("name", "%blitz%blue%");

    if (verifyResponse.error) throw verifyResponse.error;

    const remainingDuplicates = verifyResponse.data || [];
    console.log(`Remaining Blitz Blue players: ${remainingDuplicates.length}`);

    if (remainingDuplicates.length === 0) {
      console.log("🎉 SUCCESS: Blitz Blue duplicate issue resolved!");
      console.log("You can now safely delete or manage the Blue Blitz team.");
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    console.log("💡 Try the manual cleanup approach in the admin dashboard");
  }
}

// Run the cleanup
fixBlitzBlueIssue();
