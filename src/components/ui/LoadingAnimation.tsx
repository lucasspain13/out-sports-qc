import { motion } from "framer-motion";
import React from "react";

interface LoadingAnimationProps {
  type?: "spinner" | "dots" | "pulse" | "skeleton" | "bounce";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  text?: string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = "spinner",
  size = "medium",
  color = "primary",
  text,
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-brand-blue",
    secondary: "text-brand-orange",
    white: "text-white",
  };

  const containerClass = `flex flex-col items-center justify-center ${className}`;

  if (type === "spinner") {
    return (
      <div className={containerClass}>
        <motion.div
          className={`${sizeClasses[size]} ${colorClasses[color]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-gray-600"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className={containerClass}>
        <div className="flex space-x-2">
          {[0, 1, 2].map(index => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full bg-current ${colorClasses[color]}`}
              animate={{
                y: [-4, 4, -4],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-gray-600"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div className={containerClass}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-current ${colorClasses[color]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-gray-600"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === "bounce") {
    return (
      <div className={containerClass}>
        <div className="flex space-x-1">
          {[0, 1, 2, 3].map(index => (
            <motion.div
              key={index}
              className={`w-2 h-8 rounded-full bg-current ${colorClasses[color]}`}
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm text-gray-600"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className={`space-y-4 w-full max-w-sm ${className}`}>
        <motion.div
          className="h-4 bg-gray-200 rounded-lg"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <motion.div
          className="h-4 bg-gray-200 rounded-lg w-3/4"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.2,
          }}
          style={{
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <motion.div
          className="h-4 bg-gray-200 rounded-lg w-1/2"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.4,
          }}
          style={{
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    );
  }

  return null;
};

// Higher-order component for adding loading states to any component
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType<LoadingAnimationProps> = LoadingAnimation
) => {
  const WrappedComponent: React.FC<
    P & { isLoading?: boolean; loadingProps?: LoadingAnimationProps }
  > = ({ isLoading = false, loadingProps = {}, ...props }) => {
    if (isLoading) {
      return <LoadingComponent {...loadingProps} />;
    }

    return <Component {...(props as P)} />;
  };

  return WrappedComponent;
};

export default LoadingAnimation;
