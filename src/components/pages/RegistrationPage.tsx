import { motion } from "framer-motion";
import React from "react";
import { PlatformRegistrationForm } from "../platform";

interface RegistrationPageProps {
  sportType: "kickball" | "dodgeball";
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ sportType }) => {
  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "⚽" : "🏐";

  const sportColors = {
    kickball: {
      gradient: "from-brand-orange to-brand-orange-light",
      accent: "brand-orange",
      bg: "bg-gradient-card-orange",
    },
    dodgeball: {
      gradient: "from-brand-purple to-brand-purple-light",
      accent: "brand-purple",
      bg: "bg-gradient-card-purple",
    },
  };

  const sportInfo = {
    kickball: {
      description:
        "Join our inclusive kickball league where everyone plays, everyone matters, and everyone has fun!",
      highlights: [
        "🏳️‍🌈 LGBTQ+ friendly environment",
        "🎯 All skill levels welcome",
        "🤝 Team-building focused",
        "🏆 Competitive yet supportive",
        "🎉 End-of-season celebration",
      ],
      gameDetails: {
        season: "Summer 2025",
        duration: "7 weeks",
        gameTime: "Sundays at 2pm",
        location: "Junge Park",
        teamSize: "10-16 players",
      },
    },
    dodgeball: {
      description:
        "Experience the thrill of dodgeball in a welcoming, inclusive community atmosphere!",
      highlights: [
        "🏳️‍🌈 LGBTQ+ friendly environment",
        "⚡ Fast-paced and exciting",
        "🤝 Great for making friends",
        "💪 Perfect cardio workout",
        "🎉 Post-game social activities",
      ],
      gameDetails: {
        season: "Winter 2025",
        duration: "6 weeks",
        gameTime: "Wednesdays at 7pm",
        location: "Community Center Gym",
        teamSize: "8-10 players",
      },
    },
  };

  const currentSport = sportInfo[sportType];
  const colors = sportColors[sportType];

  const handleRegistrationSuccess = () => {
    // Scroll to top or show success message
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`${colors.bg} relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />

          <div className="container-custom relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <div className="text-6xl mb-6">{sportEmoji}</div>
              <h1 className="heading-1 mb-6">
                {sportDisplayName} League Registration
              </h1>
              <p className="body-large mb-8 max-w-2xl mx-auto opacity-90">
                {currentSport.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {Object.entries(currentSport.gameDetails).map(
                  ([key, value]) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    >
                      <div className="text-lg font-semibold">{value}</div>
                      <div className="text-sm opacity-80 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <PlatformRegistrationForm
                sportType={sportType}
                onSuccess={handleRegistrationSuccess}
              />
            </div>

            {/* League Information Sidebar */}
            <div className="space-y-8">
              {/* League Highlights */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="heading-4 text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  League Highlights
                </h3>
                <ul className="space-y-3">
                  {currentSport.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-lg mr-3">
                        {highlight.split(" ")[0]}
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {highlight.substring(highlight.indexOf(" ") + 1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Season Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="heading-4 text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  Season Details
                </h3>
                <div className="space-y-4">
                  {Object.entries(currentSport.gameDetails).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium text-gray-600 capitalize text-sm">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </motion.div>

              {/* What to Expect */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`bg-gradient-to-br ${colors.gradient} text-white rounded-2xl shadow-lg p-6`}
              >
                <h3 className="heading-4 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  What to Expect
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="opacity-90">
                    <strong>After Registration:</strong> We'll send you a
                    welcome email with team assignments and first game details.
                  </p>
                  <p className="opacity-90">
                    <strong>Team Formation:</strong> Teams are balanced by
                    experience level to ensure fair and fun games.
                  </p>
                  <p className="opacity-90">
                    <strong>Equipment:</strong> All game equipment provided!
                    Just bring yourself and a water bottle.
                  </p>
                  <p className="opacity-90">
                    <strong>Weather Policy:</strong> Games continue rain or
                    shine, with indoor alternatives when needed.
                  </p>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="heading-4 text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💬</span>
                  Questions?
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    Have questions about the league? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:info@outsportsleague.com"
                      className="block text-brand-teal hover:text-brand-teal-dark font-medium transition-colors"
                    >
                      📧 info@outsportsleague.com
                    </a>
                    <a
                      href="#contact"
                      className="block text-brand-teal hover:text-brand-teal-dark font-medium transition-colors"
                    >
                      🌐 Contact Form
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-gray-900 mb-4">
              Why Join Our{" "}
              <span className="text-gradient-brand">{sportDisplayName}</span>{" "}
              League?
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              More than just a game - we're building a community where everyone
              belongs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏳️‍🌈",
                title: "Inclusive Community",
                description:
                  "A safe, welcoming space for LGBTQ+ individuals and allies to play and connect.",
              },
              {
                icon: "🎯",
                title: "All Skill Levels",
                description:
                  "From first-timers to experienced players - everyone plays, learns, and improves together.",
              },
              {
                icon: "🎉",
                title: "Social Events",
                description:
                  "Post-game hangouts, season parties, and community events to build lasting friendships.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="heading-4 text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="body-base text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
