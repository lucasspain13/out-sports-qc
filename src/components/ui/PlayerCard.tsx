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
  const getTeamGradient = (teamId: string): "orange" | "green" | "blue" | "pink" | "white" | "black" | "gray" | "brown" | "purple" | "yellow" | "red" | "cyan" => {
    if (teamId.includes("team1")) return "orange";
    if (teamId.includes("team2")) return "green";
    if (teamId.includes("team3")) return "blue";
    if (teamId.includes("team4")) return "pink";
    // For additional teams beyond the current 4
    if (teamId.includes("team5")) return "white";
    if (teamId.includes("team6")) return "black";
    if (teamId.includes("team7")) return "gray";
    if (teamId.includes("team8")) return "brown";
    if (teamId.includes("team9")) return "purple";
    if (teamId.includes("team10")) return "yellow";
    if (teamId.includes("team11")) return "red";
    if (teamId.includes("team12")) return "cyan";
    return "green"; // fallback
  };

  const getGradientStyle = (gradient: string) => {
    const gradientMap = {
      orange: "from-brand-orange to-brand-orange-dark",
      green: "from-brand-green to-brand-green-dark",
      blue: "from-brand-blue to-brand-blue-dark",
      pink: "from-brand-pink to-brand-pink-dark",
      white: "from-brand-white to-brand-white-dark",
      black: "from-brand-black to-brand-black-dark",
      gray: "from-brand-gray to-brand-gray-dark",
      brown: "from-brand-brown to-brand-brown-dark",
      purple: "from-brand-purple to-brand-purple-dark",
      yellow: "from-brand-yellow to-brand-yellow-dark",
      red: "from-brand-red to-brand-red-dark",
      cyan: "from-brand-cyan to-brand-cyan-dark",
    };
    return gradientMap[gradient as keyof typeof gradientMap] || gradientMap.green;
  };

  const getLinearGradientStyle = (teamColor: string): React.CSSProperties => {
    const gradients = {
      red: { from: "#e53e3e", to: "#c53030" },
      blue: { from: "#3498DB", to: "#2980B9" }, // Updated to match new blue
      green: { from: "#2ECC71", to: "#27AE60" }, // Updated to match new green
      orange: { from: "#fd7f28", to: "#dd6b20" },
      purple: { from: "#9c4221", to: "#8b3a1f" },
      yellow: { from: "#ffd23f", to: "#f6ad55" },
      pink: { from: "#E91E63", to: "#C2185B" }, // Updated to match new pink
      gray: { from: "#a0aec0", to: "#718096" },
      cyan: { from: "#00d4aa", to: "#00a085" },
      lime: { from: "#84cc16", to: "#65a30d" },
      indigo: { from: "#6366f1", to: "#4f46e5" },
      teal: { from: "#14b8a6", to: "#0f766e" },
      white: { from: "#f9fafb", to: "#e5e7eb" },
      black: { from: "#374151", to: "#1f2937" },
      brown: { from: "#a16207", to: "#78350f" },
    };

    const gradient = gradients[teamColor.toLowerCase() as keyof typeof gradients] || gradients.gray;
    
    return {
      background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
    };
  };

  const teamGradient = getTeamGradient(player.teamId);

  const gradientClasses = {
    orange: "bg-gradient-to-br from-brand-orange/20 to-brand-orange-dark/30",
    green: "bg-gradient-to-br from-brand-green/20 to-brand-green-dark/30",
    blue: "bg-gradient-to-br from-brand-blue/20 to-brand-blue-dark/30",
    pink: "bg-gradient-to-br from-brand-pink/20 to-brand-pink-dark/30",
    white: "bg-gradient-to-br from-brand-white/20 to-brand-white-dark/30",
    black: "bg-gradient-to-br from-brand-black/20 to-brand-black-dark/30",
    gray: "bg-gradient-to-br from-brand-gray/20 to-brand-gray-dark/30",
    brown: "bg-gradient-to-br from-brand-brown/20 to-brand-brown-dark/30",
    purple: "bg-gradient-to-br from-brand-purple/20 to-brand-purple-dark/30",
    yellow: "bg-gradient-to-br from-brand-yellow/20 to-brand-yellow-dark/30",
    red: "bg-gradient-to-br from-brand-red/20 to-brand-red-dark/30",
    cyan: "bg-gradient-to-br from-brand-cyan/20 to-brand-cyan-dark/30",
  };

  const accentClasses = {
    orange: "border-brand-orange text-brand-orange bg-brand-orange/10",
    green: "border-brand-green text-brand-green bg-brand-green/10",
    blue: "border-brand-blue text-brand-blue bg-brand-blue/10",
    pink: "border-brand-pink text-brand-pink bg-brand-pink/10",
    white: "border-gray-600 text-gray-600 bg-gray-100/10",
    black: "border-gray-800 text-gray-800 bg-gray-800/10",
    gray: "border-gray-500 text-gray-500 bg-gray-500/10",
    brown: "border-amber-700 text-amber-700 bg-amber-700/10",
    purple: "border-purple-600 text-purple-600 bg-purple-600/10",
    yellow: "border-yellow-600 text-yellow-600 bg-yellow-600/10",
    red: "border-red-600 text-red-600 bg-red-600/10",
    cyan: "border-cyan-500 text-cyan-500 bg-cyan-500/10",
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
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradientStyle(teamGradient)} flex items-center justify-center text-white font-bold text-xl shadow-lg relative overflow-hidden`}
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
              Player #{player.jerseyNumber}
            </motion.p>
          </div>
        </div>

        {/* Quote */}
        {showQuote && player.quote && (
          <motion.blockquote
            className="text-sm text-gray-600 italic border-l-4 border-brand-blue/20 pl-4 mt-4"
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
            background: getLinearGradientStyle(teamGradient).background,
            transformOrigin: "left",
          }}
        />
      </div>
    </motion.div>
  );
};

export default PlayerCard;
