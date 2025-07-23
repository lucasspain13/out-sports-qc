import { useCallback, useEffect, useState } from "react";
import { teamsApi } from "../lib/database";
import { supabase } from "../lib/supabase";
import { Team } from "../types";

export const useTeams = (sportType?: "kickball" | "dodgeball") => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teams from database
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `🏀 useTeams: Fetching teams for ${sportType || "all sports"}...`
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 second timeout
      });

      const dataPromise = sportType
        ? teamsApi.getBySport(sportType)
        : teamsApi.getAll();

      const data = await Promise.race([dataPromise, timeoutPromise]);

      console.log(`✅ useTeams: Successfully loaded ${data.length} teams`);
      setTeams(data);
    } catch (err) {
      console.error("❌ useTeams: Error fetching teams:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load teams";
      setError(errorMessage);
      setTeams([]); // Set empty array on error to prevent stale data
    } finally {
      setLoading(false);
    }
  }, [sportType]);

  // Get team by ID
  const getTeamById = useCallback(
    (teamId: string): Team | undefined => {
      return teams.find(team => team.id === teamId);
    },
    [teams]
  );

  // Get team captain
  const getTeamCaptain = useCallback((team: Team) => {
    if (!team.captain) return undefined;
    return team.players.find(player => player.id === team.captain);
  }, []);

  // Get teams with stats
  const getTeamsWithStats = useCallback(() => {
    return teams.map(team => ({
      ...team,
      totalGames: team.wins + team.losses,
      winPercentage:
        team.wins + team.losses > 0
          ? (team.wins / (team.wins + team.losses)) * 100
          : 0,
    }));
  }, [teams]);

  // Initial load
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Real-time updates
  useEffect(() => {
    console.log("🔄 useTeams: Setting up real-time subscription...");

    const channel = supabase
      .channel("teams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: sportType ? `sport=eq.${sportType}` : undefined,
        },
        payload => {
          console.log("🔄 useTeams: Real-time update received", payload);
          fetchTeams();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: sportType ? `sport_type=eq.${sportType}` : undefined,
        },
        payload => {
          console.log("🔄 useTeams: Player update received", payload);
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      console.log("🔄 useTeams: Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [fetchTeams, sportType]);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeams,
    getTeamById,
    getTeamCaptain,
    getTeamsWithStats,
  };
};

// Hook specifically for a single team
export const useTeam = (teamId: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🏀 useTeam: Fetching team ${teamId}...`);

      const data = await teamsApi.getById(teamId);

      if (data) {
        console.log(`✅ useTeam: Successfully loaded team ${data.name}`);
        setTeam(data);
      } else {
        setError("Team not found");
        setTeam(null);
      }
    } catch (err) {
      console.error("❌ useTeam: Error fetching team:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load team";
      setError(errorMessage);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeam();
    }
  }, [fetchTeam, teamId]);

  // Real-time updates for specific team
  useEffect(() => {
    if (!teamId) return;

    console.log(
      "🔄 useTeam: Setting up real-time subscription for team",
      teamId
    );

    const channel = supabase
      .channel(`team-${teamId}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamId}`,
        },
        payload => {
          console.log("🔄 useTeam: Real-time team update received", payload);
          fetchTeam();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `team_id=eq.${teamId}`,
        },
        payload => {
          console.log("🔄 useTeam: Real-time player update received", payload);
          fetchTeam();
        }
      )
      .subscribe();

    return () => {
      console.log("🔄 useTeam: Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [fetchTeam, teamId]);

  return {
    team,
    loading,
    error,
    refetch: fetchTeam,
  };
};
