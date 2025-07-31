import { motion } from "framer-motion";
import React from "react";
import { SportCardProps } from "../../types";
import { navigateTo } from "../../lib/navigation";

const SportCard: React.FC<SportCardProps> = ({ sport, onClick }) => {
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

  const handleClick = () => {
    if (sport.comingSoon) {
      // Navigate to registration page for coming soon sports
      navigateTo("#registration");
      return;
    }
    onClick?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`card-base card-hover cursor-pointer group relative ${
        sport.comingSoon ? "opacity-90" : ""
      }`}
      onClick={handleClick}
    >
      {/* Coming Soon Badge */}
      {sport.comingSoon && (
        <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          Coming Soon
        </div>
      )}

      <div
        className={`relative h-80 sm:h-96 ${
          gradientClasses[sport.gradient]
        } p-6 sm:p-8 flex flex-col justify-end text-white`}
      >
        {/* Background Pattern/Image */}
        {sport.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{ backgroundImage: `url(${sport.image})` }}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10">
          {/* Sport Name */}
          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white drop-shadow-lg">
            {sport.title || sport.name}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base mb-4 text-white/95 drop-shadow-md leading-relaxed">
            {sport.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            {sport.participants && sport.participants > 0 && (
              <div className="flex items-center space-x-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span>{sport.participants} players</span>
              </div>
            )}

            {sport.nextGame && (
              <div className="text-right">
                <div className="text-xs text-white/70">Next Game</div>
                <div className="font-medium">
                  {sport.nextGame.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hover Arrow - Hidden for coming soon */}
        {!sport.comingSoon && (
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
        )}
      </div>
    </motion.div>
  );
};

export default SportCard;
