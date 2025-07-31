import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { ScheduleWeekProps } from "../../types";
import GameCard from "./GameCard";

const ScheduleWeek: React.FC<ScheduleWeekProps> = ({
  week,
  onGameSelect,
  showLocations = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    // If start and end dates are the same, show only one date
    if (start === end) {
      return start;
    }
    
    return `${start} - ${end}`;
  };

  const getWeekStatus = () => {
    const now = new Date();
    const weekStart = week.startDate;
    const weekEnd = week.endDate;

    if (now < weekStart) {
      return { label: "Upcoming", color: "text-blue-600 bg-blue-50" };
    } else if (now >= weekStart && now <= weekEnd) {
      return { label: "Current", color: "text-green-600 bg-green-50" };
    } else {
      return { label: "Completed", color: "text-gray-600 bg-gray-50" };
    }
  };

  const getGameStatusCounts = () => {
    const counts = {
      scheduled: 0,
      "in-progress": 0,
      completed: 0,
      cancelled: 0,
      postponed: 0,
    };

    week.games.forEach(game => {
      counts[game.status]++;
    });

    return counts;
  };

  const status = getWeekStatus();
  const statusCounts = getGameStatusCounts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card-base bg-white overflow-hidden"
    >
      {/* Week Header */}
      <div
        className="p-4 sm:p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {week.weekNumber}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Week {week.weekNumber}
                </h3>
                <p className="text-xs text-gray-600">
                  {formatDateRange(week.startDate, week.endDate)}
                </p>
              </div>
            </div>

            {/* Expand/Collapse Icon - Mobile */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
              >
                {status.label}
              </span>
              <span className="text-xs font-medium text-gray-900">
                {week.games.length} {week.games.length === 1 ? "Game" : "Games"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {statusCounts.completed > 0 && (
                <span className="mr-2">{statusCounts.completed} completed</span>
              )}
              {statusCounts["in-progress"] > 0 && (
                <span className="mr-2 text-red-600">
                  {statusCounts["in-progress"]} live
                </span>
              )}
              {statusCounts.scheduled > 0 && (
                <span>{statusCounts.scheduled} scheduled</span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Week Number */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-base">
                {week.weekNumber}
              </div>
              <div className="min-w-0">
                <h3 className="card-title text-gray-900 text-base">
                  Week {week.weekNumber}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {formatDateRange(week.startDate, week.endDate)}
                </p>
              </div>
            </div>

            {/* Status Badge - Desktop */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>

          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Game Count and Status Summary */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {week.games.length} {week.games.length === 1 ? "Game" : "Games"}
              </div>
              <div className="text-xs text-gray-500">
                {statusCounts.completed > 0 && (
                  <span className="mr-2">
                    {statusCounts.completed} completed
                  </span>
                )}
                {statusCounts["in-progress"] > 0 && (
                  <span className="mr-2 text-red-600">
                    {statusCounts["in-progress"]} live
                  </span>
                )}
                {statusCounts.scheduled > 0 && (
                  <span>{statusCounts.scheduled} scheduled</span>
                )}
              </div>
            </div>

            {/* Expand/Collapse Icon - Desktop */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-4">
              {week.games.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
                  <p>No games scheduled for this week</p>
                </div>
              ) : (
                <div className="space-y-4 md:grid md:gap-4 md:grid-cols-2 md:space-y-0">
                  {week.games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <GameCard
                        game={game}
                        onClick={() => onGameSelect?.(game)}
                        showLocation={showLocations}
                        showScore={
                          game.status === "completed" ||
                          game.status === "in-progress"
                        }
                        compact={true}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Footer (when collapsed) */}
      {!isExpanded && week.games.length > 0 && (
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Sport Types */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {Array.from(new Set(week.games.map(g => g.sportType))).map(
                  sport => (
                    <span
                      key={sport}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-white text-gray-700 border"
                    >
                      <span className="hidden sm:inline">
                        {sport === "kickball" ? "☄️" : "🏐"}{" "}
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </span>
                      <span className="sm:hidden">
                        {sport === "kickball" ? "☄️" : "🏐"}
                      </span>
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Next Game Indicator */}
            {statusCounts.scheduled > 0 && (
              <div className="text-xs text-gray-500 text-right">
                <span className="hidden sm:inline">Next game: </span>
                {week.games
                  .filter(g => g.status === "scheduled")
                  .sort((a, b) => a.date.getTime() - b.date.getTime())[0]
                  ?.date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScheduleWeek;
