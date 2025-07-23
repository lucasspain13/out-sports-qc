// Animation utilities and reusable motion variants
import { Variants } from "framer-motion";

// Easing functions
export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeOutElastic: [0.68, -0.55, 0.265, 1.55],
} as const;

// Duration presets
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Common animation variants
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutBack,
    },
  },
};

export const slideInUp: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutQuart,
    },
  },
};

export const slideInDown: Variants = {
  hidden: {
    y: "-100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutQuart,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

// Interactive hover variants
export const hoverScale: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

export const hoverLift: Variants = {
  hover: {
    y: -4,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

export const hoverGlow: Variants = {
  hover: {
    filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

// Button interaction variants
export const buttonPress: Variants = {
  tap: {
    scale: 0.98,
    transition: {
      duration: durations.fast,
      ease: easings.easeOutCubic,
    },
  },
};

export const buttonHover: Variants = {
  hover: {
    y: -2,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

// Card interaction variants
export const cardHover: Variants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

// Loading animations
export const loadingPulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export const loadingBounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Modal/overlay animations
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.normal,
    },
  },
};

export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutBack,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 50,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

// Page transition variants
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: durations.normal,
      ease: easings.easeOutCubic,
    },
  },
};

// Scroll-triggered animations
export const scrollFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOutCubic,
    },
  },
};

// Floating animations for decorative elements
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export const floatReverse: Variants = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Rotation animations
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export const spinReverse: Variants = {
  animate: {
    rotate: -360,
    transition: {
      duration: 25,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Breathing/pulse animations
export const breathe: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// Gradient shift animation
export const gradientShift: Variants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    },
  },
};
