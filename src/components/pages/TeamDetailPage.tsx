import { motion } from "framer-motion";
import React from "react";
import { Player, Team } from "../../types";
import PlayerCard from "../ui/PlayerCard";

interface TeamDetailPageProps {
  team: Team;
  onBack?: () => void;
  onPlayerSelect?: (player: Player) => void;
}

const TeamDetailPage: React.FC<TeamDetailPageProps> = ({
  team,
  onBack,
  onPlayerSelect,
}) => {
  const captain = team.captain
    ? team.players.find(player => player.id === team.captain)
    : undefined;

  const gradientClasses = {
    orange: "bg-gradient-card-orange",
    teal: "bg-gradient-card-teal",
    blue: "bg-gradient-card-blue",
    purple: "bg-gradient-card-purple",
  };

  const accentClasses = {
    orange: "border-brand-orange text-brand-orange bg-brand-orange/10",
    teal: "border-brand-teal text-brand-teal bg-brand-teal/10",
    blue: "border-brand-blue text-brand-blue bg-brand-blue/10",
    purple: "border-brand-purple text-brand-purple bg-brand-purple/10",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const sportEmoji = team.sportType === "kickball" ? "⚽" : "🏐";
  const sportDisplayName =
    team.sportType.charAt(0).toUpperCase() + team.sportType.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`${gradientClasses[team.gradient]} relative`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />

          <div className="container-custom relative z-10 py-20">
            {/* Back Button */}
            {onBack && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={onBack}
                className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
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
                Back to {sportDisplayName} Teams
              </motion.button>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Team Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Sport Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white mb-6">
                  <span className="text-xl mr-2">{sportEmoji}</span>
                  <span className="text-sm font-medium">
                    {sportDisplayName} Team
                  </span>
                </div>

                {/* Team Name */}
                <h1 className="heading-1 text-white mb-4 text-shadow">
                  {team.name}
                </h1>

                {/* Team Description */}
                <p className="body-large text-white/90 mb-6 text-shadow">
                  {team.description}
                </p>

                {/* Team Motto */}
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Team Motto
                  </h3>
                  <p className="text-white/95 italic text-lg">"{team.motto}"</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">
                      {team.players.length}
                    </div>
                    <div className="text-sm text-white/80">Players</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">
                      Est. {team.founded}
                    </div>
                    <div className="text-sm text-white/80">Founded</div>
                  </div>
                </div>
              </motion.div>

              {/* Team Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-2xl"
              >
                <h3 className="heading-4 text-gray-900 mb-6">
                  Team Statistics
                </h3>

                {/* Win/Loss Record */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Season Record</span>
                    <span className="font-semibold text-gray-900">
                      {team.wins}W - {team.losses}L
                    </span>
                  </div>

                  {/* Win Percentage Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        gradientClasses[team.gradient]
                      }`}
                      style={{
                        width: `${
                          (team.wins / (team.wins + team.losses)) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {Math.round((team.wins / (team.wins + team.losses)) * 100)}%
                    Win Rate
                  </div>
                </div>

                {/* Captain Info */}
                {captain && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Team Captain
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full ${
                          accentClasses[team.gradient]
                        } flex items-center justify-center font-bold border-2`}
                      >
                        {captain.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {captain.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          #{captain.jerseyNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Players Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-2 text-gray-900 mb-4">
              Meet the <span className="text-gradient-brand">Team</span>
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Get to know the amazing players who make {team.name} such a
              formidable team. Each player brings their unique skills and
              personality to create our winning chemistry.
            </p>
          </motion.div>

          {/* Players Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {team.players.map(player => (
              <motion.div
                key={player.id}
                variants={itemVariants}
                className="stagger-item"
              >
                <PlayerCard
                  player={player}
                  iscaptain={player.id === team.captain}
                  onClick={() => onPlayerSelect?.(player)}
                  showQuote={true}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Removed redundant Team Action CTA - keeping focus on team details */}
        </div>
      </section>
    </div>
  );
};

export default TeamDetailPage;
