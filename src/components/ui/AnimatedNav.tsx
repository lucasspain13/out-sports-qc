import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AnimatedNavProps {
  isOpen: boolean;
  onToggle: () => void;
  links: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
}

const AnimatedNav: React.FC<AnimatedNavProps> = ({
  isOpen,
  onToggle,
  links,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      backdropFilter: "blur(0px)",
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
    },
    visible: {
      backgroundColor: scrolled
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0)",
      backdropFilter: scrolled ? "blur(10px)" : "blur(0px)",
      boxShadow: scrolled
        ? "0 4px 20px -4px rgba(0, 0, 0, 0.1)"
        : "0 0 0 0 rgba(0, 0, 0, 0)",
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const hamburgerVariants = {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 180,
    },
  };

  const topLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: 45,
      y: 6,
    },
  };

  const middleLineVariants = {
    closed: {
      opacity: 1,
    },
    open: {
      opacity: 0,
    },
  };

  const bottomLineVariants = {
    closed: {
      rotate: 0,
      y: 0,
    },
    open: {
      rotate: -45,
      y: -6,
    },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-bold text-brand-teal"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="bg-gradient-to-r from-brand-teal via-brand-orange to-brand-purple bg-clip-text text-transparent"
            style={{ backgroundSize: "200% 200%" }}
          >
            Out Sports
          </motion.span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={`relative py-2 px-1 text-sm font-medium transition-colors duration-200 ${
                link.active
                  ? "text-brand-teal"
                  : scrolled
                  ? "text-gray-700 hover:text-brand-teal"
                  : "text-white hover:text-brand-teal"
              }`}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.33, 1, 0.68, 1],
                },
              }}
            >
              {link.label}

              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal to-brand-orange origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              />

              {/* Active indicator */}
              {link.active && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal to-brand-orange"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                />
              )}
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          variants={hamburgerVariants}
          animate={isOpen ? "open" : "closed"}
          onClick={onToggle}
          className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.line
              variants={topLineVariants}
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              stroke={scrolled ? "#1f2937" : "#ffffff"}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ originX: "50%", originY: "50%" }}
            />
            <motion.line
              variants={middleLineVariants}
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              stroke={scrolled ? "#1f2937" : "#ffffff"}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.line
              variants={bottomLineVariants}
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              stroke={scrolled ? "#1f2937" : "#ffffff"}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ originX: "50%", originY: "50%" }}
            />
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg rounded-2xl mt-4 border border-gray-200 shadow-xl"
          >
            <div className="p-6 space-y-4">
              {links.map(link => (
                <motion.a
                  key={link.href}
                  variants={linkVariants}
                  href={link.href}
                  className={`block py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    link.active
                      ? "bg-brand-teal text-white"
                      : "text-gray-700 hover:bg-brand-teal/10 hover:text-brand-teal"
                  }`}
                  onClick={onToggle}
                  whileHover={{
                    x: 8,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center">
                    {link.label}
                    <motion.svg
                      className="w-4 h-4 ml-auto opacity-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ opacity: 1, x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </motion.svg>
                  </span>

                  {/* Mobile active indicator */}
                  {link.active && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-teal to-brand-orange rounded-r-full"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default AnimatedNav;
