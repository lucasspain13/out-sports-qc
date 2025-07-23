import { motion } from "framer-motion";
import React from "react";
import { usePlatform } from "../../hooks/usePlatform";

export type TabItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | string;
  notificationDot?: boolean;
};

export interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const platform = usePlatform();

  const handleTabPress = async (tabId: string) => {
    // Add haptic feedback for native platforms
    if (platform.isNative) {
      try {
        // Use browser vibration API as fallback for haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10); // Short vibration
        }
      } catch (error) {
        // Haptics not available
        console.log("Haptics not available");
      }
    }

    onTabChange(tabId);
  };

  const getTabBarStyles = () => {
    if (platform.isIOS) {
      return {
        container: `
          bg-white/95 backdrop-blur-lg border-t border-gray-200/50
          shadow-[0_-2px_10px_rgba(0,0,0,0.1)]
          rounded-t-[20px]
        `,
        tab: `
          flex-1 flex flex-col items-center justify-center py-2 px-1
          transition-all duration-200 ease-out
          active:scale-95
        `,
        activeTab: `
          transform scale-105
        `,
        label: `
          text-xs font-medium mt-1
          transition-colors duration-200
        `,
        activeLabel: `
          text-blue-600 font-semibold
        `,
        inactiveLabel: `
          text-gray-500
        `,
        icon: `
          w-6 h-6 transition-all duration-200
        `,
        activeIcon: `
          transform scale-110 text-blue-600
        `,
        inactiveIcon: `
          text-gray-500
        `,
        badge: `
          absolute -top-1 -right-1 
          bg-red-500 text-white text-xs
          rounded-full min-w-[18px] h-[18px]
          flex items-center justify-center
          border-2 border-white
          font-medium
        `,
        notificationDot: `
          absolute -top-1 -right-1 
          bg-red-500 w-2 h-2 rounded-full
          border border-white
        `,
      };
    } else if (platform.isAndroid) {
      return {
        container: `
          bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.15)]
          border-t border-gray-200
        `,
        tab: `
          flex-1 flex flex-col items-center justify-center py-3 px-1
          transition-all duration-150 ease-out
          active:bg-gray-100
        `,
        activeTab: `
          bg-blue-50
        `,
        label: `
          text-xs font-medium mt-1
          transition-colors duration-150
        `,
        activeLabel: `
          text-blue-700 font-semibold
        `,
        inactiveLabel: `
          text-gray-600
        `,
        icon: `
          w-6 h-6 transition-all duration-150
        `,
        activeIcon: `
          text-blue-700
        `,
        inactiveIcon: `
          text-gray-600
        `,
        badge: `
          absolute -top-1 -right-1 
          bg-red-600 text-white text-xs
          rounded-full min-w-[16px] h-[16px]
          flex items-center justify-center
          font-medium
        `,
        notificationDot: `
          absolute -top-1 -right-1 
          bg-red-600 w-2 h-2 rounded-full
        `,
      };
    } else {
      // Web fallback
      return {
        container: `
          bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.1)]
          border-t border-gray-200
        `,
        tab: `
          flex-1 flex flex-col items-center justify-center py-3 px-1
          transition-all duration-200 ease-out
          hover:bg-gray-50 active:bg-gray-100
        `,
        activeTab: `
          bg-blue-50
        `,
        label: `
          text-xs font-medium mt-1
          transition-colors duration-200
        `,
        activeLabel: `
          text-blue-600 font-semibold
        `,
        inactiveLabel: `
          text-gray-600
        `,
        icon: `
          w-6 h-6 transition-all duration-200
        `,
        activeIcon: `
          text-blue-600
        `,
        inactiveIcon: `
          text-gray-600
        `,
        badge: `
          absolute -top-1 -right-1 
          bg-red-500 text-white text-xs
          rounded-full min-w-[18px] h-[18px]
          flex items-center justify-center
          border border-white
          font-medium
        `,
        notificationDot: `
          absolute -top-1 -right-1 
          bg-red-500 w-2 h-2 rounded-full
          border border-white
        `,
      };
    }
  };

  const styles = getTabBarStyles();

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        ${styles.container}
        ${className}
      `}
      style={{
        paddingBottom: platform.isNative ? "env(safe-area-inset-bottom)" : "0",
        paddingLeft: platform.isNative ? "env(safe-area-inset-left)" : "0",
        paddingRight: platform.isNative ? "env(safe-area-inset-right)" : "0",
      }}
    >
      <div className="flex w-full">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={`
                ${styles.tab}
                ${isActive ? styles.activeTab : ""}
              `}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <motion.div
                  animate={
                    isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`
                    ${styles.icon}
                    ${isActive ? styles.activeIcon : styles.inactiveIcon}
                  `}
                >
                  {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
                </motion.div>

                {/* Badge */}
                {tab.badge && (
                  <span className={styles.badge}>
                    {typeof tab.badge === "number" && tab.badge > 99
                      ? "99+"
                      : tab.badge}
                  </span>
                )}

                {/* Notification Dot */}
                {tab.notificationDot && !tab.badge && (
                  <span className={styles.notificationDot}></span>
                )}
              </div>

              <motion.span
                animate={
                  isActive
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0.8, scale: 0.95 }
                }
                transition={{ duration: 0.2 }}
                className={`
                  ${styles.label}
                  ${isActive ? styles.activeLabel : styles.inactiveLabel}
                `}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>

      {/* iOS-specific active tab indicator */}
      {platform.isIOS && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] bg-blue-600"
          animate={{
            x: `${
              (tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length
            }%`,
            width: `${100 / tabs.length}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </div>
  );
};

export default BottomTabBar;
