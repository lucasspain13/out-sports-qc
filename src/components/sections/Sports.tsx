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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
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

        {/* Simplified CTA - removed redundant join messaging */}
      </div>
    </section>
  );
};

export default Sports;
