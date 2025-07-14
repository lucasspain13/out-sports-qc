import { motion } from "framer-motion";
import React, { useState } from "react";
import { getScheduleBySport, getUpcomingGames } from "../../data/schedules";
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

  // Get games based on selection
  const getGames = () => {
    if (showUpcomingOnly) {
      return getUpcomingGames(
        selectedSport === "all" ? undefined : selectedSport
      );
    } else {
      if (selectedSport === "all") {
        const kickballSchedule = getScheduleBySport("kickball");
        const dodgeballSchedule = getScheduleBySport("dodgeball");
        const allGames = [
          ...kickballSchedule.weeks.flatMap(week => week.games),
          ...dodgeballSchedule.weeks.flatMap(week => week.games),
        ];
        return allGames.sort((a, b) => a.date.getTime() - b.date.getTime());
      } else {
        const schedule = getScheduleBySport(selectedSport);
        return schedule.weeks.flatMap(week => week.games);
      }
    }
  };

  const games = getGames().slice(0, maxGames);

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
      { key: "dodgeball" as const, label: "Dodgeball", emoji: "🏐" },
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
        {games.length === 0 ? (
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
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GameCard
                  game={game}
                  onClick={() => onGameSelect?.(game)}
                  showLocation={true}
                  showScore={game.status === "completed"}
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
                <motion.a
                  href="#dodgeball-schedule"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary inline-flex items-center"
                >
                  <span className="mr-2">🏐</span>
                  Dodgeball Schedule
                </motion.a>
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
                    {getUpcomingGames("kickball").length +
                      getUpcomingGames("dodgeball").length}
                  </div>
                  <div className="text-sm opacity-90">Upcoming Games</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {getScheduleBySport("kickball").weeks.length +
                      getScheduleBySport("dodgeball").weeks.length}
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
