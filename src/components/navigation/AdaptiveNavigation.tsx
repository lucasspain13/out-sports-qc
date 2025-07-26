import React from "react";
import { usePlatform } from "../../hooks/usePlatform";
import { NavigationProps } from "../../types";
import Navigation from "../layout/Navigation";
import LiveScoresScreen from "../mobile/screens/LiveScoresScreen";
import ScheduleScreen from "../mobile/screens/ScheduleScreen";
import TeamsScreen from "../mobile/screens/TeamsScreen";
import RegistrationPage from "../pages/RegistrationPage";
import MobileNavigation, { TabId } from "./MobileNavigation";

// Map traditional navigation routes to mobile tabs
const routeToTabMap: Record<string, TabId> = {
  "#summer-kickball-schedule": TabId.SCHEDULE,
  "#fall-kickball-schedule": TabId.SCHEDULE,
  "#summer-kickball-teams": TabId.TEAMS,
  "#fall-kickball-teams": TabId.TEAMS,
  "#fall-kickball-registration": TabId.REGISTRATION,
  // Legacy routes
  "#kickball-schedule": TabId.SCHEDULE,
  "#kickball-teams": TabId.TEAMS,
  "#kickball-registration": TabId.REGISTRATION,
};

const tabToRouteMap: Record<TabId, string> = {
  [TabId.LIVE_SCORES]: "#home",
  [TabId.SCHEDULE]: "#summer-kickball-schedule", // Default to summer kickball schedule
  [TabId.TEAMS]: "#summer-kickball-teams", // Default to summer kickball teams
  [TabId.REGISTRATION]: "#fall-kickball-registration", // Default to fall kickball registration
};

export interface AdaptiveNavigationProps extends NavigationProps {
  children?: React.ReactNode;
}

const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({
  logo,
  menuItems,
  showLiveScores,
  currentRoute,
  children,
  ...props
}) => {
  const platform = usePlatform();

  // Debug logging
  console.log("AdaptiveNavigation render:", {
    isNative: platform.isNative,
    platform: platform.platform,
    windowWidth: window.innerWidth,
    currentRoute,
  });

  // For NATIVE mobile platforms ONLY (iOS/Android apps), use simplified navigation
  // Browser should always use desktop layout regardless of screen size
  if (platform.isNative) {
    // Get current tab from route
    const currentTab =
      routeToTabMap[currentRoute || "#home"] || TabId.LIVE_SCORES;

    console.log("Mobile navigation debug:", {
      currentRoute,
      currentTab,
      routeToTabMap,
      tabToRouteMap,
    });

    const handleTabChange = (tabId: TabId) => {
      console.log("Tab change requested:", tabId);
      // Navigate to corresponding route
      const route = tabToRouteMap[tabId];
      console.log("Navigating to route:", route);
      if (route && route !== currentRoute) {
        window.location.hash = route;
      }
    };

    // Mobile content based on active tab
    const renderMobileContent = () => {
      console.log("Rendering mobile content for tab:", currentTab);
      switch (currentTab) {
        case TabId.LIVE_SCORES:
          return <LiveScoresScreen />;
        case TabId.SCHEDULE:
          return <ScheduleScreen />;
        case TabId.TEAMS:
          return <TeamsScreen />;
        case TabId.REGISTRATION:
          console.log("Rendering registration page");
          return <RegistrationPage sportType="kickball" />;
        default:
          console.log("Fallback to live scores");
          return <LiveScoresScreen />;
      }
    };

    return (
      <MobileNavigation currentTab={currentTab} onTabChange={handleTabChange}>
        {renderMobileContent()}
      </MobileNavigation>
    );
  }

  // For desktop/web, use traditional navigation with full dropdown support
  return (
    <>
      <Navigation
        logo={logo}
        menuItems={menuItems}
        showLiveScores={showLiveScores}
        currentRoute={currentRoute}
        {...props}
      />
      {children}
    </>
  );
};

export default AdaptiveNavigation;
