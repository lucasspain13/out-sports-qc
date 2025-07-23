import { motion } from "framer-motion";
import React from "react";
import { ButtonProps } from "../../types";

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
  href,
  ...props
}) => {
  const baseClasses = "btn-base focus-visible-ring relative overflow-hidden";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const buttonHover = {
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  const buttonPress = {
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.33, 1, 0.68, 1],
    },
  };

  const ButtonContent = () => (
    <>
      {/* Ripple effect background */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg opacity-0"
        whileHover={{ opacity: 1 }}
        whileTap={{
          scale: 1.5,
          opacity: [0, 0.3, 0],
          transition: { duration: 0.4 },
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {loading && (
          <motion.svg
            className="-ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 360,
            }}
            transition={{
              rotate: {
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </motion.svg>
        )}
        <motion.span
          animate={loading ? { x: [0, 5, 0] } : {}}
          transition={
            loading
              ? {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {}
          }
        >
          {children}
        </motion.span>
      </span>

      {/* Shine effect for primary buttons */}
      {variant === "primary" && !disabled && (
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          whileHover={{
            translateX: "200%",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
          style={{ skewX: "-45deg" }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        variants={buttonHover}
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? buttonPress : undefined}
        {...props}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      variants={buttonHover}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? buttonPress : undefined}
      {...props}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default Button;
