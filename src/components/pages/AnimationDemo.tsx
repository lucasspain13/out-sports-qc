import { motion } from "framer-motion";
import React, { useState } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import {
  breathe,
  cardHover,
  fadeIn,
  fadeInUp,
  float,
  scaleIn,
  spin,
  staggerContainer,
  staggerFadeInUp,
} from "../../lib/animations";
import { AnimatedNav, Button, LoadingAnimation, PlayerCard } from "../ui";

interface AnimationDemoProps {
  className?: string;
}

const AnimationDemo: React.FC<AnimationDemoProps> = ({ className = "" }) => {
  const { ref: sectionRef, isInView } = useScrollAnimation();
  const [loadingType, setLoadingType] = useState<
    "spinner" | "dots" | "pulse" | "bounce"
  >("spinner");
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: "Home", active: true },
    { href: "#about", label: "About" },
    { href: "#animations", label: "Animations" },
    { href: "#contact", label: "Contact" },
  ];

  const samplePlayer = {
    id: "demo-1",
    name: "Alex Johnson",
    teamId: "team2",
    jerseyNumber: 10,
    sportType: "kickball" as const,
    quote:
      "Animation brings interfaces to life and creates memorable experiences!",
  };

  const animationCards = [
    {
      title: "Fade Animations",
      description: "Smooth fade transitions with directional movement",
      variant: fadeIn,
      color: "from-brand-teal to-brand-teal-dark",
    },
    {
      title: "Scale Effects",
      description: "Dynamic scaling with spring-like motion",
      variant: scaleIn,
      color: "from-brand-orange to-brand-orange-dark",
    },
    {
      title: "Hover Interactions",
      description: "Engaging micro-interactions on hover",
      variant: cardHover,
      color: "from-brand-purple to-brand-purple-dark",
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Animated Navigation */}
      <AnimatedNav
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
        links={navLinks}
      />

      {/* Hero Section with Floating Elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-purple to-brand-teal opacity-10" />

        {/* Floating Background Elements */}
        <motion.div
          variants={float}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-brand-teal/20 rounded-full blur-xl"
        />
        <motion.div
          variants={breathe}
          animate="animate"
          className="absolute top-40 right-20 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl"
        />
        <motion.div
          variants={spin}
          animate="animate"
          className="absolute bottom-20 left-20 w-16 h-16 border-4 border-brand-purple/30 rounded-full"
        />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-brand-teal via-brand-orange to-brand-purple bg-clip-text text-transparent">
              Enhanced Animations
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Experience smooth, professional animations that enhance user
            engagement and create delightful interactions throughout the
            application.
          </motion.p>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="primary" size="large">
              Explore Animations
            </Button>
            <Button variant="outline" size="large">
              View Components
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Animation Showcase */}
      <section ref={sectionRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2
              variants={staggerFadeInUp}
              className="text-4xl font-bold mb-6 text-gray-900"
            >
              Animation Categories
            </motion.h2>
            <motion.p
              variants={staggerFadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Each animation serves a purpose, from guiding attention to
              providing feedback and creating smooth transitions between states.
            </motion.p>
          </motion.div>

          {/* Animation Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {animationCards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={staggerFadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${card.color} relative`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Loading Animations Demo */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="bg-white rounded-2xl shadow-lg p-8 mb-16"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Loading States
            </h3>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["spinner", "dots", "pulse", "bounce"].map(type => (
                <button
                  key={type}
                  onClick={() => setLoadingType(type as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    loadingType === type
                      ? "bg-brand-teal text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <LoadingAnimation
                type={loadingType}
                size="large"
                color="primary"
                text="Loading your content..."
              />
            </div>
          </motion.div>

          {/* Interactive Components */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Enhanced Cards
              </h3>
              <PlayerCard
                player={samplePlayer}
                iscaptain={true}
                onClick={() => console.log("Player card clicked!")}
                showQuote={true}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Interactive Buttons
              </h3>
              <div className="space-y-4">
                <Button variant="primary" className="w-full">
                  Primary Action
                </Button>
                <Button variant="secondary" className="w-full">
                  Secondary Action
                </Button>
                <Button variant="outline" className="w-full">
                  Outlined Button
                </Button>
                <Button variant="primary" loading={true} className="w-full">
                  Loading State
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll-triggered Animations */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Scroll-Triggered Magic</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Elements animate as they come into view, creating an engaging
              storytelling experience as users scroll.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-teal to-brand-orange rounded-full flex items-center justify-center text-2xl font-bold"
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">
                  Feature {index + 1}
                </h3>
                <p className="text-gray-400">
                  Animated on scroll with staggered timing
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with final animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-brand-teal py-12 text-white text-center"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="text-3xl font-bold bg-gradient-to-r from-white via-brand-orange to-white bg-clip-text text-transparent inline-block"
          style={{ backgroundSize: "200% 200%" }}
        >
          Animations Complete! 🎉
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default AnimationDemo;
