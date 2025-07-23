import { motion } from "framer-motion";
import React from "react";
import { usePlatform } from "../../../hooks/usePlatform";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
  onClick?: () => void;
}

interface MobileTabBarProps {
  items: TabItem[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  items,
  activeTabId,
  onTabChange,
  className = "",
}) => {
  const platform = usePlatform();

  const handleTabPress = (item: TabItem) => {
    onTabChange(item.id);
    if (item.onClick) {
      item.onClick();
    }
  };

  if (platform.isIOS) {
    return (
      <div className={`ios-tab-bar ${className}`}>
        <div className="ios-tab-bar-background">
          {items.map(item => (
            <motion.button
              key={item.id}
              className={`ios-tab-item ${
                activeTabId === item.id ? "active" : ""
              }`}
              onClick={() => handleTabPress(item)}
              whileTap={{ scale: 0.95 }}
              animate={{
                opacity: activeTabId === item.id ? 1 : 0.6,
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="ios-tab-icon">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="ios-tab-badge">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="ios-tab-label">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (platform.isAndroid) {
    return (
      <div className={`android-tab-bar ${className}`}>
        <div className="android-tab-bar-background">
          {items.map(item => (
            <motion.button
              key={item.id}
              className={`android-tab-item ${
                activeTabId === item.id ? "active" : ""
              }`}
              onClick={() => handleTabPress(item)}
              whileTap={{ scale: 0.98 }}
              animate={{
                color:
                  activeTabId === item.id
                    ? "var(--primary)"
                    : "var(--on-surface-variant)",
              }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="android-ripple"></div>
              <div className="android-tab-icon">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="android-tab-badge">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="android-tab-label">{item.label}</span>
              {activeTabId === item.id && (
                <motion.div
                  className="android-tab-indicator"
                  layoutId="tab-indicator"
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Web fallback
  return (
    <div className={`web-tab-bar ${className}`}>
      <div className="flex bg-white border-t border-gray-200">
        {items.map(item => (
          <motion.button
            key={item.id}
            className={`flex-1 flex flex-col items-center py-2 px-1 relative ${
              activeTabId === item.id
                ? "text-brand-blue"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => handleTabPress(item)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MobileTabBar;
