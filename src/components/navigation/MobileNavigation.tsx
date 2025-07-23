import React, { useState } from "react";
import { usePlatform } from "../../hooks/usePlatform";
import { useRealtimeScores } from "../../hooks/useRealtimeScores";
import { MobileTabBar, TabItem } from "../platform/mobile/MobileTabBar";
import { TabIcons } from "./TabIcons";

// Tab IDs
export enum TabId {
  LIVE_SCORES = "live-scores",
  SCHEDULE = "schedule",
  TEAMS = "teams",
  REGISTRATION = "registration",
}

export interface MobileNavigationProps {
  currentTab?: TabId;
  onTabChange?: (tabId: TabId) => void;
  children?: React.ReactNode;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentTab = TabId.LIVE_SCORES,
  onTabChange,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(currentTab);
  const platform = usePlatform();
  const { liveGames } = useRealtimeScores();

  // Count live games for badge
  const liveGamesCount = liveGames.filter(
    game => game.status === "in-progress"
  ).length;

  const handleTabChange = (tabId: string) => {
    const tab = tabId as TabId;
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Define tabs with platform-appropriate icons
  const tabs: TabItem[] = [
    {
      id: TabId.LIVE_SCORES,
      label: platform.isIOS ? "Live" : "Live Scores",
      icon: <TabIcons.LiveScores />,
      badge: liveGamesCount > 0 ? liveGamesCount : undefined,
    },
    {
      id: TabId.SCHEDULE,
      label: "Schedule",
      icon: <TabIcons.Schedule />,
    },
    {
      id: TabId.TEAMS,
      label: "Teams",
      icon: <TabIcons.Teams />,
    },
    {
      id: TabId.REGISTRATION,
      label: platform.isIOS ? "Sign Up" : "Registration",
      icon: <TabIcons.Registration />,
    },
  ];

  return (
    <>
      {/* Main content area */}
      <div
        className="pb-16 sm:pb-20" // Add bottom padding to prevent content from hiding behind tab bar
        style={{
          paddingBottom: platform.isNative
            ? "calc(4rem + env(safe-area-inset-bottom))"
            : "0", // No bottom padding for web
        }}
      >
        {children}
      </div>

      {/* Bottom Tab Bar - ONLY show on native iOS/Android apps */}
      {platform.isNative && (
        <MobileTabBar
          items={tabs}
          activeTabId={activeTab}
          onTabChange={handleTabChange}
          className="fixed bottom-0 left-0 right-0 z-50"
        />
      )}
    </>
  );
};

export default MobileNavigation;
