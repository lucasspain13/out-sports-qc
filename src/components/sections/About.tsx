import { motion } from "framer-motion";
import React from "react";
import { AboutSectionProps } from "../../types";

const About: React.FC<AboutSectionProps> = ({
  title,
  content,
  features,
  image,
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
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-gray-900 mb-6">{title}</h2>
            <p className="body-large text-gray-600 mb-8 leading-relaxed">
              {content}
            </p>

            {/* Features Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6"
            >
              {features.map(feature => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xl">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="heading-6 text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="body-base text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="About Out Sports League"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl" />
              </div>
            ) : (
              <div className="w-full h-96 lg:h-[500px] bg-gradient-primary rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="heading-4 mb-2">Community First</h3>
                  <p className="body-base opacity-90">
                    Building connections through sports
                  </p>
                </div>
              </div>
            )}

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-brand mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-brand mb-1">
                  4
                </div>
                <div className="text-sm text-gray-600">Years Running</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
