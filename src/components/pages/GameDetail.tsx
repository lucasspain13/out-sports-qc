import { motion } from "framer-motion";
import React from "react";
import { Game } from "../../types";
import LocationMap from "../ui/LocationMap";

interface GameDetailProps {
  game: Game;
  onBack?: () => void;
  onTeamSelect?: (teamId: string) => void;
}

const GameDetail: React.FC<GameDetailProps> = ({
  game,
  onBack,
  onTeamSelect,
}) => {
  const gradientClasses = {
    orange: "bg-gradient-card-orange",
    green: "bg-gradient-card-green",
    blue: "bg-gradient-card-blue",
    pink: "bg-gradient-card-pink",
    white: "bg-gradient-card-white",
    black: "bg-gradient-card-black",
    gray: "bg-gradient-card-gray",
    brown: "bg-gradient-card-brown",
    purple: "bg-gradient-card-purple",
    yellow: "bg-gradient-card-yellow",
    red: "bg-gradient-card-red",
    cyan: "bg-gradient-card-cyan",
  };

  const statusConfig = {
    scheduled: {
      label: "Scheduled",
      color: "bg-blue-500",
      icon: "📅",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    "in-progress": {
      label: "Live",
      color: "bg-red-500 animate-pulse",
      icon: "🔴",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    completed: {
      label: "Final",
      color: "bg-green-500",
      icon: "✅",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-gray-500",
      icon: "❌",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
    },
    postponed: {
      label: "Postponed",
      color: "bg-yellow-500",
      icon: "⏸️",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
  };

  const status = statusConfig[game.status];
  const homeGradient = gradientClasses[game.homeTeam.gradient];
  const awayGradient = gradientClasses[game.awayTeam.gradient];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getWinner = () => {
    if (!game.scores || game.status !== "completed") return null;
    if (game.scores.homeScore > game.scores.awayScore) return "home";
    if (game.scores.awayScore > game.scores.homeScore) return "away";
    return "tie";
  };

  const winner = getWinner();

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Back Navigation */}
        {onBack && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <button
              onClick={onBack}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Schedule
            </button>
          </motion.div>
        )}

        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 mb-6">
            <span className="text-2xl mr-2">
              {game.sportType === "kickball" ? "☄️" : "🏐"}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {game.sportType.charAt(0).toUpperCase() + game.sportType.slice(1)}{" "}
              League
            </span>
          </div>

          <h1 className="heading-1 text-gray-900 mb-4">
            Game <span className="text-gradient-brand">Details</span>
          </h1>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}
            >
              <span className="mr-2">{status.icon}</span>
              {status.label}
            </span>
            <span className="text-sm text-gray-500">
              Week {game.week} • {game.season}
            </span>
          </div>
        </motion.div>

        {/* Main Game Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8"
        >
          {/* Teams Matchup */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Away Team */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`text-center p-6 rounded-xl cursor-pointer transition-all ${
                  winner === "away"
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onTeamSelect?.(game.awayTeam.id)}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full ${awayGradient} flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold">
                    {game.awayTeam.name.charAt(0)}
                  </span>
                </div>
                <h3 className="heading-4 text-gray-900 mb-2">
                  {game.awayTeam.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Away Team</p>
                {game.scores && (
                  <div className="text-4xl font-bold text-gray-900">
                    {game.scores.awayScore}
                  </div>
                )}
                {winner === "away" && (
                  <div className="mt-2 text-green-600 font-medium text-sm">
                    Winner!
                  </div>
                )}
              </motion.div>

              {/* VS / Score Divider */}
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-300 mb-4">VS</div>
                {game.status === "completed" && winner === "tie" && (
                  <div className="text-lg font-medium text-gray-600">
                    Final - Tie Game
                  </div>
                )}
                {game.status === "in-progress" && (
                  <div className="text-lg font-medium text-red-600 animate-pulse">
                    Game in Progress
                  </div>
                )}
                {game.status === "scheduled" && (
                  <div className="text-lg font-medium text-blue-600">
                    Upcoming Game
                  </div>
                )}
              </div>

              {/* Home Team */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`text-center p-6 rounded-xl cursor-pointer transition-all ${
                  winner === "home"
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onTeamSelect?.(game.homeTeam.id)}
              >
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full ${homeGradient} flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold">
                    {game.homeTeam.name.charAt(0)}
                  </span>
                </div>
                <h3 className="heading-4 text-gray-900 mb-2">
                  {game.homeTeam.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Home Team</p>
                {game.scores && (
                  <div className="text-4xl font-bold text-gray-900">
                    {game.scores.homeScore}
                  </div>
                )}
                {winner === "home" && (
                  <div className="mt-2 text-green-600 font-medium text-sm">
                    Winner!
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Game Information */}
          <div className="border-t border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Date & Time */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="heading-6 text-gray-900 mb-2">Date & Time</h4>
                <p className="body-base text-gray-600">
                  {formatDate(game.date)}
                </p>
                <p className="body-base text-gray-600">
                  {formatTime(game.time)}
                </p>
              </div>

              {/* Location */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h4 className="heading-6 text-gray-900 mb-2">Location</h4>
                <p className="body-base text-gray-600">{game.location.name}</p>
                <p className="text-sm text-gray-500">{game.location.address}</p>
              </div>

              {/* Field Type */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h4 className="heading-6 text-gray-900 mb-2">Field Type</h4>
                <p className="body-base text-gray-600 capitalize">
                  {game.location.fieldType}
                </p>
                {game.location.capacity && (
                  <p className="text-sm text-gray-500">
                    Capacity: {game.location.capacity}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8"
        >
          <div className="p-6">
            <h3 className="heading-4 text-gray-900 mb-4 text-center">
              Venue Location
            </h3>
            <LocationMap
              locations={[game.location]}
              selectedLocation={game.location}
              height="400px"
              showAllMarkers={false}
            />
          </div>
        </motion.div>

        {/* Venue Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <h3 className="heading-4 text-gray-900 mb-6 text-center">
            Venue Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Facilities */}
            <div>
              <h4 className="heading-6 text-gray-900 mb-4">
                Available Facilities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {game.location.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="heading-6 text-gray-900 mb-4">Amenities</h4>
              <div className="space-y-3">
                <div
                  className={`flex items-center space-x-3 ${
                    game.location.parking ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                  <span>Parking Available</span>
                </div>
                <div
                  className={`flex items-center space-x-3 ${
                    game.location.restrooms ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Restrooms Available</span>
                </div>
                <div
                  className={`flex items-center space-x-3 ${
                    game.location.concessions
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Concessions Available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-4">
            <motion.a
              href={`#${game.sportType}-schedule`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center"
            >
              <svg
                className="mr-2 w-5 h-5"
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
              View Full Schedule
            </motion.a>
            <motion.a
              href={`#${game.sportType}-teams`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              View Teams
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GameDetail;
