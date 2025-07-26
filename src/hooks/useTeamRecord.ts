import { useMemo } from "react";
import { useGames } from "./useGames";

export interface TeamRecord {
  wins: number;
  losses: number;
  winPercentage: number;
  totalGames: number;
}

/**
 * Custom hook to calculate team wins/losses from completed games
 * Optimized with memoization to prevent unnecessary recalculations
 */
export const useTeamRecord = (teamId: string): TeamRecord => {
  const { games } = useGames();
  
  return useMemo(() => {
    let wins = 0;
    let losses = 0;

    // Filter completed games once and calculate record
    const completedGames = games.filter(game => game.status === "completed");
    
    completedGames.forEach(game => {
      if (!game.scores) return; // Skip games without scores

      const { homeScore, awayScore } = game.scores;
      
      // Check if this team was involved in the game
      if (game.homeTeam.id === teamId) {
        if (homeScore > awayScore) {
          wins++;
        } else if (homeScore < awayScore) {
          losses++;
        }
        // Ties don't count as wins or losses
      } else if (game.awayTeam.id === teamId) {
        if (awayScore > homeScore) {
          wins++;
        } else if (awayScore < homeScore) {
          losses++;
        }
        // Ties don't count as wins or losses
      }
    });

    const totalGames = wins + losses;
    const winPercentage = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    return { wins, losses, winPercentage, totalGames };
  }, [games, teamId]);
};

/**
 * Hook to get records for multiple teams at once
 * More efficient when calculating records for many teams (like in team lists)
 */
export const useMultipleTeamRecords = (teamIds: string[]): Record<string, TeamRecord> => {
  const { games } = useGames();
  
  return useMemo(() => {
    const completedGames = games.filter(game => game.status === "completed");
    const records: Record<string, TeamRecord> = {};
    
    // Initialize all team records
    teamIds.forEach(teamId => {
      records[teamId] = { wins: 0, losses: 0, winPercentage: 0, totalGames: 0 };
    });
    
    // Calculate all records in a single pass through games
    completedGames.forEach(game => {
      if (!game.scores) return;
      
      const { homeScore, awayScore } = game.scores;
      const homeTeamId = game.homeTeam.id;
      const awayTeamId = game.awayTeam.id;
      
      // Only process if these teams are in our list
      if (teamIds.includes(homeTeamId)) {
        if (homeScore > awayScore) {
          records[homeTeamId].wins++;
        } else if (homeScore < awayScore) {
          records[homeTeamId].losses++;
        }
      }
      
      if (teamIds.includes(awayTeamId)) {
        if (awayScore > homeScore) {
          records[awayTeamId].wins++;
        } else if (awayScore < homeScore) {
          records[awayTeamId].losses++;
        }
      }
    });
    
    // Calculate percentages and totals
    Object.keys(records).forEach(teamId => {
      const record = records[teamId];
      record.totalGames = record.wins + record.losses;
      record.winPercentage = record.totalGames > 0 ? Math.round((record.wins / record.totalGames) * 100) : 0;
    });
    
    return records;
  }, [games, teamIds]);
};
