import { motion, MotionProps } from "framer-motion";
import React from "react";
import { usePlatform } from "../../../hooks/usePlatform";

export interface PlatformCardProps extends Omit<MotionProps, "children"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  interactive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  children,
  variant = "default",
  padding = "medium",
  interactive = false,
  disabled = false,
  className = "",
  ...motionProps
}) => {
  const platform = usePlatform();

  const getBaseClasses = () => {
    if (platform.isIOS) {
      const baseClasses = "ios-card";
      const variantClasses = {
        default: "ios-card-default",
        elevated: "ios-card-elevated",
        outlined: "ios-card-outlined",
        filled: "ios-card-filled",
      };
      const paddingClasses = {
        none: "ios-card-padding-none",
        small: "ios-card-padding-small",
        medium: "ios-card-padding-medium",
        large: "ios-card-padding-large",
      };

      return `${baseClasses} ${variantClasses[variant]} ${
        paddingClasses[padding]
      } ${interactive ? "ios-card-interactive" : ""} ${
        disabled ? "ios-card-disabled" : ""
      } ${className}`;
    }

    if (platform.isAndroid) {
      const baseClasses = "android-card";
      const variantClasses = {
        default: "android-card-default",
        elevated: "android-card-elevated",
        outlined: "android-card-outlined",
        filled: "android-card-filled",
      };
      const paddingClasses = {
        none: "android-card-padding-none",
        small: "android-card-padding-small",
        medium: "android-card-padding-medium",
        large: "android-card-padding-large",
      };

      return `${baseClasses} ${variantClasses[variant]} ${
        paddingClasses[padding]
      } ${interactive ? "android-card-interactive" : ""} ${
        disabled ? "android-card-disabled" : ""
      } ${className}`;
    }

    // Web fallback with Tailwind classes
    const baseClasses = "bg-white rounded-lg";
    const variantClasses = {
      default: "shadow-sm border border-gray-200",
      elevated: "shadow-lg",
      outlined: "border-2 border-gray-300",
      filled: "bg-gray-50 border border-gray-200",
    };
    const paddingClasses = {
      none: "",
      small: "p-3",
      medium: "p-4",
      large: "p-6",
    };

    return `${baseClasses} ${variantClasses[variant]} ${
      paddingClasses[padding]
    } ${
      interactive ? "cursor-pointer hover:shadow-md transition-shadow" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;
  };

  const getMotionProps = () => {
    const baseProps = {
      ...motionProps,
    };

    if (interactive && !disabled) {
      if (platform.isIOS) {
        return {
          ...baseProps,
          whileTap: { scale: 0.98, transition: { duration: 0.1 } },
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
        };
      }

      if (platform.isAndroid) {
        return {
          ...baseProps,
          whileTap: { scale: 0.995, transition: { duration: 0.1 } },
        };
      }

      // Web fallback
      return {
        ...baseProps,
        whileHover: { scale: 1.01, transition: { duration: 0.2 } },
        whileTap: { scale: 0.99, transition: { duration: 0.1 } },
      };
    }

    return baseProps;
  };

  const CardComponent = interactive ? motion.div : motion.div;

  return (
    <CardComponent className={getBaseClasses()} {...getMotionProps()}>
      {platform.isAndroid && interactive && (
        <div className="android-ripple-container">
          <div className="android-ripple"></div>
        </div>
      )}
      {children}
    </CardComponent>
  );
};

export default PlatformCard;
