import { motion } from "framer-motion";
import React, { useState } from "react";
import { useGames } from "../../../hooks/useGames";
import { usePlatform } from "../../../hooks/usePlatform";
import { navigateToGame } from "../../../lib/navigation";
import { Game } from "../../../types";

interface ScheduleScreenProps {
  className?: string;
}

const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ className = "" }) => {
  const platform = usePlatform();
  const { games, loading, error } = useGames();
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add haptic feedback
    if (platform.isNative) {
      try {
        navigator.vibrate?.(50);
      } catch (e) {
        // Ignore if vibration not supported
      }
    }

    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter games by sport
  const filteredGames =
    selectedSport === "all"
      ? games
      : games.filter(game => game.sportType === selectedSport);

  // Group games by date
  const gamesByDate = filteredGames.reduce(
    (groups: Record<string, Game[]>, game) => {
      const date = new Date(game.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    },
    {}
  );

  // Sort dates
  const sortedDates = Object.keys(gamesByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Platform-specific styles
  const styles = {
    container: platform.isIOS
      ? "bg-gray-50 min-h-screen"
      : platform.isAndroid
      ? "bg-gray-100 min-h-screen"
      : "bg-white min-h-screen",
    header: platform.isIOS
      ? "bg-white border-b border-gray-200 px-4 py-6 pt-12"
      : platform.isAndroid
      ? "bg-white px-4 py-4 pt-8 shadow-sm"
      : "bg-white border-b border-gray-200 px-4 py-6",
    title: platform.isIOS
      ? "text-3xl font-bold text-gray-900"
      : platform.isAndroid
      ? "text-2xl font-medium text-gray-900"
      : "text-2xl font-bold text-gray-900",
    filterButton: platform.isIOS
      ? "px-4 py-2 rounded-full text-sm font-medium transition-colors"
      : platform.isAndroid
      ? "px-3 py-2 rounded text-sm font-medium transition-colors"
      : "px-3 py-2 rounded text-sm font-medium transition-colors",
    sectionTitle: platform.isIOS
      ? "text-base font-semibold text-gray-900 uppercase tracking-wide"
      : platform.isAndroid
      ? "text-sm font-medium text-gray-700 uppercase tracking-wide"
      : "text-sm font-semibold text-gray-700 uppercase tracking-wide",
  };

  if (loading && !refreshing) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Loading schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className="flex items-center justify-center pt-20">
          <div className="text-center px-6">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Schedule
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Check your connection and try again.
            </p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-4">
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent animate-spin rounded-full mr-3" />
            <span className="text-sm text-gray-600">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={styles.title}>Schedule</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{
                duration: 1,
                repeat: refreshing ? Infinity : 0,
                ease: "linear",
              }}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          </button>
        </div>

        {/* Sport Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {["all", "kickball", "dodgeball"].map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`${styles.filterButton} ${
                selectedSport === sport
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } flex-shrink-0`}
            >
              {sport === "all"
                ? "All Sports"
                : sport.charAt(0).toUpperCase() + sport.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {sortedDates.length > 0 ? (
          <div className="space-y-6">
            {sortedDates.map((date, dateIndex) => (
              <div key={date}>
                <div className="mb-4">
                  <h2 className={`${styles.sectionTitle} mb-3`}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                </div>
                <div className="space-y-3">
                  {gamesByDate[date]
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )
                    .map((game, gameIndex) => (
                      <ScheduleGameCard
                        key={game.id}
                        game={game}
                        platform={platform}
                        delay={dateIndex * 0.1 + gameIndex * 0.05}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No Games Scheduled
            </h2>
            <p className="text-gray-600 text-sm">
              {selectedSport === "all"
                ? "Check back later for upcoming games."
                : `No ${selectedSport} games scheduled.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ScheduleGameCardProps {
  game: Game;
  platform: ReturnType<typeof usePlatform>;
  delay: number;
}

const ScheduleGameCard: React.FC<ScheduleGameCardProps> = ({
  game,
  platform,
  delay,
}) => {
  const handleGameClick = () => {
    // Add haptic feedback
    if (platform.isNative) {
      try {
        navigator.vibrate?.(30);
      } catch (e) {
        // Ignore if vibration not supported
      }
    }
    navigateToGame(game.id);
  };

  // Platform-specific card styles
  const cardStyles = platform.isIOS
    ? "bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
    : platform.isAndroid
    ? "bg-white rounded-lg shadow-md p-4"
    : "bg-white rounded-lg shadow-sm border border-gray-200 p-4";

  const hoverEffect = platform.isIOS
    ? "hover:shadow-md"
    : platform.isAndroid
    ? "hover:shadow-lg"
    : "hover:shadow-md";

  // Format game time
  const gameTime = new Date(game.date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Get status styling
  const getStatusStyle = () => {
    switch (game.status) {
      case "in-progress":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={handleGameClick}
      className={`${cardStyles} w-full ${hoverEffect} transition-all duration-200 active:scale-98`}
    >
      <div className="flex items-center justify-between">
        {/* Game Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-3 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}
            >
              {game.status === "in-progress"
                ? "LIVE"
                : game.status === "completed"
                ? "FINAL"
                : game.status === "cancelled"
                ? "CANCELLED"
                : "SCHEDULED"}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {gameTime}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">
              {game.awayTeam.name} vs {game.homeTeam.name}
            </div>
            <div className="text-xs text-gray-500">
              {game.location.name} •{" "}
              {game.sportType.charAt(0).toUpperCase() + game.sportType.slice(1)}
            </div>
          </div>
        </div>

        {/* Score or Arrow */}
        <div className="text-right">
          {game.status === "completed" || game.status === "in-progress" ? (
            <div className="text-lg font-bold text-gray-900 tabular-nums">
              {game.scores?.awayScore || 0} - {game.scores?.homeScore || 0}
            </div>
          ) : (
            <div className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};

export default ScheduleScreen;
