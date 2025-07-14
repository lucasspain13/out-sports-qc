import { motion } from "framer-motion";
import React from "react";
import { GameCardProps } from "../../types";

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  showLocation = true,
  showScore = true,
  compact = false,
}) => {
  const gradientClasses = {
    orange: "bg-gradient-card-orange",
    teal: "bg-gradient-card-teal",
    blue: "bg-gradient-card-blue",
    purple: "bg-gradient-card-purple",
  };

  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      color: "bg-blue-500",
      icon: "📅",
    },
    "in-progress": {
      label: "Live",
      color: "bg-red-500 animate-pulse",
      icon: "🔴",
    },
    completed: {
      label: "Final",
      color: "bg-green-500",
      icon: "✅",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-gray-500",
      icon: "❌",
    },
    postponed: {
      label: "Postponed",
      color: "bg-yellow-500",
      icon: "⏸️",
    },
  };

  const status = statusConfig[game.status];
  const homeGradient = gradientClasses[game.homeTeam.gradient];
  const awayGradient = gradientClasses[game.awayTeam.gradient];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`card-base card-hover cursor-pointer group ${
        compact ? "h-auto" : "h-64"
      }`}
      onClick={onClick}
    >
      <div className="relative h-full bg-white p-6 flex flex-col justify-between">
        {/* Header with Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${status.color}`}
            >
              <span className="mr-1">{status.icon}</span>
              {status.label}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {game.sportType.charAt(0).toUpperCase() + game.sportType.slice(1)}
            </span>
          </div>

          {/* Week indicator */}
          <div className="text-xs text-gray-400 font-medium">
            Week {game.week}
          </div>
        </div>

        {/* Teams Matchup */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            {/* Away Team */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full ${awayGradient} flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">
                    {game.awayTeam.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {game.awayTeam.name}
                  </div>
                  <div className="text-xs text-gray-500">Away</div>
                </div>
              </div>
              {showScore && game.scores && (
                <div className="text-2xl font-bold text-gray-900">
                  {game.scores.awayScore}
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center my-2">
              <div className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">
                VS
              </div>
            </div>

            {/* Home Team */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full ${homeGradient} flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">
                    {game.homeTeam.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {game.homeTeam.name}
                  </div>
                  <div className="text-xs text-gray-500">Home</div>
                </div>
              </div>
              {showScore && game.scores && (
                <div className="text-2xl font-bold text-gray-900">
                  {game.scores.homeScore}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Date, Time, and Location */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Date and Time */}
              <div className="flex items-center space-x-1 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{formatDate(game.date)}</span>
                <span className="text-gray-400">•</span>
                <span>{formatTime(game.time)}</span>
              </div>
            </div>

            {/* Location */}
            {showLocation && (
              <div className="flex items-center space-x-1 text-gray-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate max-w-32">{game.location.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-6 right-6 text-gray-400 group-hover:text-gray-600"
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GameCard;
