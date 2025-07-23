import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  TabRoute,
  useMobileNavigation,
} from "../../contexts/MobileNavigationContext";
import { usePlatform } from "../../hooks/usePlatform";

export interface TabBasedRouterProps {
  fallbackComponent?: React.ComponentType;
  className?: string;
}

export const TabBasedRouter: React.FC<TabBasedRouterProps> = ({
  fallbackComponent: FallbackComponent,
  className = "",
}) => {
  const { state } = useMobileNavigation();
  const platform = usePlatform();

  // Find the active tab
  const activeTab = state.tabs.find(
    (tab: TabRoute) => tab.id === state.activeTabId
  );

  // Get animation variants based on platform
  const getPageVariants = () => {
    if (platform.isIOS) {
      return {
        enter: {
          opacity: 0,
          x: 50,
          scale: 0.98,
        },
        center: {
          opacity: 1,
          x: 0,
          scale: 1,
        },
        exit: {
          opacity: 0,
          x: -50,
          scale: 0.98,
        },
      };
    }

    if (platform.isAndroid) {
      return {
        enter: {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        center: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
        exit: {
          opacity: 0,
          y: -20,
          scale: 0.95,
        },
      };
    }

    // Web fallback
    return {
      enter: {
        opacity: 0,
        scale: 0.98,
      },
      center: {
        opacity: 1,
        scale: 1,
      },
      exit: {
        opacity: 0,
        scale: 0.98,
      },
    };
  };

  const getTransition = () => {
    if (platform.isIOS) {
      return {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      };
    }

    if (platform.isAndroid) {
      return {
        type: "tween",
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      };
    }

    // Web fallback
    return {
      type: "tween",
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    };
  };

  const variants = getPageVariants();
  const transition = getTransition();

  return (
    <div className={`tab-router-container ${className}`}>
      <AnimatePresence mode="wait">
        {activeTab ? (
          <motion.div
            key={activeTab.id}
            className="tab-content"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <activeTab.component />
          </motion.div>
        ) : (
          FallbackComponent && (
            <motion.div
              key="fallback"
              className="tab-fallback"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              <FallbackComponent />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing tab routing
export const useTabRouter = () => {
  const { state, setActiveTab, addTab, removeTab } = useMobileNavigation();

  const navigateToTab = (tabId: string) => {
    const tab = state.tabs.find((t: TabRoute) => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
    } else {
      console.warn(`Tab with id "${tabId}" not found`);
    }
  };

  const registerTab = (tab: TabRoute) => {
    addTab(tab);
  };

  const unregisterTab = (tabId: string) => {
    removeTab(tabId);
  };

  const getCurrentTab = () => {
    return state.tabs.find((tab: TabRoute) => tab.id === state.activeTabId);
  };

  const getAllTabs = () => {
    return state.tabs;
  };

  const isTabActive = (tabId: string) => {
    return state.activeTabId === tabId;
  };

  return {
    navigateToTab,
    registerTab,
    unregisterTab,
    getCurrentTab,
    getAllTabs,
    isTabActive,
    activeTabId: state.activeTabId,
    canGoBack: state.canGoBack,
  };
};

export default TabBasedRouter;
