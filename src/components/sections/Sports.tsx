import { motion } from "framer-motion";
import React from "react";
import { SportInfo } from "../../types";
import SportCard from "../ui/SportCard";

interface SportsProps {
  sports: (SportInfo & { onClick?: () => void })[];
}

const Sports: React.FC<SportsProps> = ({ sports }) => {
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
          <h2 className="heading-2 text-gray-900 mb-4">
            Choose Your <span className="text-gradient-brand">Sport</span>
          </h2>
          <p className="body-large text-gray-600 max-w-2xl mx-auto">
            Join our inclusive community and discover the joy of competitive
            sports in a welcoming environment where everyone belongs.
          </p>
        </motion.div>

        {/* Sports Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {sports.map(sport => (
            <motion.div
              key={sport.name}
              variants={itemVariants}
              className="stagger-item"
            >
              <SportCard
                sport={sport}
                onClick={
                  sport.onClick ||
                  (() => {
                    // Fallback handler
                    console.log(`Clicked on ${sport.name}`);
                  })
                }
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
          <p className="body-base text-gray-600 mb-6">
            Ready to join the fun? Sign up for the upcoming season!
          </p>
          <motion.a
            href="#signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center"
          >
            Join a Team
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
        </motion.div>
      </div>
    </section>
  );
};

export default Sports;
