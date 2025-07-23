import { motion, MotionProps } from "framer-motion";
import React from "react";
import { usePlatform } from "../../../hooks/usePlatform";

export interface PlatformButtonProps extends Omit<MotionProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "ghost";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
}

export const PlatformButton: React.FC<PlatformButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  href,
  target,
  type = "button",
  className = "",
  onClick,
  ...motionProps
}) => {
  const platform = usePlatform();

  const LoadingSpinner = () => (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
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
  );

  const getBaseClasses = () => {
    if (platform.isIOS) {
      const baseClasses = "ios-button";
      const variantClasses = {
        primary: "ios-button-primary",
        secondary: "ios-button-secondary",
        tertiary: "ios-button-tertiary",
        destructive: "ios-button-destructive",
        ghost: "ios-button-ghost",
      };
      const sizeClasses = {
        small: "ios-button-small",
        medium: "ios-button-medium",
        large: "ios-button-large",
      };

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "ios-button-full-width" : ""
      } ${disabled ? "ios-button-disabled" : ""} ${
        loading ? "ios-button-loading" : ""
      } ${className}`;
    }

    if (platform.isAndroid) {
      const baseClasses = "android-button";
      const variantClasses = {
        primary: "android-button-filled",
        secondary: "android-button-outlined",
        tertiary: "android-button-text",
        destructive: "android-button-destructive",
        ghost: "android-button-ghost",
      };
      const sizeClasses = {
        small: "android-button-small",
        medium: "android-button-medium",
        large: "android-button-large",
      };

      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "android-button-full-width" : ""
      } ${disabled ? "android-button-disabled" : ""} ${
        loading ? "android-button-loading" : ""
      } ${className}`;
    }

    // Web fallback with Tailwind classes
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
      tertiary:
        "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    };
    const sizeClasses = {
      small: "px-3 py-1.5 text-sm",
      medium: "px-4 py-2 text-base",
      large: "px-6 py-3 text-lg",
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
      fullWidth ? "w-full" : ""
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;
  };

  const getMotionProps = () => {
    const baseProps = {
      ...motionProps,
    };

    if (!disabled && !loading) {
      if (platform.isIOS) {
        return {
          ...baseProps,
          whileTap: { scale: 0.95, transition: { duration: 0.1 } },
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
        };
      }

      if (platform.isAndroid) {
        return {
          ...baseProps,
          whileTap: { scale: 0.98, transition: { duration: 0.1 } },
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

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const buttonContent = (
    <>
      {platform.isAndroid && (
        <div className="android-ripple-container">
          <div className="android-ripple"></div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {icon && iconPosition === "left" && !loading && (
        <span className="button-icon-left">{icon}</span>
      )}

      <span className={loading ? "opacity-0" : ""}>{children}</span>

      {icon && iconPosition === "right" && !loading && (
        <span className="button-icon-right">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        className={getBaseClasses()}
        onClick={handleClick}
        {...getMotionProps()}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={getBaseClasses()}
      onClick={handleClick}
      disabled={disabled || loading}
      {...getMotionProps()}
    >
      {buttonContent}
    </motion.button>
  );
};

export default PlatformButton;
