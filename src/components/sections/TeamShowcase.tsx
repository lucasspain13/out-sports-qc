import { motion } from "framer-motion";
import React from "react";
import { useTeams } from "../../hooks/useTeams";
import { PlayerCard, TeamCard } from "../ui";

const TeamShowcase: React.FC = () => {
  const { teams: kickballTeams, loading: loadingKickball } =
    useTeams("kickball");
  const { teams: dodgeballTeams, loading: loadingDodgeball } =
    useTeams("dodgeball");

  const loading = loadingKickball || loadingDodgeball;

  // Get a sample of teams and players for showcase
  const sampleTeams = [
    kickballTeams[0], // Thunder Kickers
    dodgeballTeams[0], // Dodge Dynasty
    kickballTeams[1], // Rainbow Runners
    dodgeballTeams[1], // Teal Tornadoes
  ].filter(Boolean); // Remove undefined teams

  // Get sample players (captains from each team)
  const samplePlayers = sampleTeams
    .map(team =>
      team?.captain
        ? team.players.find(player => player.id === team.captain)
        : null
    )
    .filter(Boolean);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="heading-2 mb-6"
          >
            Meet Our Teams & Players
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="body-large text-gray-600 max-w-3xl mx-auto"
          >
            Discover the amazing teams and talented players that make our league
            special. Each team brings their own unique energy and competitive
            spirit to the field.
          </motion.p>
        </div>

        {/* Teams Grid */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="heading-3 text-center mb-12"
          >
            Featured Teams
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sampleTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TeamCard
                  team={team}
                  onClick={() => console.log(`Clicked team: ${team.name}`)}
                  showStats={true}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Players Grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="heading-3 text-center mb-12"
          >
            Team Captains
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {samplePlayers.map((player, index) => (
              <motion.div
                key={player!.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PlayerCard
                  player={player!}
                  iscaptain={true}
                  onClick={() => console.log(`Clicked player: ${player!.name}`)}
                  showQuote={true}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compact Player Cards Demo */}
        <div className="mt-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="heading-3 text-center mb-12"
          >
            Compact Player View
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleTeams[0].players.slice(0, 6).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <PlayerCard
                  player={player}
                  iscaptain={player.id === sampleTeams[0].captain}
                  onClick={() => console.log(`Clicked player: ${player.name}`)}
                  showQuote={false}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View More Teams Link - Simple, non-redundant CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline inline-flex items-center"
            onClick={() => console.log("Navigate to full roster")}
          >
            View All Teams
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
      </div>
    </section>
  );
};

export default TeamShowcase;
