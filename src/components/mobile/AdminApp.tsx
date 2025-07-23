import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminMobileNavigation, {
  AdminTabId,
} from "../navigation/AdminMobileNavigation";
import { AdminLogin } from "../pages";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import AdminGamesScreen from "./screens/AdminGamesScreen";
import AdminMoreScreen from "./screens/AdminMoreScreen";
import AdminPlayersScreen from "./screens/AdminPlayersScreen";
import AdminTeamsScreen from "./screens/AdminTeamsScreen";

const AdminApp: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [currentView, setCurrentView] = useState<"login" | "dashboard">(
    "login"
  );
  const [currentTab, setCurrentTab] = useState<AdminTabId>(
    AdminTabId.DASHBOARD
  );

  // Update view based on auth state
  useEffect(() => {
    if (user && isAdmin) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("login");
    }
  }, [user, isAdmin]);

  const handleTabChange = (tabId: AdminTabId) => {
    setCurrentTab(tabId);
  };

  const handleDashboardNavigate = (page: string) => {
    // Map page names to admin tab IDs
    const pageToTabMap: Record<string, AdminTabId> = {
      teams: AdminTabId.TEAMS,
      players: AdminTabId.PLAYERS,
      games: AdminTabId.GAMES,
      locations: AdminTabId.MORE, // Locations might be in the "More" tab
    };

    const targetTab = pageToTabMap[page];
    if (targetTab) {
      setCurrentTab(targetTab);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case AdminTabId.DASHBOARD:
        return <AdminDashboardScreen onNavigate={handleDashboardNavigate} />;
      case AdminTabId.GAMES:
        return <AdminGamesScreen />;
      case AdminTabId.TEAMS:
        return <AdminTeamsScreen />;
      case AdminTabId.PLAYERS:
        return <AdminPlayersScreen />;
      case AdminTabId.MORE:
        return <AdminMoreScreen />;
      default:
        return <AdminDashboardScreen onNavigate={handleDashboardNavigate} />;
    }
  };

  // If not logged in or not admin, show admin login
  if (currentView === "login") {
    return (
      <div>
        {/* Custom header for mobile admin */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            onClick={() => {
              // Go back to role selection by resetting onboarding
              window.location.reload();
            }}
            className="text-gray-600 hover:text-gray-800 mr-3"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Administrator Login
          </h1>
        </div>

        <AdminLogin />
      </div>
    );
  }

  // Show admin dashboard with navigation
  return (
    <AdminMobileNavigation
      currentTab={currentTab}
      onTabChange={handleTabChange}
    >
      {renderTabContent()}
    </AdminMobileNavigation>
  );
};

export default AdminApp;
