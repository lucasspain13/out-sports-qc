import { motion } from "framer-motion";
import React from "react";
import { useTeams } from "../../hooks/useTeams";
import { Team } from "../../types";
import TeamCard from "../ui/TeamCard";

interface RosterOverviewProps {
  sportType: "kickball" | "dodgeball";
  onTeamSelect?: (team: Team) => void;
}

const RosterOverview: React.FC<RosterOverviewProps> = ({
  sportType,
  onTeamSelect,
}) => {
  const { teams, loading, error } = useTeams(sportType);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "⚽" : "🏐";

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Loading {sportDisplayName.toLowerCase()} teams...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="heading-1 text-gray-900 mb-4">
              Error Loading Teams
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 mb-6">
            <span className="text-2xl mr-2">{sportEmoji}</span>
            <span className="text-sm font-medium text-gray-600">
              {sportDisplayName} League
            </span>
          </div>

          <h1 className="heading-1 text-gray-900 mb-4">
            {sportDisplayName}{" "}
            <span className="text-gradient-brand">Teams</span>
          </h1>

          <p className="body-large text-gray-600 max-w-2xl mx-auto">
            Meet our incredible {sportDisplayName.toLowerCase()} teams! Each
            team brings their unique style, energy, and competitive spirit to
            the league. Click on any team to explore their roster and learn more
            about the players.
          </p>

          {/* League Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {teams.length}
              </div>
              <div className="text-sm text-gray-600">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {teams.reduce((total, team) => total + team.players.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient-brand mb-1">
                {teams.reduce((total, team) => total + team.wins, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Wins</div>
            </div>
          </div>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {teams.map(team => (
            <motion.div
              key={team.id}
              variants={itemVariants}
              className="stagger-item"
            >
              <TeamCard
                team={team}
                onClick={() => onTeamSelect?.(team)}
                showStats={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Removed redundant Call to Action - user can use main navigation to signup */}
      </div>
    </section>
  );
};

export default RosterOverview;
