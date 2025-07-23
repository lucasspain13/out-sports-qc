import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import React, { useState } from "react";
import { usePlatform } from "../../../hooks/usePlatform";

export interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  onAction: () => void;
}

export interface SwipeableGameCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeComplete?: (direction: "left" | "right", actionId?: string) => void;
  disabled?: boolean;
  className?: string;
}

export const SwipeableGameCard: React.FC<SwipeableGameCardProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeComplete,
  disabled = false,
  className = "",
}) => {
  const platform = usePlatform();
  const [isRevealed, setIsRevealed] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const SWIPE_THRESHOLD = 80;
  const MAX_SWIPE = 200;

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const swipe = offset.x;
    const swipeVelocity = velocity.x;

    // Determine if we should trigger an action
    if (Math.abs(swipe) > SWIPE_THRESHOLD || Math.abs(swipeVelocity) > 500) {
      const direction = swipe > 0 ? "right" : "left";
      const actions = direction === "right" ? leftActions : rightActions;

      if (actions.length > 0) {
        // For now, trigger the first action
        const action = actions[0];
        action.onAction();

        if (onSwipeComplete) {
          onSwipeComplete(direction, action.id);
        }
      }

      // Reset position
      x.set(0);
      setIsRevealed(false);
    } else {
      // Snap back or reveal actions
      const shouldReveal = Math.abs(swipe) > SWIPE_THRESHOLD / 2;

      if (shouldReveal) {
        const targetX = swipe > 0 ? SWIPE_THRESHOLD : -SWIPE_THRESHOLD;
        x.set(targetX);
        setIsRevealed(true);
      } else {
        x.set(0);
        setIsRevealed(false);
      }
    }
  };

  const handleActionPress = (action: SwipeAction) => {
    action.onAction();
    x.set(0);
    setIsRevealed(false);
  };

  const resetCard = () => {
    x.set(0);
    setIsRevealed(false);
  };

  const getCardClasses = () => {
    if (platform.isIOS) {
      return `ios-swipeable-card ${
        disabled ? "ios-swipeable-card-disabled" : ""
      } ${className}`;
    }

    if (platform.isAndroid) {
      return `android-swipeable-card ${
        disabled ? "android-swipeable-card-disabled" : ""
      } ${className}`;
    }

    // Web fallback
    return `relative bg-white rounded-lg shadow-sm border border-gray-200 ${
      disabled ? "opacity-50" : ""
    } ${className}`;
  };

  const getActionButtonClasses = (
    _action: SwipeAction,
    position: "left" | "right"
  ) => {
    if (platform.isIOS) {
      return `ios-swipe-action ios-swipe-action-${position}`;
    }

    if (platform.isAndroid) {
      return `android-swipe-action android-swipe-action-${position}`;
    }

    // Web fallback
    return `flex items-center justify-center w-20 h-full text-white font-medium`;
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 h-full flex">
          {leftActions.map((action, index) => (
            <motion.button
              key={action.id}
              className={getActionButtonClasses(action, "left")}
              style={{
                backgroundColor: action.backgroundColor,
                color: action.color,
              }}
              onClick={() => handleActionPress(action)}
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {platform.isAndroid && <div className="android-ripple"></div>}
              <div className="flex flex-col items-center">
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex">
          {rightActions.map((action, index) => (
            <motion.button
              key={action.id}
              className={getActionButtonClasses(action, "right")}
              style={{
                backgroundColor: action.backgroundColor,
                color: action.color,
              }}
              onClick={() => handleActionPress(action)}
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {platform.isAndroid && <div className="android-ripple"></div>}
              <div className="flex flex-col items-center">
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Main Card */}
      <motion.div
        className={getCardClasses()}
        drag={disabled ? false : "x"}
        dragConstraints={{ left: -MAX_SWIPE, right: MAX_SWIPE }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, opacity }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={isRevealed ? resetCard : undefined}
      >
        {children}

        {/* iOS style swipe indicator */}
        {platform.isIOS && !disabled && (
          <div className="ios-swipe-indicator">
            <div className="ios-swipe-indicator-line"></div>
          </div>
        )}

        {/* Android style ripple effect */}
        {platform.isAndroid && !disabled && (
          <div className="android-swipe-ripple-container">
            <div className="android-ripple"></div>
          </div>
        )}
      </motion.div>

      {/* Backdrop for revealed state */}
      {isRevealed && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetCard}
        />
      )}
    </div>
  );
};

export default SwipeableGameCard;
