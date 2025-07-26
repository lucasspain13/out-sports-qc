import { motion } from "framer-motion";
import React from "react";
import { useTeamRecord } from "../../hooks/useTeamRecord";
import { Team } from "../../types";

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  showStats?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick, showStats = true }) => {
  // Use optimized hook to calculate team record
  const teamRecord = useTeamRecord(team.id);

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

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card-base card-hover cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`relative h-96 ${
          gradientClasses[team.gradient as keyof typeof gradientClasses] || gradientClasses.blue
        } p-6 flex flex-col justify-between text-white`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Header Content */}
        <div className="relative z-10">
          {/* Sport Type Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-4">
            {team.sportType === "kickball" ? "☄️" : "🏐"}{" "}
            {team.sportType.charAt(0).toUpperCase() + team.sportType.slice(1)}
          </div>

          {/* Team Name */}
          <h3 className="card-title mb-3 text-shadow">{team.name}</h3>

          {/* Description */}
          <p className="body-base text-white/90 text-shadow line-clamp-3">
            {team.description}
          </p>
        </div>

        {/* Footer Content */}
        <div className="relative z-10">
          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Player Count */}
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>{team.players.length} players</span>
              </div>

              {/* Founded Year */}
              <div className="flex items-center space-x-1">
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
                <span>Est. {team.founded}</span>
              </div>
            </div>

            {/* Win/Loss Record */}
            {showStats && (
              <div className="text-right">
                <div className="text-xs text-white/70">Record</div>
                <div className="font-medium">
                  {teamRecord.wins}W - {teamRecord.losses}L
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hover Arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-6 right-6 text-white/70 group-hover:text-white"
        >
          <svg
            className="w-6 h-6"
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

export default TeamCard;
