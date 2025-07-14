import { motion } from "framer-motion";
import React from "react";
import { Team } from "../../types";
import TeamCard from "../ui/TeamCard";

interface RosterOverviewProps {
  sportType: "kickball" | "dodgeball";
  teams: Team[];
  onTeamSelect?: (team: Team) => void;
}

const RosterOverview: React.FC<RosterOverviewProps> = ({
  sportType,
  teams,
  onTeamSelect,
}) => {
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="heading-4 text-gray-900 mb-4">
              Ready to Join the Action?
            </h3>
            <p className="body-base text-gray-600 mb-6">
              Sign up for the upcoming {sportDisplayName.toLowerCase()} season
              and become part of our amazing community!
            </p>
            <motion.a
              href="#signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              Join {sportDisplayName} League
              <svg
                className="ml-2 w-5 h-5"
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
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RosterOverview;
