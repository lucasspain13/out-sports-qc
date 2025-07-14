import { motion } from "framer-motion";
import React from "react";
import {
  dodgeballTeams,
  getTeamCaptain,
  kickballTeams,
} from "../../data/teams";
import { PlayerCard, TeamCard } from "../ui";

const TeamShowcase: React.FC = () => {
  // Get a sample of teams and players for showcase
  const sampleTeams = [
    kickballTeams[0], // Thunder Kickers
    dodgeballTeams[0], // Dodge Dynasty
    kickballTeams[1], // Rainbow Runners
    dodgeballTeams[1], // Teal Tornadoes
  ];

  // Get sample players (captains from each team)
  const samplePlayers = sampleTeams
    .map(team => getTeamCaptain(team))
    .filter(Boolean);

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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h4 className="heading-4 mb-4">Ready to Join a Team?</h4>
            <p className="body-base text-gray-600 mb-6">
              Connect with amazing players and become part of our inclusive
              sports community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">View All Teams</button>
              <button className="btn-outline">Register Now</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamShowcase;
