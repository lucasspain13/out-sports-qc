import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Custom hook for scroll-triggered animations
 * @param triggerOnce - Whether the animation should trigger only once
 * @param margin - Margin around the viewport for triggering
 */
export const useScrollAnimation = (triggerOnce = true, margin = "-100px") => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin,
  });

  return { ref, isInView };
};

/**
 * Hook for creating staggered scroll animations
 * @param staggerDelay - Delay between each item (in seconds)
 */
export const useStaggeredAnimation = (staggerDelay = 0.1) => {
  const { ref, isInView } = useScrollAnimation();

  const getItemDelay = (index: number) => index * staggerDelay;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
        delay: getItemDelay(index),
      },
    }),
  };

  return { ref, isInView, itemVariants };
};

/**
 * Hook for parallax scrolling effects
 */
export const useParallax = (speed = 0.5) => {
  const ref = useRef<HTMLElement>(null);

  // This would be enhanced with actual scroll event listener
  // For now, return the ref for manual implementation
  return { ref, speed };
};
