import { motion } from "framer-motion";
import React from "react";
import { useGames } from "../../hooks/useGames";
import { LeagueInfo } from "../../types";
import Button from "../ui/Button";

interface MissionHeroProps {
  leagueInfo: LeagueInfo;
  onJoinClick?: () => void;
  className?: string;
}

const MissionHero: React.FC<MissionHeroProps> = ({
  leagueInfo,
  onJoinClick,
  className = "",
}) => {
  // Get completed games count from database
  const { games, loading: gamesLoading } = useGames();
  const completedGamesCount = games.filter(game => game.status === "completed").length;
  
  // Calculate years since May 14, 2024
  const foundedDate = new Date('2024-05-14');
  const currentDate = new Date();
  const yearsDifference = (currentDate.getTime() - foundedDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const yearsStrong = Math.floor(yearsDifference);
  
  const stats = [
    {
      label: "Active Members",
      value: leagueInfo.memberCount.toLocaleString(),
      icon: "👥",
    },
    {
      label: yearsStrong === 1 ? "Year Strong" : "Years Strong",
      value: yearsStrong,
      icon: "🏆",
    },
    {
      label: leagueInfo.seasonsCompleted === 1 ? "Season Completed" : "Seasons Completed",
      value: leagueInfo.seasonsCompleted,
      icon: "☄️",
    },
    {
      label: "Games Played",
      value: gamesLoading ? "Loading..." : completedGamesCount.toLocaleString(),
      icon: "🎯",
    },
  ];

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-brand-orange/10 to-transparent rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-brand-blue/10 to-transparent rounded-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Mission Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-8 mt-16 sm:mt-8"
          >
            <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium border border-white/30">
              Our Mission
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight"
          >
            Building Community Through{" "}
            <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              Inclusive Sports
            </span>
          </motion.h1>

          {/* Mission Statement */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed"
          >
            {leagueInfo.mission}
          </motion.p>

          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="large"
              onClick={onJoinClick}
              className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-dark text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Join Our Community
            </Button>

            <Button
              variant="outline"
              size="large"
              href="#learn-more"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionHero;
