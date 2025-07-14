import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { Timeline, TimelineMilestone } from "../../types";

interface FoundationStoryProps {
  timeline: Timeline;
  title?: string;
  className?: string;
}

const FoundationStory: React.FC<FoundationStoryProps> = ({
  timeline,
  title = "Our Journey",
  className = "",
}) => {
  const [selectedMilestone, setSelectedMilestone] =
    useState<TimelineMilestone | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getMilestoneIcon = (type: TimelineMilestone["type"]) => {
    const icons = {
      founding: "🚀",
      expansion: "📈",
      achievement: "🏆",
      community: "🤝",
      facility: "🏢",
    };
    return icons[type] || "📅";
  };

  const getMilestoneColor = (type: TimelineMilestone["type"]) => {
    const colors = {
      founding: "from-brand-orange to-brand-orange-light",
      expansion: "from-brand-teal to-brand-teal-light",
      achievement: "from-brand-purple to-brand-purple-light",
      community: "from-brand-blue to-brand-blue-light",
      facility: "from-gray-600 to-gray-500",
    };
    return colors[type] || "from-gray-600 to-gray-500";
  };

  const sortedMilestones = [...timeline.milestones].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  return (
    <section
      className={`py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}
      ref={ref}
    >
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to a thriving community - discover the
            milestones that shaped our league
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-orange via-brand-teal to-brand-purple transform md:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {sortedMilestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${getMilestoneColor(
                      milestone.type
                    )} flex items-center justify-center text-white text-sm font-bold shadow-lg cursor-pointer`}
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    {getMilestoneIcon(milestone.type)}
                  </motion.div>
                </div>

                {/* Content Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-5/12 ${
                    index % 2 === 0
                      ? "md:mr-auto md:pr-8"
                      : "md:ml-auto md:pl-8"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer"
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    {/* Date */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getMilestoneColor(
                          milestone.type
                        )} text-white`}
                      >
                        {milestone.month} {milestone.year}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {milestone.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Image placeholder */}
                    {milestone.image && (
                      <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          Image: {milestone.title}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Milestone Categories Legend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {Array.from(new Set(timeline.milestones.map(m => m.type))).map(
            type => (
              <div
                key={type}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getMilestoneColor(
                  type
                )} text-white text-sm font-medium`}
              >
                <span>{getMilestoneIcon(type)}</span>
                <span className="capitalize">{type}</span>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMilestone(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${getMilestoneColor(
                    selectedMilestone.type
                  )} flex items-center justify-center text-white text-xl`}
                >
                  {getMilestoneIcon(selectedMilestone.type)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedMilestone.title}
                  </h3>
                  <p className="text-gray-600">
                    {selectedMilestone.month} {selectedMilestone.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getMilestoneColor(
                  selectedMilestone.type
                )} text-white`}
              >
                {selectedMilestone.type.charAt(0).toUpperCase() +
                  selectedMilestone.type.slice(1)}
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {selectedMilestone.description}
              </p>

              {selectedMilestone.image && (
                <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">
                    Image: {selectedMilestone.title}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default FoundationStory;
