import { motion } from "framer-motion";
import React from "react";
import { usePlatform } from "../../../hooks/usePlatform";

export interface HeaderAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: HeaderAction;
  rightActions?: HeaderAction[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  transparent?: boolean;
  large?: boolean;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightActions = [],
  showBackButton = false,
  onBackPress,
  transparent = false,
  large = false,
  className = "",
}) => {
  const platform = usePlatform();

  const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
        fill="currentColor"
      />
    </svg>
  );

  const ChevronIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
        fill="currentColor"
      />
    </svg>
  );

  if (platform.isIOS) {
    return (
      <div
        className={`ios-header ${large ? "ios-header-large" : ""} ${
          transparent ? "ios-header-transparent" : ""
        } ${className}`}
      >
        <div className="ios-header-content">
          {/* Left side */}
          <div className="ios-header-left">
            {showBackButton && onBackPress && (
              <motion.button
                className="ios-header-back-button"
                onClick={onBackPress}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <ChevronIcon />
                <span>Back</span>
              </motion.button>
            )}
            {leftAction && (
              <motion.button
                className={`ios-header-action ${
                  leftAction.disabled ? "disabled" : ""
                }`}
                onClick={leftAction.onClick}
                disabled={leftAction.disabled}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {leftAction.icon}
                {leftAction.label && <span>{leftAction.label}</span>}
              </motion.button>
            )}
          </div>

          {/* Center */}
          <div className="ios-header-center">
            {large ? (
              <div className="ios-header-large-title">
                <h1 className="ios-header-title">{title}</h1>
                {subtitle && <p className="ios-header-subtitle">{subtitle}</p>}
              </div>
            ) : (
              <div className="ios-header-compact-title">
                <h1 className="ios-header-title">{title}</h1>
                {subtitle && <p className="ios-header-subtitle">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="ios-header-right">
            {rightActions.map(action => (
              <motion.button
                key={action.id}
                className={`ios-header-action ${
                  action.disabled ? "disabled" : ""
                }`}
                onClick={action.onClick}
                disabled={action.disabled}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {action.icon}
                {action.label && <span>{action.label}</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (platform.isAndroid) {
    return (
      <div
        className={`android-header ${
          transparent ? "android-header-transparent" : ""
        } ${className}`}
      >
        <div className="android-header-content">
          {/* Left side */}
          <div className="android-header-left">
            {showBackButton && onBackPress && (
              <motion.button
                className="android-header-nav-button"
                onClick={onBackPress}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <div className="android-ripple"></div>
                <BackIcon />
              </motion.button>
            )}
            {leftAction && (
              <motion.button
                className={`android-header-action ${
                  leftAction.disabled ? "disabled" : ""
                }`}
                onClick={leftAction.onClick}
                disabled={leftAction.disabled}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <div className="android-ripple"></div>
                {leftAction.icon}
              </motion.button>
            )}
          </div>

          {/* Center */}
          <div className="android-header-center">
            <h1 className="android-header-title">{title}</h1>
            {subtitle && <p className="android-header-subtitle">{subtitle}</p>}
          </div>

          {/* Right side */}
          <div className="android-header-right">
            {rightActions.map(action => (
              <motion.button
                key={action.id}
                className={`android-header-action ${
                  action.disabled ? "disabled" : ""
                }`}
                onClick={action.onClick}
                disabled={action.disabled}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <div className="android-ripple"></div>
                {action.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Web fallback
  return (
    <div
      className={`web-header bg-white border-b border-gray-200 ${
        transparent ? "bg-transparent border-transparent" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          {showBackButton && onBackPress && (
            <motion.button
              className="mr-3 p-2 text-gray-600 hover:text-gray-800"
              onClick={onBackPress}
              whileTap={{ scale: 0.95 }}
            >
              <BackIcon />
            </motion.button>
          )}
          {leftAction && (
            <motion.button
              className={`p-2 text-gray-600 hover:text-gray-800 ${
                leftAction.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={leftAction.onClick}
              disabled={leftAction.disabled}
              whileTap={{ scale: 0.95 }}
            >
              {leftAction.icon}
            </motion.button>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {rightActions.map(action => (
            <motion.button
              key={action.id}
              className={`p-2 text-gray-600 hover:text-gray-800 ${
                action.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={action.onClick}
              disabled={action.disabled}
              whileTap={{ scale: 0.95 }}
            >
              {action.icon}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
