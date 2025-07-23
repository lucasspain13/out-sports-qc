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

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
      }}
      whileTap={{ scale: 0.98 }}
      className={`card-base cursor-pointer group relative overflow-hidden ${
        showQuote ? "h-auto" : "h-32"
      }`}
      onClick={onClick}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 ${gradientClasses[teamGradient]} opacity-0`}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating background elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div
        className="relative z-10 p-6 h-full bg-white"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
        }}
      >
        {/* Captain badge */}
        {iscaptain && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 },
            }}
            className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold border-2 ${accentClasses[teamGradient]}`}
          >
            ⭐ CAPTAIN
          </motion.div>
        )}

        <div className="flex items-center mb-4">
          {/* Avatar */}
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${
              teamGradient === "orange"
                ? "from-brand-orange to-brand-orange-dark"
                : teamGradient === "teal"
                ? "from-brand-teal to-brand-teal-dark"
                : teamGradient === "blue"
                ? "from-brand-blue to-brand-blue-dark"
                : "from-brand-purple to-brand-purple-dark"
            } flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden`}
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 },
            }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />

            <span className="relative z-10">
              {player.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </motion.div>

          <div className="ml-4 flex-1">
            <motion.h3
              className="font-semibold text-gray-900 text-lg"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {player.name}
            </motion.h3>

            <motion.p
              className="text-sm font-medium text-gray-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Player #{player.id}
            </motion.p>
          </div>
        </div>

        {/* Quote */}
        {showQuote && player.quote && (
          <motion.blockquote
            className="text-sm text-gray-600 italic border-l-4 border-brand-teal/20 pl-4 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            "{player.quote}"
          </motion.blockquote>
        )}

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background:
              teamGradient === "orange"
                ? "linear-gradient(90deg, #ff6b35, #f39c12)"
                : teamGradient === "teal"
                ? "linear-gradient(90deg, #4ecdc4, #16a085)"
                : teamGradient === "blue"
                ? "linear-gradient(90deg, #3498db, #2980b9)"
                : "linear-gradient(90deg, #9b59b6, #8e44ad)",
            transformOrigin: "left",
          }}
        />
      </div>
    </motion.div>
  );
};

export default PlayerCard;
