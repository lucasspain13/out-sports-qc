import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePlatform } from "../../../hooks/usePlatform";

export interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
  className?: string;
}

export const MobileModal: React.FC<MobileModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  preventBackdropClose = false,
  className = "",
}) => {
  const platform = usePlatform();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!preventBackdropClose && event.target === event.currentTarget) {
      onClose();
    }
  };

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill="currentColor"
      />
    </svg>
  );

  const getModalVariants = () => {
    if (platform.isIOS) {
      return {
        hidden: {
          opacity: 0,
          scale: 0.95,
          y: 50,
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.95,
          y: 50,
          transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1],
          },
        },
      };
    }

    if (platform.isAndroid) {
      return {
        hidden: {
          opacity: 0,
          scale: 0.8,
          y: 100,
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 300,
            duration: 0.25,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.8,
          y: 100,
          transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
          },
        },
      };
    }

    // Web fallback
    return {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.2,
          ease: [0, 0, 0.2, 1],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          duration: 0.15,
          ease: [0.4, 0, 1, 1],
        },
      },
    };
  };

  const getBackdropVariants = () => {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.2 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.2 },
      },
    };
  };

  const getModalClasses = () => {
    const sizeClasses = {
      small: platform.isIOS
        ? "ios-modal-small"
        : platform.isAndroid
        ? "android-modal-small"
        : "max-w-sm",
      medium: platform.isIOS
        ? "ios-modal-medium"
        : platform.isAndroid
        ? "android-modal-medium"
        : "max-w-md",
      large: platform.isIOS
        ? "ios-modal-large"
        : platform.isAndroid
        ? "android-modal-large"
        : "max-w-2xl",
      fullscreen: platform.isIOS
        ? "ios-modal-fullscreen"
        : platform.isAndroid
        ? "android-modal-fullscreen"
        : "max-w-full h-full",
    };

    if (platform.isIOS) {
      return `ios-modal ${sizeClasses[size]} ${className}`;
    }

    if (platform.isAndroid) {
      return `android-modal ${sizeClasses[size]} ${className}`;
    }

    // Web fallback
    return `bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 ${className}`;
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className={
              platform.isIOS
                ? "ios-modal-backdrop"
                : platform.isAndroid
                ? "android-modal-backdrop"
                : "fixed inset-0 bg-black bg-opacity-50"
            }
            variants={getBackdropVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            className={getModalClasses()}
            variants={getModalVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {platform.isAndroid && (
              <div className="android-modal-elevation"></div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className={
                  platform.isIOS
                    ? "ios-modal-header"
                    : platform.isAndroid
                    ? "android-modal-header"
                    : "flex items-center justify-between p-4 border-b border-gray-200"
                }
              >
                {title && (
                  <h2
                    className={
                      platform.isIOS
                        ? "ios-modal-title"
                        : platform.isAndroid
                        ? "android-modal-title"
                        : "text-lg font-semibold text-gray-900"
                    }
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    className={
                      platform.isIOS
                        ? "ios-modal-close-button"
                        : platform.isAndroid
                        ? "android-modal-close-button"
                        : "p-2 text-gray-400 hover:text-gray-600"
                    }
                    onClick={onClose}
                    whileTap={{ scale: 0.95 }}
                  >
                    {platform.isAndroid && (
                      <div className="android-ripple"></div>
                    )}
                    <CloseIcon />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className={
                platform.isIOS
                  ? "ios-modal-content"
                  : platform.isAndroid
                  ? "android-modal-content"
                  : "p-4"
              }
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default MobileModal;
