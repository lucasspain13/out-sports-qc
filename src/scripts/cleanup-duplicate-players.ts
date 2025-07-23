/**
 * Admin Script: Clean up players that are actually teams
 *
 * This script identifies and removes player records that appear to be
 * duplicate team entries in the players table.
 *
 * Usage: Run this in the browser console while on the admin dashboard
 * or integrate it into the admin interface.
 */

import { supabase } from "../lib/supabase";

interface CleanupResult {
  playersFound: any[];
  playersDeleted: string[];
  errors: string[];
  summary: string;
}

export class PlayerTeamCleanup {
  /**
   * Find players that might actually be teams
   */
  static async findSuspiciousPlayers(): Promise<any[]> {
    console.log("🔍 Searching for players that might be teams...");

    // Get all players and teams
    const [playersResult, teamsResult] = await Promise.all([
      supabase.from("players").select("*"),
      supabase.from("teams").select("*"),
    ]);

    if (playersResult.error || teamsResult.error) {
      throw new Error(
        `Database error: ${playersResult.error || teamsResult.error}`
      );
    }

    const players = playersResult.data || [];
    const teams = teamsResult.data || [];

    console.log(`📊 Found ${players.length} players and ${teams.length} teams`);

    const suspicious: any[] = [];

    // Check for exact name matches
    for (const player of players) {
      for (const team of teams) {
        if (player.name.toLowerCase() === team.name.toLowerCase()) {
          suspicious.push({
            ...player,
            reason: "EXACT_TEAM_NAME_MATCH",
            matchingTeam: team,
            confidence: "HIGH",
          });
        }
      }
    }

    // Check for partial name matches
    for (const player of players) {
      for (const team of teams) {
        const playerName = player.name.toLowerCase();
        const teamName = team.name.toLowerCase();

        if (
          playerName !== teamName &&
          (playerName.includes(teamName) || teamName.includes(playerName))
        ) {
          // Avoid duplicates
          if (!suspicious.find(s => s.id === player.id)) {
            suspicious.push({
              ...player,
              reason: "PARTIAL_TEAM_NAME_MATCH",
              matchingTeam: team,
              confidence: "MEDIUM",
            });
          }
        }
      }
    }

    // Check for suspicious attributes
    for (const player of players) {
      if (!suspicious.find(s => s.id === player.id)) {
        let suspiciousReasons = [];

        if (player.jersey_number === 0) {
          suspiciousReasons.push("jersey_number_zero");
        }

        if (!player.quote || player.quote.trim().length === 0) {
          suspiciousReasons.push("no_quote");
        }

        if (player.quote && player.quote.trim().length < 10) {
          suspiciousReasons.push("very_short_quote");
        }

        // If the player name looks like a team name (contains common team words)
        const teamWords = [
          "team",
          "squad",
          "crew",
          "united",
          "fc",
          "club",
          "dynasty",
          "runners",
          "kickers",
          "lightning",
          "thunder",
          "tornadoes",
          "panthers",
          "warriors",
        ];
        const nameWords = player.name.toLowerCase().split(" ");
        const hasTeamWords = nameWords.some((word: string) =>
          teamWords.includes(word)
        );

        if (hasTeamWords) {
          suspiciousReasons.push("team_like_name");
        }

        if (suspiciousReasons.length >= 2) {
          suspicious.push({
            ...player,
            reason: "SUSPICIOUS_ATTRIBUTES",
            suspiciousReasons,
            confidence: "LOW",
          });
        }
      }
    }

    console.log(`⚠️  Found ${suspicious.length} suspicious players`);
    return suspicious.sort((a: any, b: any) => {
      const confidenceOrder: Record<string, number> = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
      };
      return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    });
  }

  /**
   * Display suspicious players in a readable format
   */
  static displaySuspiciousPlayers(suspicious: any[]): void {
    if (suspicious.length === 0) {
      console.log("✅ No suspicious players found!");
      return;
    }

    console.log("\n🚨 SUSPICIOUS PLAYERS FOUND:");
    console.log("=".repeat(60));

    suspicious.forEach((player, index) => {
      console.log(`\n${index + 1}. ${player.name} (ID: ${player.id})`);
      console.log(`   Reason: ${player.reason}`);
      console.log(`   Confidence: ${player.confidence}`);
      console.log(`   Jersey: #${player.jersey_number}`);
      console.log(`   Quote: "${player.quote || "No quote"}"`);
      console.log(`   Team ID: ${player.team_id}`);

      if (player.matchingTeam) {
        console.log(
          `   Matches Team: "${player.matchingTeam.name}" (ID: ${player.matchingTeam.id})`
        );
      }

      if (player.suspiciousReasons) {
        console.log(`   Issues: ${player.suspiciousReasons.join(", ")}`);
      }
    });

    console.log("\n" + "=".repeat(60));
  }

  /**
   * Delete suspicious players (with confirmation)
   */
  static async deleteSuspiciousPlayers(
    playerIds: string[],
    confirm: boolean = false
  ): Promise<CleanupResult> {
    const result: CleanupResult = {
      playersFound: [],
      playersDeleted: [],
      errors: [],
      summary: "",
    };

    if (!confirm) {
      result.errors.push(
        "Deletion not confirmed. Pass confirm: true to actually delete."
      );
      return result;
    }

    if (playerIds.length === 0) {
      result.summary = "No players specified for deletion.";
      return result;
    }

    console.log(`🗑️  Attempting to delete ${playerIds.length} players...`);

    for (const playerId of playerIds) {
      try {
        const { error } = await supabase
          .from("players")
          .delete()
          .eq("id", playerId);

        if (error) {
          result.errors.push(
            `Failed to delete player ${playerId}: ${error.message}`
          );
        } else {
          result.playersDeleted.push(playerId);
          console.log(`✅ Deleted player: ${playerId}`);
        }
      } catch (err) {
        result.errors.push(`Error deleting player ${playerId}: ${err}`);
      }
    }

    result.summary = `Successfully deleted ${result.playersDeleted.length} of ${playerIds.length} players. ${result.errors.length} errors occurred.`;

    if (result.errors.length > 0) {
      console.error("❌ Errors during deletion:", result.errors);
    }

    console.log(`✨ Cleanup complete: ${result.summary}`);
    return result;
  }

  /**
   * Safe cleanup workflow - find, review, then delete
   */
  static async performSafeCleanup(
    options: {
      deleteHighConfidence?: boolean;
      deleteMediumConfidence?: boolean;
      deleteLowConfidence?: boolean;
      confirm?: boolean;
    } = {}
  ): Promise<CleanupResult> {
    console.log("🧹 Starting safe player cleanup...");

    // Step 1: Find suspicious players
    const suspicious = await this.findSuspiciousPlayers();

    // Step 2: Display findings
    this.displaySuspiciousPlayers(suspicious);

    // Step 3: Filter by confidence level for deletion
    const toDelete: string[] = [];

    if (options.deleteHighConfidence) {
      const highConfidence = suspicious.filter(p => p.confidence === "HIGH");
      toDelete.push(...highConfidence.map(p => p.id));
      console.log(
        `📌 Marked ${highConfidence.length} HIGH confidence players for deletion`
      );
    }

    if (options.deleteMediumConfidence) {
      const mediumConfidence = suspicious.filter(
        p => p.confidence === "MEDIUM"
      );
      toDelete.push(...mediumConfidence.map(p => p.id));
      console.log(
        `📌 Marked ${mediumConfidence.length} MEDIUM confidence players for deletion`
      );
    }

    if (options.deleteLowConfidence) {
      const lowConfidence = suspicious.filter(p => p.confidence === "LOW");
      toDelete.push(...lowConfidence.map(p => p.id));
      console.log(
        `📌 Marked ${lowConfidence.length} LOW confidence players for deletion`
      );
    }

    // Step 4: Delete if confirmed
    if (toDelete.length > 0 && options.confirm) {
      return await this.deleteSuspiciousPlayers(toDelete, true);
    }

    return {
      playersFound: suspicious,
      playersDeleted: [],
      errors:
        toDelete.length > 0 && !options.confirm
          ? ["Deletion not confirmed"]
          : [],
      summary: `Found ${suspicious.length} suspicious players. ${toDelete.length} marked for deletion but not confirmed.`,
    };
  }
}

// Example usage functions:

/**
 * Just find and display suspicious players (safe)
 */
export async function findSuspiciousPlayers() {
  return await PlayerTeamCleanup.findSuspiciousPlayers();
}

/**
 * Find suspicious players and display them in console
 */
export async function reviewSuspiciousPlayers() {
  const suspicious = await PlayerTeamCleanup.findSuspiciousPlayers();
  PlayerTeamCleanup.displaySuspiciousPlayers(suspicious);
  return suspicious;
}

/**
 * Delete only HIGH confidence matches (exact team name matches)
 */
export async function deleteHighConfidenceMatches() {
  return await PlayerTeamCleanup.performSafeCleanup({
    deleteHighConfidence: true,
    confirm: true,
  });
}

/**
 * Complete cleanup (delete HIGH and MEDIUM confidence matches)
 */
export async function performCompleteCleanup() {
  return await PlayerTeamCleanup.performSafeCleanup({
    deleteHighConfidence: true,
    deleteMediumConfidence: true,
    confirm: true,
  });
}

/**
 * Conservative cleanup (delete only exact matches)
 */
export async function performConservativeCleanup() {
  return await PlayerTeamCleanup.performSafeCleanup({
    deleteHighConfidence: true,
    confirm: true,
  });
}

// Browser console helper
if (typeof window !== "undefined") {
  // @ts-ignore
  window.cleanupPlayers = {
    find: findSuspiciousPlayers,
    review: reviewSuspiciousPlayers,
    deleteExactMatches: deleteHighConfidenceMatches,
    deleteAll: performCompleteCleanup,
    conservative: performConservativeCleanup,
    PlayerTeamCleanup,
  };

  console.log(
    "🛠️  Player cleanup tools loaded! Use window.cleanupPlayers in console:"
  );
  console.log(
    "   - window.cleanupPlayers.review() - Find and display suspicious players"
  );
  console.log(
    "   - window.cleanupPlayers.deleteExactMatches() - Delete only exact team name matches"
  );
  console.log(
    "   - window.cleanupPlayers.conservative() - Same as above (safest)"
  );
  console.log(
    "   - window.cleanupPlayers.deleteAll() - Delete high and medium confidence matches"
  );
}
