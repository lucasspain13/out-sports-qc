import { motion } from "framer-motion";
import React, { useMemo, useState, useEffect } from "react";
import { getAllLocations } from "../../data/supabase";
import { useGames } from "../../hooks/useGames";
import { Game, GameLocation } from "../../types";
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
  const [gameLocations, setGameLocations] = useState<GameLocation[]>([]);

  // Use the database-driven hook
  const { games, scheduleWeeks, loading, error } = useGames(sportType);

  // Load locations from database
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locations = await getAllLocations();
        setGameLocations(locations);
      } catch (error) {
        console.error("Failed to load locations:", error);
      }
    };
    loadLocations();
  }, []);

  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "☄️" : "🏐";

  // Memoize filtered weeks to prevent unnecessary re-renders
  const filteredWeeks = useMemo(() => {
    if (filter === "all") return scheduleWeeks;

    return scheduleWeeks.filter(week => {
      if (filter === "upcoming") {
        return week.games.some(
          game => game.status === "scheduled" || game.status === "in-progress"
        );
      } else if (filter === "completed") {
        return week.games.some(game => game.status === "completed");
      }
      return true;
    });
  }, [scheduleWeeks, filter]);

  // Calculate statistics - moved to prevent hooks order issues
  const totalGames = games.length;
  const completedGames = games.filter(game => game.status === "completed");
  const upcomingGames = games.filter(
    game => game.status === "scheduled" || game.status === "in-progress"
  );
  const completedCount = completedGames.length;
  const upcomingCount = upcomingGames.length;
  const totalWeeks = scheduleWeeks.length;
  const currentSeason = games.length > 0 ? games[0].season : "Fall 2025";

  // Early returns AFTER all hooks have been called
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12 text-center">
          <div className="text-white text-xl">Loading schedule...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-12 text-center">
          <div className="text-red-400 text-xl">
            Error loading schedule: {error}
          </div>
        </div>
      </div>
    );
  }

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
    <section className="py-16 sm:py-20 bg-gray-50 min-h-screen">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl mr-2">{sportEmoji}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              {sportDisplayName} League
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            {sportDisplayName}{" "}
            <span className="text-gradient-brand">Schedule</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Stay up to date with all {sportDisplayName.toLowerCase()} games this
            season. View upcoming matches, check completed results, and explore
            game locations.
          </p>

          {/* Season Info and Statistics */}
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-4 sm:gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-brand mb-1">
                {currentSeason}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Season</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-brand mb-1">
                {totalGames}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Total Games
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-brand mb-1">
                {totalWeeks}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gradient-brand mb-1">
                {gameLocations.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Venues</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-full sm:w-auto">
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
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    filter === key
                      ? "bg-gradient-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden sm:inline">
                    {label} ({count})
                  </span>
                  <span className="sm:hidden">
                    {key === "all"
                      ? `All (${count})`
                      : key === "upcoming"
                      ? `Up (${count})`
                      : `Done (${count})`}
                  </span>
                </button>
              ))}
            </div>

            {/* Map Toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
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
            <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-100">
              <h3 className="heading-4 text-gray-900 mb-4 text-center">
                Game Locations Overview
              </h3>
              <LocationMap
                locations={gameLocations}
                height="300px"
                showAllMarkers={true}
              />
            </div>
          </motion.div>
        )}

        {/* Schedule Weeks */}
        <motion.div
          key={`schedule-${filter}`} // Force re-render when filter changes
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
            filteredWeeks.map(week => (
              <motion.div key={week.weekNumber} variants={itemVariants}>
                <ScheduleWeek
                  week={week}
                  onGameSelect={onGameSelect}
                  showLocations={true}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Removed redundant Call to Action - keeping only essential schedule info */}
      </div>
    </section>
  );
};

export default ScheduleOverview;
