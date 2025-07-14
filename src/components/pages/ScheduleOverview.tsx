import { motion } from "framer-motion";
import React, { useState } from "react";
import { gameLocations } from "../../data/locations";
import {
  getCompletedGames,
  getScheduleBySport,
  getUpcomingGames,
} from "../../data/schedules";
import { Game } from "../../types";
import LocationMap from "../ui/LocationMap";
import ScheduleWeek from "../ui/ScheduleWeek";

interface ScheduleOverviewProps {
  sportType: "kickball" | "dodgeball";
  onGameSelect?: (game: Game) => void;
}

type FilterType = "all" | "upcoming" | "completed";

const ScheduleOverview: React.FC<ScheduleOverviewProps> = ({
  sportType,
  onGameSelect,
}) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showMap, setShowMap] = useState(false);

  const schedule = getScheduleBySport(sportType);
  const upcomingGames = getUpcomingGames(sportType);
  const completedGames = getCompletedGames(sportType);

  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "⚽" : "🏐";

  // Filter weeks based on selected filter
  const getFilteredWeeks = () => {
    if (filter === "all") return schedule.weeks;

    return schedule.weeks.filter(week => {
      if (filter === "upcoming") {
        return week.games.some(
          game => game.status === "scheduled" || game.status === "in-progress"
        );
      } else if (filter === "completed") {
        return week.games.some(game => game.status === "completed");
      }
      return true;
    });
  };

  const filteredWeeks = getFilteredWeeks();

  // Calculate statistics
  const totalGames = schedule.weeks.reduce(
    (total, week) => total + week.games.length,
    0
  );
  const completedCount = completedGames.length;
  const upcomingCount = upcomingGames.length;

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 mb-6">
            <span className="text-2xl mr-2">{sportEmoji}</span>
            <span className="text-sm font-medium text-gray-600">
              {sportDisplayName} League
            </span>
          </div>

          <h1 className="heading-1 text-gray-900 mb-4">
            {sportDisplayName}{" "}
            <span className="text-gradient-brand">Schedule</span>
          </h1>

          <p className="body-large text-gray-600 max-w-2xl mx-auto mb-8">
            Stay up to date with all {sportDisplayName.toLowerCase()} games this
            season. View upcoming matches, check completed results, and explore
            game locations.
          </p>

          {/* Season Info and Statistics */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {schedule.season}
              </div>
              <div className="text-sm text-gray-600">Season</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {totalGames}
              </div>
              <div className="text-sm text-gray-600">Total Games</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {schedule.totalWeeks}
              </div>
              <div className="text-sm text-gray-600">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {gameLocations.length}
              </div>
              <div className="text-sm text-gray-600">Venues</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {[
                {
                  key: "all" as FilterType,
                  label: "All Games",
                  count: totalGames,
                },
                {
                  key: "upcoming" as FilterType,
                  label: "Upcoming",
                  count: upcomingCount,
                },
                {
                  key: "completed" as FilterType,
                  label: "Completed",
                  count: completedCount,
                },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === key
                      ? "bg-gradient-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Map Toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                showMap
                  ? "bg-gradient-primary text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {showMap ? "Hide" : "Show"} Locations
            </button>
          </div>
        </motion.div>

        {/* Locations Map */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="heading-4 text-gray-900 mb-4 text-center">
                Game Locations Overview
              </h3>
              <LocationMap
                locations={gameLocations}
                height="400px"
                showAllMarkers={true}
              />
            </div>
          </motion.div>
        )}

        {/* Schedule Weeks */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {filteredWeeks.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
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
                <h3 className="heading-4 text-gray-900 mb-2">No games found</h3>
                <p className="body-base text-gray-600">
                  No games match the selected filter. Try selecting a different
                  filter option.
                </p>
              </div>
            </motion.div>
          ) : (
            filteredWeeks.map((week, index) => (
              <motion.div
                key={week.weekNumber}
                variants={itemVariants}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ScheduleWeek
                  week={week}
                  onGameSelect={onGameSelect}
                  showLocations={true}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="heading-4 text-gray-900 mb-4">
              Want to Join the League?
            </h3>
            <p className="body-base text-gray-600 mb-6">
              Registration is open for the next {sportDisplayName.toLowerCase()}{" "}
              season. Join our inclusive community and be part of the action!
            </p>
            <div className="flex items-center justify-center space-x-4">
              <motion.a
                href="#signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center"
              >
                Join {sportDisplayName} League
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
              <motion.a
                href={`#${sportType}-teams`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center"
              >
                View Teams
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScheduleOverview;
