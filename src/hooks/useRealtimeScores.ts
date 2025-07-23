import { useCallback, useEffect, useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { scoreApi } from "../lib/database";
import { supabase } from "../lib/supabase";
import { Game } from "../types";

export interface ScoreUpdate {
  gameId: string;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
}

export const useRealtimeScores = (gameId?: string) => {
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("connected");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { showNotification } = useNotification();

  // Fetch initial live games
  const fetchLiveGames = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const games = await scoreApi.getLiveGames();
      setLiveGames(games);
      setError(null);
    } catch (err) {
      setError("Failed to load live games");
      console.error("Live games fetch error:", err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  // Debounced score update function
  const updateScore = useCallback(
    async (gameId: string, homeScore: number, awayScore: number) => {
      try {
        await scoreApi.updateScore(gameId, homeScore, awayScore);
        // Optimistic update
        setLiveGames(prev =>
          prev.map(game =>
            game.id === gameId
              ? { ...game, scores: { homeScore, awayScore } }
              : game
          )
        );
      } catch (err) {
        setError("Failed to update score");
        showNotification({
          type: "error",
          title: "Score Update Failed",
          message: "Unable to update score. Please try again.",
        });
        // Since we have real-time updates, no need to refetch
        // The real-time subscription will handle data consistency
      }
    },
    [showNotification]
  );

  const incrementScore = useCallback(
    async (gameId: string, team: "home" | "away") => {
      // Optimistic update first
      const game = liveGames.find(g => g.id === gameId);
      if (game) {
        const currentHomeScore = game.scores?.homeScore || 0;
        const currentAwayScore = game.scores?.awayScore || 0;
        const newHomeScore =
          team === "home" ? currentHomeScore + 1 : currentHomeScore;
        const newAwayScore =
          team === "away" ? currentAwayScore + 1 : currentAwayScore;

        // Update UI immediately
        setLiveGames(prev =>
          prev.map(g =>
            g.id === gameId
              ? {
                  ...g,
                  scores: { homeScore: newHomeScore, awayScore: newAwayScore },
                }
              : g
          )
        );
      }

      try {
        await scoreApi.incrementScore(gameId, team);
      } catch (err) {
        console.error("Failed to increment score:", err);
        // Rollback optimistic update on error
        if (game) {
          setLiveGames(prev =>
            prev.map(g => (g.id === gameId ? { ...g, scores: game.scores } : g))
          );
        }
        setError("Failed to increment score");
        showNotification({
          type: "error",
          title: "Score Update Failed",
          message: "Unable to increment score. Please try again.",
        });
      }
    },
    [liveGames, showNotification]
  );

  const decrementScore = useCallback(
    async (gameId: string, team: "home" | "away") => {
      // Optimistic update first
      const game = liveGames.find(g => g.id === gameId);
      if (game) {
        const currentHomeScore = game.scores?.homeScore || 0;
        const currentAwayScore = game.scores?.awayScore || 0;
        const newHomeScore =
          team === "home" ? currentHomeScore - 1 : currentHomeScore;
        const newAwayScore =
          team === "away" ? currentAwayScore - 1 : currentAwayScore;

        // Update UI immediately
        setLiveGames(prev =>
          prev.map(g =>
            g.id === gameId
              ? {
                  ...g,
                  scores: { homeScore: newHomeScore, awayScore: newAwayScore },
                }
              : g
          )
        );
      }

      try {
        await scoreApi.decrementScore(gameId, team);
      } catch (err) {
        console.error("Failed to decrement score:", err);
        // Rollback optimistic update on error
        if (game) {
          setLiveGames(prev =>
            prev.map(g => (g.id === gameId ? { ...g, scores: game.scores } : g))
          );
        }
        setError("Failed to decrement score");
        showNotification({
          type: "error",
          title: "Score Update Failed",
          message: "Unable to decrement score. Please try again.",
        });
      }
    },
    [liveGames, showNotification]
  );

  // Optimistic update with rollback on failure
  const updateScoreOptimistic = useCallback(
    async (gameId: string, team: "home" | "away", increment: boolean) => {
      const game = liveGames.find(g => g.id === gameId);
      if (!game) return;

      const currentScore =
        team === "home"
          ? game.scores?.homeScore || 0
          : game.scores?.awayScore || 0;

      const newScore = increment ? currentScore + 1 : currentScore - 1;

      // Optimistic update
      const optimisticScores = {
        homeScore: team === "home" ? newScore : game.scores?.homeScore || 0,
        awayScore: team === "away" ? newScore : game.scores?.awayScore || 0,
      };

      setLiveGames(prev =>
        prev.map(g =>
          g.id === gameId ? { ...g, scores: optimisticScores } : g
        )
      );

      try {
        // Actual update
        if (increment) {
          await incrementScore(gameId, team);
        } else {
          await decrementScore(gameId, team);
        }
      } catch (error) {
        // Rollback on failure
        setLiveGames(prev =>
          prev.map(g => (g.id === gameId ? { ...g, scores: game.scores } : g))
        );
        throw error;
      }
    },
    [liveGames, incrementScore, decrementScore]
  );

  useEffect(() => {
    fetchLiveGames(true); // Show loader on initial load

    // Set up real-time subscription
    const channel = supabase
      .channel("score-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: gameId ? `id=eq.${gameId}` : "status=eq.in-progress",
        },
        payload => {
          console.log("Real-time score update received:", payload);

          const updatedGame = payload.new;
          console.log("Updated game data:", updatedGame);

          setLiveGames(prev =>
            prev.map(game => {
              if (game.id === updatedGame.id) {
                const updatedGameData = {
                  ...game,
                  scores: {
                    homeScore: updatedGame.home_score || 0,
                    awayScore: updatedGame.away_score || 0,
                  },
                };
                console.log(
                  "Updating game:",
                  game.id,
                  "with new scores:",
                  updatedGameData.scores
                );
                return updatedGameData;
              }
              return game;
            })
          );

          setLastUpdate(new Date());
          setConnectionStatus("connected");

          // Show notification for score changes
          const homeTeam =
            liveGames.find(g => g.id === updatedGame.id)?.homeTeam?.name ||
            "Home";
          const awayTeam =
            liveGames.find(g => g.id === updatedGame.id)?.awayTeam?.name ||
            "Away";

          showNotification({
            type: "info",
            title: "Score Updated",
            message: `${homeTeam} ${updatedGame.home_score || 0} - ${
              updatedGame.away_score || 0
            } ${awayTeam}`,
            duration: 3000,
          });
        }
      )
      .subscribe(status => {
        console.log("Realtime subscription status:", status);

        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected");
        } else if (status === "CHANNEL_ERROR") {
          setConnectionStatus("disconnected");
        } else if (status === "TIMED_OUT") {
          setConnectionStatus("reconnecting");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, fetchLiveGames, showNotification]);

  return {
    liveGames,
    loading,
    error,
    connectionStatus,
    lastUpdate,
    updateScore,
    incrementScore,
    decrementScore,
    updateScoreOptimistic,
    refetch: () => fetchLiveGames(false), // Don't show loader on manual refetch
  };
};
