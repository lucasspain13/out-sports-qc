import { motion } from "framer-motion";
import React from "react";
import { PlayerCardProps } from "../../types";

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  iscaptain = false,
  onClick,
  showQuote = true,
}) => {
  // Get team gradient from player's team data
  const getTeamGradient = (teamId: string) => {
    if (teamId.includes("team1")) return "orange";
    if (teamId.includes("team2")) return "teal";
    if (teamId.includes("team3")) return "blue";
    if (teamId.includes("team4")) return "purple";
    return "teal"; // fallback
  };

  const teamGradient = getTeamGradient(player.teamId);

  const gradientClasses = {
    orange: "bg-gradient-to-br from-brand-orange/20 to-brand-orange-dark/30",
    teal: "bg-gradient-to-br from-brand-teal/20 to-brand-teal-dark/30",
    blue: "bg-gradient-to-br from-brand-blue/20 to-brand-blue-dark/30",
    purple: "bg-gradient-to-br from-brand-purple/20 to-brand-purple-dark/30",
  };

  const accentClasses = {
    orange: "border-brand-orange text-brand-orange bg-brand-orange/10",
    teal: "border-brand-teal text-brand-teal bg-brand-teal/10",
    blue: "border-brand-blue text-brand-blue bg-brand-blue/10",
    purple: "border-brand-purple text-brand-purple bg-brand-purple/10",
  };

  const textAccentClasses = {
    orange: "text-brand-orange",
    teal: "text-brand-teal",
    blue: "text-brand-blue",
    purple: "text-brand-purple",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`card-base cursor-pointer group relative overflow-hidden ${
        showQuote ? "h-auto" : "h-32"
      }`}
      onClick={onClick}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${gradientClasses[teamGradient]}`} />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            {/* Avatar Placeholder */}
            <div
              className={`w-12 h-12 rounded-full ${accentClasses[teamGradient]} flex items-center justify-center font-bold text-lg`}
            >
              {player.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </div>

            {/* Name and Jersey */}
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{player.name}</h4>
                {iscaptain && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Captain
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                #{player.jerseyNumber} •{" "}
                {player.sportType.charAt(0).toUpperCase() +
                  player.sportType.slice(1)}
              </p>
            </div>
          </div>

          {/* Jersey Number Badge */}
          <div
            className={`w-10 h-10 rounded-lg ${accentClasses[teamGradient]} flex items-center justify-center font-bold text-lg border-2`}
          >
            {player.jerseyNumber}
          </div>
        </div>

        {/* Quote Section (if showQuote is true) */}
        {showQuote && (
          <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
            <div className="flex items-start space-x-2">
              <svg
                className={`w-4 h-4 mt-1 flex-shrink-0 ${textAccentClasses[teamGradient]}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <blockquote className="text-sm italic text-gray-700 leading-relaxed">
                "{player.quote}"
              </blockquote>
            </div>
          </div>
        )}

        {/* Compact Mode Additional Info */}
        {!showQuote && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 line-clamp-2">
              "{player.quote}"
            </p>
          </div>
        )}
      </div>

      {/* Hover Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default PlayerCard;
