import React, { useState } from "react";
import { usePlatform } from "../../hooks/usePlatform";
import { MobileTabBar, TabItem } from "../platform/mobile/MobileTabBar";

// Admin Tab IDs
export enum AdminTabId {
  DASHBOARD = "dashboard",
  GAMES = "games",
  TEAMS = "teams",
  PLAYERS = "players",
  MORE = "more",
}

export interface AdminMobileNavigationProps {
  currentTab?: AdminTabId;
  onTabChange?: (tabId: AdminTabId) => void;
  children?: React.ReactNode;
}

// Admin-specific icons
const AdminTabIcons = {
  Dashboard: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),

  Games: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),

  Teams: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),

  Players: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      />
    </svg>
  ),

  More: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
  ),
};

const AdminMobileNavigation: React.FC<AdminMobileNavigationProps> = ({
  currentTab = AdminTabId.DASHBOARD,
  onTabChange,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>(currentTab);
  const platform = usePlatform();

  const handleTabChange = (tabId: string) => {
    const tab = tabId as AdminTabId;
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Define admin tabs with platform-appropriate labels
  const tabs: TabItem[] = [
    {
      id: AdminTabId.DASHBOARD,
      label: platform.isIOS ? "Home" : "Dashboard",
      icon: <AdminTabIcons.Dashboard />,
    },
    {
      id: AdminTabId.GAMES,
      label: "Games",
      icon: <AdminTabIcons.Games />,
    },
    {
      id: AdminTabId.TEAMS,
      label: "Teams",
      icon: <AdminTabIcons.Teams />,
    },
    {
      id: AdminTabId.PLAYERS,
      label: "Players",
      icon: <AdminTabIcons.Players />,
    },
    {
      id: AdminTabId.MORE,
      label: "More",
      icon: <AdminTabIcons.More />,
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

export default AdminMobileNavigation;
