import { motion } from "framer-motion";
import React from "react";
import { useMultipleTeamRecords } from "../../hooks/useTeamRecord";
import { Team } from "../../types";
import TeamCard from "../ui/TeamCard";

interface TeamRosterProps {
  title?: string;
  subtitle?: string;
  teams: Team[];
  sportType?: "kickball" | "dodgeball";
  onTeamSelect?: (team: Team) => void;
  showStats?: boolean;
  maxTeams?: number;
  className?: string;
}

const TeamRoster: React.FC<TeamRosterProps> = ({
  title,
  subtitle,
  teams,
  sportType,
  onTeamSelect,
  showStats = true,
  maxTeams,
  className = "",
}) => {
  // Use optimized hook to calculate team records for all teams
  const teamRecords = useMultipleTeamRecords(teams.map(team => team.id));

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

  // Filter teams by sport type if specified
  const filteredTeams = sportType
    ? teams.filter(team => team.sportType === sportType)
    : teams;

  // Limit teams if maxTeams is specified
  const displayTeams = maxTeams
    ? filteredTeams.slice(0, maxTeams)
    : filteredTeams;

  const sportEmoji =
    sportType === "kickball" ? "☄️" : sportType === "dodgeball" ? "🏐" : "🏆";
  const sportDisplayName = sportType
    ? sportType.charAt(0).toUpperCase() + sportType.slice(1)
    : "League";

  // Default title and subtitle if not provided
  const defaultTitle = title || `${sportDisplayName} Teams`;
  const defaultSubtitle =
    subtitle ||
    `Meet our incredible ${
      sportType ? sportDisplayName.toLowerCase() : ""
    } teams! Each team brings their unique style, energy, and competitive spirit to the league.`;

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {sportType && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 mb-6">
              <span className="text-2xl mr-2">{sportEmoji}</span>
              <span className="text-sm font-medium text-gray-600">
                {sportDisplayName} League
              </span>
            </div>
          )}

          <h2 className="heading-2 text-gray-900 mb-4">
            {defaultTitle.includes("Teams") ? (
              <>
                {defaultTitle.replace(" Teams", "")}{" "}
                <span className="text-gradient-brand">Teams</span>
              </>
            ) : (
              defaultTitle
            )}
          </h2>

          <p className="body-large text-gray-600 max-w-2xl mx-auto">
            {defaultSubtitle}
          </p>

          {/* Quick Stats */}
          {displayTeams.length > 0 && (
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-brand mb-1">
                  {displayTeams.length}
                </div>
                <div className="text-sm text-gray-600">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-brand mb-1">
                  {displayTeams.reduce(
                    (total, team) => total + team.players.length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
              {showStats && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient-brand mb-1">
                    {displayTeams.reduce((total, team) => {
                      const record = teamRecords[team.id];
                      return total + (record?.wins || 0);
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Wins</div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Teams Grid */}
        {displayTeams.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {displayTeams.map(team => (
              <motion.div
                key={team.id}
                variants={itemVariants}
                className="stagger-item"
              >
                <TeamCard
                  team={team}
                  onClick={() => onTeamSelect?.(team)}
                  showStats={showStats}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="heading-4 text-gray-900 mb-2">No Teams Found</h3>
            <p className="body-base text-gray-600">
              {sportType
                ? `No ${sportDisplayName.toLowerCase()} teams are currently available.`
                : "No teams are currently available."}
            </p>
          </motion.div>
        )}

        {/* View More Link */}
        {maxTeams && filteredTeams.length > maxTeams && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline inline-flex items-center"
              onClick={() => {
                // This could trigger navigation to full roster view
                console.log(`View all ${sportDisplayName} teams`);
              }}
            >
              View All {filteredTeams.length} Teams
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
            </motion.button>
          </motion.div>
        )}

        {/* Call to Action - Only show if it's NOT a preview/limited view */}
        {!maxTeams && displayTeams.length > 0 && (
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
                Sign up for the upcoming{" "}
                {sportType ? sportDisplayName.toLowerCase() : ""} season and
                become part of our amazing community!
              </p>
              <motion.a
                href="#signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center"
              >
                Join {sportType ? `${sportDisplayName} League` : "the League"}
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
        )}
      </div>
    </section>
  );
};

export default TeamRoster;
