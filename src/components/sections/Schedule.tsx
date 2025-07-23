import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useLeagueStats, useUpcomingGames } from "../../hooks/useGames";
import { Game } from "../../types";
import GameCard from "../ui/GameCard";

interface ScheduleSectionProps {
  sportType?: "kickball" | "dodgeball";
  title?: string;
  subtitle?: string;
  showUpcomingOnly?: boolean;
  maxGames?: number;
  onGameSelect?: (game: Game) => void;
  showViewAllLink?: boolean;
}

const Schedule: React.FC<ScheduleSectionProps> = ({
  sportType,
  title = "Upcoming Games",
  subtitle = "Don't miss the action! Check out our upcoming games and mark your calendar.",
  showUpcomingOnly = true,
  maxGames = 6,
  onGameSelect,
  showViewAllLink = true,
}) => {
  const [selectedSport, setSelectedSport] = useState<
    "kickball" | "dodgeball" | "all"
  >(sportType || "all");

  // Use the database-driven hook for games
  const {
    games: dbGames,
    loading,
    error,
  } = useUpcomingGames(
    selectedSport === "all" ? undefined : selectedSport,
    maxGames
  );

  // Get league stats for the bottom section
  const leagueStats = useLeagueStats();

  // Ensure selectedSport is properly synced with sportType prop
  useEffect(() => {
    if (sportType && sportType !== selectedSport) {
      setSelectedSport(sportType);
    }
  }, [sportType, selectedSport]);

  // Filter and limit games based on options
  const games = useMemo(() => {
    let filteredGames = dbGames;

    if (!showUpcomingOnly) {
      // If we want all games, we need all games, not just upcoming
      // For now, we'll still use upcoming as the base set
      filteredGames = dbGames;
    }

    return filteredGames.slice(0, maxGames);
  }, [dbGames, showUpcomingOnly, maxGames]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const getSportFilterOptions = () => {
    if (sportType) return []; // Don't show filters if specific sport is set

    return [
      { key: "all" as const, label: "All Sports", emoji: "🏆" },
      { key: "kickball" as const, label: "Kickball", emoji: "⚽" },
      // Temporarily disabled - dodgeball coming soon
      // { key: "dodgeball" as const, label: "Dodgeball", emoji: "🏐" },
    ];
  };

  const sportFilterOptions = getSportFilterOptions();

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-gray-900 mb-4">
            {title.split(" ").map((word, index) =>
              index === title.split(" ").length - 1 ? (
                <span key={index} className="text-gradient-brand">
                  {word}
                </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          <p className="body-large text-gray-600 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Sport Filter (only show if not specific sport) */}
          {sportFilterOptions.length > 0 && (
            <div className="flex items-center justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {sportFilterOptions.map(({ key, label, emoji }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSport(key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                      selectedSport === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Games Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="bg-gray-50 rounded-2xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="heading-4 text-gray-900 mb-2">Loading Games...</h3>
              <p className="body-base text-gray-600">
                Please wait while we fetch the latest game information.
              </p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="bg-red-50 rounded-2xl p-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="heading-4 text-gray-900 mb-2">
                Error Loading Games
              </h3>
              <p className="body-base text-gray-600">{error}</p>
            </div>
          </motion.div>
        ) : games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="bg-gray-50 rounded-2xl p-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="heading-4 text-gray-900 mb-2">
                No {showUpcomingOnly ? "upcoming " : ""}games found
              </h3>
              <p className="body-base text-gray-600">
                {showUpcomingOnly
                  ? "Check back soon for the next scheduled games!"
                  : "No games match your current selection."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`games-${selectedSport}`} // Force re-render when filter changes
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {games.map(game => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard
                  game={game}
                  onClick={() => onGameSelect?.(game)}
                  showLocation={true}
                  showScore={
                    game.status === "completed" || game.status === "in-progress"
                  }
                  compact={false}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Link */}
        {showViewAllLink && games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {sportType ? (
              <motion.a
                href={`#${sportType}-schedule`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center"
              >
                View Full{" "}
                {sportType.charAt(0).toUpperCase() + sportType.slice(1)}{" "}
                Schedule
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <motion.a
                  href="#kickball-schedule"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary inline-flex items-center"
                >
                  <span className="mr-2">⚽</span>
                  Kickball Schedule
                </motion.a>
                {/* Temporarily disabled - dodgeball coming soon
                <motion.a
                  href="#dodgeball-schedule"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary inline-flex items-center"
                >
                  <span className="mr-2">🏐</span>
                  Dodgeball Schedule
                </motion.a>
                */}
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Stats */}
        {!sportType && games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-primary rounded-2xl p-8 text-white text-center">
              <h3 className="heading-4 mb-6">League Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {leagueStats.totalUpcomingGames}
                  </div>
                  <div className="text-sm opacity-90">Upcoming Games</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {leagueStats.totalWeeks}
                  </div>
                  <div className="text-sm opacity-90">Total Weeks</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">2</div>
                  <div className="text-sm opacity-90">Active Sports</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Schedule;
