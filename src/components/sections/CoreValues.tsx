import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { CoreValue } from "../../types";

interface CoreValuesProps {
  values: CoreValue[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const CoreValues: React.FC<CoreValuesProps> = ({
  values,
  title = "Our Core Values",
  subtitle = "The principles that guide everything we do",
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getValueGradient = (index: number) => {
    const gradients = [
      "from-brand-orange to-brand-orange-light",
      "bg-gradient-primary",
      "from-brand-blue to-brand-blue-light",
      "from-brand-purple to-brand-purple-light",
      "from-brand-orange to-brand-blue",
    ];
    return gradients[index % gradients.length];
  };

  const getValueAccent = (index: number) => {
    const accents = [
      "border-brand-orange/20 bg-brand-orange/5",
      "border-brand-blue/20 bg-brand-blue/5",
      "border-brand-blue/20 bg-brand-blue/5",
      "border-brand-purple/20 bg-brand-purple/5",
      "border-brand-orange/20 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5",
    ];
    return accents[index % accents.length];
  };

  return (
    <section className={`py-20 bg-white ${className}`} ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 },
              }}
              className={`relative group cursor-pointer`}
            >
              {/* Card */}
              <div
                className={`h-full bg-white rounded-2xl p-8 border-2 ${getValueAccent(
                  index
                )} shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-opacity-40`}
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${getValueGradient(
                      index
                    )} flex items-center justify-center text-3xl shadow-lg`}
                  >
                    {value.icon}
                  </motion.div>

                  {/* Floating background element */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5,
                    }}
                    className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${getValueGradient(
                      index
                    )} opacity-20 -z-10`}
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                    {value.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {value.description}
                  </p>
                </div>

                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getValueGradient(
                    index
                  )} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                />
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${getValueGradient(
                  index
                )} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
              />

              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-br ${getValueGradient(
                  index
                )} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>

        {/* Removed Bottom CTA - core values section should focus on values */}
      </div>
    </section>
  );
};

export default CoreValues;
