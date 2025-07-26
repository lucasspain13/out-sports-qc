import { motion, useInView } from "framer-motion";
import React, { useRef, useState } from "react";
import { Testimonial } from "../../types";

interface CommunityTestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  className?: string;
}

const CommunityTestimonials: React.FC<CommunityTestimonialsProps> = ({
  testimonials,
  title = "What Our Community Says",
  subtitle = "Real stories from real members who make our league special",
  showFilters = true,
  className = "",
}) => {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "kickball" | "dodgeball"
  >("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (selectedFilter === "all") return true;
    return testimonial.sportType === selectedFilter;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("");
  };

  const getSportGradient = (sportType?: "kickball" | "dodgeball") => {
    if (sportType === "kickball")
      return "from-brand-orange to-brand-orange-light";
    if (sportType === "dodgeball") return "bg-gradient-primary";
    return "from-brand-blue to-brand-blue-light";
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      "Team Captain": "bg-brand-purple text-white",
      Player: "bg-brand-blue text-white",
      "Volunteer Referee": "bg-brand-blue text-white",
    };
    return (
      roleColors[role as keyof typeof roleColors] || "bg-gray-600 text-white"
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      prev =>
        (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length
    );
  };

  const visibleTestimonials = filteredTestimonials
    .slice(currentIndex, currentIndex + 3)
    .concat(
      filteredTestimonials.slice(
        0,
        Math.max(0, currentIndex + 3 - filteredTestimonials.length)
      )
    );

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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center space-x-4"
            >
              {[
                { key: "all", label: "All Sports", icon: "🏆" },
                { key: "kickball", label: "Kickball", icon: "☄️" },
                // Temporarily disabled - dodgeball coming soon
                // { key: "dodgeball", label: "Dodgeball", icon: "🏐" },
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setSelectedFilter(filter.key as any);
                    setCurrentIndex(0);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedFilter === filter.key
                      ? "bg-gradient-primary text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-blue transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          </div>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-brand-blue transition-colors"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Testimonials Grid */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-16"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${currentIndex}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="group"
              >
                {/* Testimonial Card */}
                <div className="h-full bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-4xl text-gray-200 group-hover:text-gray-300 transition-colors">
                    "
                  </div>

                  {/* Member Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getSportGradient(
                        testimonial.sportType
                      )} flex items-center justify-center text-white font-bold shadow-lg`}
                    >
                      {getInitials(testimonial.memberName)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.memberName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            testimonial.role
                          )}`}
                        >
                          {testimonial.role}
                        </span>
                        {testimonial.teamName && (
                          <span className="text-xs text-gray-500">
                            {testimonial.teamName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 relative z-10">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Member Details */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {testimonial.sportType && (
                        <span className="flex items-center space-x-1">
                          <span>
                            {testimonial.sportType === "kickball" ? "☄️" : "🏐"}
                          </span>
                          <span className="capitalize">
                            {testimonial.sportType}
                          </span>
                        </span>
                      )}
                      <span>Since {testimonial.memberSince}</span>
                    </div>
                    <span>{testimonial.location}</span>
                  </div>

                  {/* Decorative gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getSportGradient(
                      testimonial.sportType
                    )} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl`}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({
              length: Math.ceil(filteredTestimonials.length / 3),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / 3) === index
                    ? "bg-brand-blue scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Removed Bottom CTA - testimonials speak for themselves */}
      </div>
    </section>
  );
};

export default CommunityTestimonials;
