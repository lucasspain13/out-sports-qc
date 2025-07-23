import { motion } from "framer-motion";
import React, { useState } from "react";
import { usePlatform } from "../../../hooks/usePlatform";
import { useTeams } from "../../../hooks/useTeams";
import { navigateToTeam } from "../../../lib/navigation";
import { Team } from "../../../types";

interface TeamsScreenProps {
  className?: string;
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ className = "" }) => {
  const platform = usePlatform();
  const [selectedSport, setSelectedSport] = useState<string>("kickball");
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

    // Get teams for selected sport
    const { teams, loading, error, refetch } = useTeams(
      selectedSport as "kickball" | "dodgeball"
    );

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

      // Refresh teams data
      await refetch();
      setRefreshing(false);
    };

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
    };

    if (loading && !refreshing) {
      return (
        <div className={`${styles.container} ${className}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading teams...</p>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.container} ${className}`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                Error Loading Teams
              </h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Retry
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
            <h1 className={styles.title}>Teams</h1>
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
          <div className="flex space-x-2">
            {["kickball", "dodgeball"].map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`${styles.filterButton} ${
                  selectedSport === sport
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } flex-1`}
              >
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6">
          {teams.length > 0 ? (
            <div className="space-y-4">
              {teams.map((team, index) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  platform={platform}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                No Teams Found
              </h2>
              <p className="text-gray-600 text-sm">
                No {selectedSport} teams are currently registered.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  interface TeamCardProps {
    team: Team;
    platform: ReturnType<typeof usePlatform>;
    delay: number;
  }

  const TeamCard: React.FC<TeamCardProps> = ({ team, platform, delay }) => {
    const handleTeamClick = () => {
      // Add haptic feedback
      if (platform.isNative) {
        try {
          navigator.vibrate?.(30);
        } catch (e) {
          // Ignore if vibration not supported
        }
      }
      navigateToTeam(team);
    };

    // Platform-specific card styles
    const cardStyles = platform.isIOS
      ? "bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
      : platform.isAndroid
      ? "bg-white rounded-lg shadow-md p-4"
      : "bg-white rounded-lg shadow-sm border border-gray-200 p-4";

    const hoverEffect = platform.isIOS
      ? "hover:shadow-md"
      : platform.isAndroid
      ? "hover:shadow-lg"
      : "hover:shadow-md";

    // Calculate team stats
    const totalPlayers = team.players.length;

    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        onClick={handleTeamClick}
        className={`${cardStyles} w-full ${hoverEffect} transition-all duration-200 active:scale-98`}
      >
        <div className="flex items-center justify-between">
          {/* Team Info */}
          <div className="flex-1 text-left">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3
                  className={
                    platform.isIOS
                      ? "text-lg font-bold text-gray-900 mb-1"
                      : platform.isAndroid
                      ? "text-base font-semibold text-gray-900 mb-1"
                      : "text-base font-semibold text-gray-900 mb-1"
                  }
                >
                  {team.name}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 capitalize">
                    {team.sportType}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    Founded {team.founded}
                  </span>
                </div>
              </div>

              {/* Team Gradient Indicator */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 ${
                  team.gradient === "orange"
                    ? "bg-orange-500"
                    : team.gradient === "teal"
                    ? "bg-teal-500"
                    : team.gradient === "blue"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }`}
              />
            </div>

            {/* Team Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {totalPlayers} Players
                </span>
              </div>

              {team.captain && (
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">Captain</span>
                </div>
              )}
            </div>

            {/* Team Record */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {team.wins}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Wins
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {team.losses}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Losses
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">
                    "{team.motto}"
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Motto
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="ml-4 text-gray-400">
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
        </div>
      </motion.button>
    );
  };
};

export default TeamsScreen;
