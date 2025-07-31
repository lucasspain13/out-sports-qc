import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { PlatformRegistrationForm } from "../platform";

interface RegistrationDetails {
  sport: string;
  season: string;
  duration: string;
  game_time: string;
  location: string;
  team_size: string;
}

interface RegistrationPageProps {
  sportType: "kickball" | "dodgeball";
  season?: "Summer 2025" | "Fall 2025" | string;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ sportType, season }) => {
  const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
  
  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "☄️" : "🏐";

  // Determine season based on current route if season not provided
  const currentSeason = season || (() => {
    const currentRoute = window.location.hash;
    if (currentRoute.includes("fall-kickball")) return "Fall 2025";
    if (currentRoute.includes("summer-kickball")) return "Summer 2025";
    return "Fall 2025"; // Default fallback
  })();

  useEffect(() => {
    fetchRegistrationDetails();
  }, [sportType]);

  const fetchRegistrationDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("registration_details")
        .select("*")
        .eq("sport_type", sportType)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching registration details:", error);
        return;
      }
      
      if (data) {
        setRegistrationDetails(data);
      }
    } catch (error) {
      console.error("Error fetching registration details:", error);
    }
  };

  const sportColors = {
    kickball: {
      gradient: "from-amber-700 to-orange-600",
      accent: "brand-orange",
      bg: "bg-gradient-to-br from-amber-700 to-orange-600",
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
      gameDetails: registrationDetails ? {
        sport: registrationDetails.sport,
        season: registrationDetails.season,
        duration: registrationDetails.duration,
        gameTime: registrationDetails.game_time,
        location: registrationDetails.location,
        deadline: registrationDetails.team_size,
      } : {
        sport: "Kickball",
        season: currentSeason,
        duration: currentSeason === "Summer 2025" ? "8 weeks" : "7 weeks",
        gameTime: "Sundays 2-4pm",
        location: "TBD",
        deadline: "TBD",
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
        season: "Winter 2026",
        duration: "TBD",
        gameTime: "TBD",
        location: "TBD",
        deadline: "TBD",
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
                {currentSeason === "Fall 2025" ? "Fall" : currentSeason} {sportDisplayName} Registration
              </h1>
              <p className="body-large mb-8 max-w-2xl mx-auto opacity-90">
                {currentSport.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-6xl mx-auto">
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
              {/* Questions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
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
                    <div className="text-brand-blue font-medium">
                      Travis Stanger: 563-381-0504
                    </div>
                    <div className="text-brand-blue font-medium">
                      Admin Email: OutSportsQC@gmail.com
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* What to Expect */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`bg-gradient-to-br ${colors.gradient} text-white rounded-2xl shadow-lg p-6`}
              >
                <h3 className="heading-4 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  What to Expect
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="opacity-90">
                    <strong>After Registration:</strong> We'll send you a
                    welcome email with team assignments and first game details by August 13.
                  </p>
                  <p className="opacity-90">
                    <strong>Team Formation:</strong> Teams are formed randomly to encourage new friendships and maximize socializing opportunities across our community.
                  </p>
                  <p className="opacity-90">
                    <strong>Equipment:</strong> All game equipment provided!
                    Just bring yourself and a water bottle.
                  </p>
                  <p className="opacity-90">
                    <strong>Weather Policy:</strong> Games are on, rain or
                    shine! However, we will stop for lightning and severe weather.
                  </p>
                </div>
              </motion.div>

              {/* League Highlights */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
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
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="heading-4 text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">�</span>
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
