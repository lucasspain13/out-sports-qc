import { useCallback, useEffect, useState } from "react";
import { gamesApi } from "../lib/database";
import { supabase } from "../lib/supabase";
import { Game, ScheduleWeek } from "../types";

export const useGames = (sportType?: "kickball" | "dodgeball") => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch games from database
  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        `🎮 useGames: Fetching games for ${sportType || "all sports"}...`
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000); // 30 second timeout
      });

      const dataPromise = sportType
        ? gamesApi.getBySport(sportType)
        : gamesApi.getAll();

      const data = await Promise.race([dataPromise, timeoutPromise]);

      console.log(`✅ useGames: Successfully loaded ${data.length} games`);
      setGames(data);
    } catch (err) {
      console.error("❌ useGames: Error fetching games:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load games";
      setError(errorMessage);
      setGames([]); // Set empty array on error to prevent stale data
    } finally {
      setLoading(false);
    }
  }, [sportType]);

  // Get upcoming games
  const getUpcomingGames = useCallback(() => {
    const now = new Date();
    return games.filter(
      game =>
        game.date >= now &&
        (game.status === "scheduled" || game.status === "in-progress")
    );
  }, [games]);

  // Get completed games
  const getCompletedGames = useCallback(() => {
    return games.filter(game => game.status === "completed");
  }, [games]);

  // Get live games
  const getLiveGames = useCallback(() => {
    return games.filter(game => game.status === "in-progress");
  }, [games]);

  // Group games into weeks
  const getScheduleWeeks = useCallback((): ScheduleWeek[] => {
    const weekMap = new Map<number, Game[]>();

    games.forEach(game => {
      const week = game.week;
      if (!weekMap.has(week)) {
        weekMap.set(week, []);
      }
      weekMap.get(week)!.push(game);
    });

    const weeks: ScheduleWeek[] = [];
    weekMap.forEach((weekGames, weekNumber) => {
      if (weekGames.length > 0) {
        // Calculate week dates based on first and last game
        const dates = weekGames
          .map(g => g.date)
          .sort((a, b) => a.getTime() - b.getTime());
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];

        weeks.push({
          weekNumber,
          startDate,
          endDate,
          games: weekGames.sort((a, b) => a.date.getTime() - b.date.getTime()),
        });
      }
    });

    return weeks.sort((a, b) => a.weekNumber - b.weekNumber);
  }, [games]);

  useEffect(() => {
    fetchGames();

    // Set up real-time subscription for game updates
    const channel = supabase
      .channel(`games-updates-${sportType || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: sportType ? `sport_type=eq.${sportType}` : undefined,
        },
        payload => {
          if (payload.eventType === "UPDATE" && payload.new) {
            // Handle real-time score updates more efficiently
            const updatedGame = payload.new;

            setGames(prev => {
              const newGames = prev.map(game => {
                if (game.id === updatedGame.id) {
                  const updatedGameData = {
                    ...game,
                    status: updatedGame.status as Game["status"],
                    scores:
                      updatedGame.home_score !== null &&
                      updatedGame.away_score !== null
                        ? {
                            homeScore: updatedGame.home_score,
                            awayScore: updatedGame.away_score,
                          }
                        : game.scores,
                    time: updatedGame.game_time || game.time,
                  };
                  return updatedGameData;
                }
                return game;
              });
              return newGames;
            });
          } else {
            // For INSERT/DELETE or complex updates, refetch all games
            fetchGames();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGames, sportType]);

  return {
    games,
    loading,
    error,
    upcomingGames: getUpcomingGames(),
    completedGames: getCompletedGames(),
    liveGames: getLiveGames(),
    scheduleWeeks: getScheduleWeeks(),
    refetch: fetchGames,
  };
};

// Hook specifically for upcoming games
export const useUpcomingGames = (
  sportType?: "kickball" | "dodgeball",
  maxGames?: number
) => {
  const { games, loading, error } = useGames(sportType);

  const upcomingGames = games
    .filter(
      game =>
        game.date >= new Date() &&
        (game.status === "scheduled" || game.status === "in-progress")
    )
    .slice(0, maxGames);

  return {
    games: upcomingGames,
    loading,
    error,
  };
};

// Hook for getting league statistics
export const useLeagueStats = () => {
  const kickballGames = useGames("kickball");
  const dodgeballGames = useGames("dodgeball");

  return {
    totalUpcomingGames:
      kickballGames.upcomingGames.length + dodgeballGames.upcomingGames.length,
    totalWeeks: Math.max(
      Math.max(...kickballGames.games.map(g => g.week), 0),
      Math.max(...dodgeballGames.games.map(g => g.week), 0)
    ),
    loading: kickballGames.loading || dodgeballGames.loading,
    error: kickballGames.error || dodgeballGames.error,
  };
};

// Hook for getting a single game with real-time updates
export const useGame = (gameId: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    if (!gameId) return;

    try {
      setLoading(true);
      setError(null);

      const gameData = await gamesApi.getById(gameId);
      setGame(gameData);
    } catch (err) {
      console.error("Error fetching game:", err);
      setError("Failed to load game");
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGame();

    // Set up real-time subscription for this specific game
    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        payload => {
          if (payload.eventType === "UPDATE" && payload.new) {
            // Handle real-time updates efficiently
            const updatedGame = payload.new;
            setGame(prev => {
              if (!prev) return null;

              return {
                ...prev,
                status: updatedGame.status as Game["status"],
                scores:
                  updatedGame.home_score !== null &&
                  updatedGame.away_score !== null
                    ? {
                        homeScore: updatedGame.home_score,
                        awayScore: updatedGame.away_score,
                      }
                    : prev.scores,
                time: updatedGame.game_time || prev.time,
              };
            });
          } else {
            // For complex updates, refetch the game
            fetchGame();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGame, gameId]);

  return {
    game,
    loading,
    error,
    refetch: fetchGame,
  };
};
