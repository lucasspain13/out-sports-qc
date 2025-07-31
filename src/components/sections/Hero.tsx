import { motion } from "framer-motion";
import React from "react";
import { HeroSectionProps } from "../../types";
import { AnnouncementBanner } from "../ui/AnnouncementBanner";
import Button from "../ui/Button";

const Hero: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-safe">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Background Image Overlay */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Season Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6 mt-16 sm:mt-8"
          >
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              Season 2025
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="heading-1 mb-6 text-shadow-lg"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="body-large mb-10 text-white/90 max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant={primaryCTA.variant}
              size="large"
              href={primaryCTA.href}
              onClick={primaryCTA.onClick}
              className="w-full sm:w-auto"
            >
              {primaryCTA.text}
            </Button>

            {secondaryCTA && (
              <Button
                variant={secondaryCTA.variant}
                size="large"
                href={secondaryCTA.href}
                onClick={secondaryCTA.onClick}
                className="w-full sm:w-auto"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Announcement Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-20 left-4 right-4 sm:left-8 sm:right-8 lg:left-12 lg:right-12 xl:left-24 xl:right-24 z-30"
      >
        <AnnouncementBanner
          className="rounded-lg shadow-lg"
          maxHeight="160px"
          showPriority={true}
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
