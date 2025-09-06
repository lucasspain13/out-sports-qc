import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { SubstituteRegistrationForm } from "../platform";

interface RegistrationDetails {
  sport: string;
  season: string;
  game_dates: string;
  game_time: string;
  location: string;
  deadline: string;
}

interface SubstituteRegistrationPageProps {
  sportType: "kickball" | "dodgeball";
  season?: "Summer 2025" | "Fall 2025" | string;
}

const SubstituteRegistrationPage: React.FC<SubstituteRegistrationPageProps> = ({ sportType, season }) => {
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
      gradient: "from-green-700 to-emerald-600",
      accent: "green-600",
      bg: "bg-gradient-to-br from-green-700 to-emerald-600",
    },
    dodgeball: {
      gradient: "from-green-700 to-emerald-600",
      accent: "green-600",
      bg: "bg-gradient-to-br from-green-700 to-emerald-600",
    },
  };

  const sportInfo = {
    kickball: {
      description:
        "Join our substitute pool and help keep games running smoothly! Perfect for flexible participation.",
      highlights: [
        "🏳️‍🌈 LGBTQ+ friendly environment",
        "📱 Get notified when teams need players",
        "🎯 All skill levels welcome",
        "⏰ Play when your schedule allows",
        "🤝 Meet different teams and players",
      ],
      gameDetails: registrationDetails ? {
        season: registrationDetails.season,
        sport: registrationDetails.sport,
        gameTime: registrationDetails.game_time,
        gameDates: registrationDetails.game_dates,
        location: registrationDetails.location,
        deadline: "Ongoing",
      } : {
        season: currentSeason,
        sport: "Kickball",
        gameTime: "Sundays 2-4pm",
        gameDates: currentSeason === "Summer 2025" ? "8 weeks" : "7 weeks",
        location: "TBD",
        deadline: "Ongoing",
      },
    },
    dodgeball: {
      description:
        "Be a dodgeball substitute! Fill in for teams when players can't make it and keep the games going.",
      highlights: [
        "🏳️‍🌈 LGBTQ+ friendly environment",
        "📱 Text notifications for sub opportunities",
        "⚡ Fast-paced and exciting",
        "🤝 Great for making friends",
        "💪 Perfect cardio workout",
      ],
      gameDetails: {
        season: "Winter 2026",
        gameDates: "TBD",
        gameTime: "TBD",
        location: "TBD",
        deadline: "Ongoing",
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
              <div className="text-6xl mb-6">🦸 {sportEmoji}</div>
              <h1 className="heading-1 mb-6">
                {currentSeason === "Fall 2025" ? "Fall" : currentSeason} {sportDisplayName} Substitute Registration
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

      {/* How Substitutes Work Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 text-gray-900 mb-4">
              How <span className="text-green-600">Substitutes</span> Work
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Flexible participation that helps keep games running when regular players can't make it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: "📱",
                title: "Get Notified",
                description:
                  "We'll text you when teams need substitutes, usually a few days before the game.",
              },
              {
                icon: "✋",
                title: "Choose When to Play",
                description:
                  "Respond to notifications when you're available. No pressure if you can't make it!",
              },
              {
                icon: "🎮",
                title: "Join the Game",
                description:
                  "Show up and play! Teams will welcome you and help you get integrated quickly.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="heading-4 text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="body-base text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Substitute Registration Form */}
            <div className="lg:col-span-2">
              <SubstituteRegistrationForm
                sportType={sportType}
                onSuccess={handleRegistrationSuccess}
              />
            </div>

            {/* Substitute Information Sidebar */}
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
                    Have questions about being a substitute? We're here to help!
                  </p>
                  <div className="space-y-2">
                    <div className="text-brand-blue font-medium">
                      Travis Stanger: <a 
                        href="tel:+15633810504"
                        className="underline hover:text-blue-800 transition-colors duration-200"
                      >
                        563-381-0504
                      </a>
                    </div>
                    <div className="text-brand-blue font-medium">
                      Admin Email: 
                      <a 
                        href="mailto:OutSportsQC@gmail.com"
                        className="ml-1 underline hover:text-blue-800 transition-colors duration-200"
                      >
                        OutSportsQC@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* What to Expect as a Sub */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`bg-gradient-to-br ${colors.gradient} text-white rounded-2xl shadow-lg p-6`}
              >
                <h3 className="heading-4 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🦸</span>
                  What to Expect as a Sub
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="opacity-90">
                    <strong>Flexible Schedule:</strong> You choose when to play! 
                    We'll send notifications when teams need subs, but no pressure to always say yes.
                  </p>
                  <p className="opacity-90">
                    <strong>Meet Different Teams:</strong> Experience playing with various teams 
                    and meet more people in the league community.
                  </p>
                  <p className="opacity-90">
                    <strong>Same Great Experience:</strong> Same welcoming atmosphere, 
                    same inclusive environment, just with more scheduling flexibility.
                  </p>
                  <p className="opacity-90">
                    <strong>Equipment Provided:</strong> All game equipment is still provided! 
                    Just bring yourself and a water bottle.
                  </p>
                </div>
              </motion.div>

              {/* Substitute Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="heading-4 text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">✨</span>
                  Substitute Benefits
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
              Why Be a{" "}
              <span className="text-green-600">{sportDisplayName} Substitute</span>?
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Help keep games running while enjoying flexible participation in our inclusive community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⏰",
                title: "Perfect Flexibility",
                description:
                  "Play when your schedule allows. No commitment to every game - just when you're available!",
              },
              {
                icon: "🤝",
                title: "Community Helper",
                description:
                  "Be the hero who keeps games going when teams are short players. You're making a real difference!",
              },
              {
                icon: "🌟",
                title: "Expanded Network",
                description:
                  "Meet more people by playing with different teams throughout the season.",
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

export default SubstituteRegistrationPage;
