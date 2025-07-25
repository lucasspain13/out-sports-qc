import { motion } from "framer-motion";
import React from "react";
import { SportCardProps } from "../../types";

const SportCard: React.FC<SportCardProps> = ({ sport, onClick }) => {
  const gradientClasses = {
    orange: "bg-gradient-card-orange",
    teal: "bg-gradient-card-teal",
    blue: "bg-gradient-card-blue",
    purple: "bg-gradient-card-purple",
  };

  const handleClick = () => {
    if (sport.comingSoon) {
      // Don't navigate if coming soon
      return;
    }
    onClick?.();
  };

  return (
    <motion.div
      whileHover={sport.comingSoon ? {} : { scale: 1.05, y: -8 }}
      whileTap={sport.comingSoon ? {} : { scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`card-base ${
        sport.comingSoon ? "opacity-70" : "card-hover cursor-pointer"
      } group relative`}
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
        } p-6 sm:p-8 flex flex-col justify-end text-white ${
          sport.comingSoon ? "cursor-not-allowed" : ""
        }`}
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
          <h3 className="card-title mb-3 text-shadow">
            {sport.title || sport.name}
          </h3>

          {/* Description */}
          <p className="body-base mb-4 text-white/90 text-shadow">
            {sport.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            {sport.participants && (
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

          {/* Features */}
          {sport.features && sport.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-wrap gap-2">
                {sport.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
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
