import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import { usePlatform } from "../../../hooks/usePlatform";
import { AnnouncementManagement } from "../../admin/AnnouncementManagement";
import { LiveScoreBoard } from "../../admin/LiveScoreBoard";
import { LocationManagement } from "../../admin/LocationManagement";
import { RegistrationManagement } from "../../admin/RegistrationManagement";

type MoreScreenView =
  | "menu"
  | "announcements"
  | "locations"
  | "registrations"
  | "live-scores";

const AdminMoreScreen: React.FC = () => {
  const platform = usePlatform();
  const { signOut } = useAuth();
  const { resetOnboarding } = useOnboarding();
  const [currentView, setCurrentView] = useState<MoreScreenView>("menu");

  const getHeaderClasses = () => {
    if (platform.isIOS) {
      return "bg-white border-b border-gray-200 px-4 py-6 pt-12";
    } else if (platform.isAndroid) {
      return "bg-blue-600 text-white px-4 py-4 pt-8 shadow-md elevation-4";
    }
    return "bg-white border-b border-gray-200 px-4 py-6";
  };

  const getTitleClasses = () => {
    if (platform.isIOS) {
      return "text-3xl font-bold text-gray-900";
    } else if (platform.isAndroid) {
      return "text-2xl font-medium text-white";
    }
    return "text-2xl font-bold text-gray-900";
  };

  const getBackButtonClasses = () => {
    if (platform.isAndroid) {
      return "text-white hover:text-gray-200 mr-3";
    }
    return "text-gray-600 hover:text-gray-800 mr-3";
  };

  const getMenuItemClasses = () => {
    const baseClasses =
      "flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-3 active:scale-95 transition-all duration-200";

    if (platform.isIOS) {
      return `${baseClasses} border border-gray-100`;
    } else if (platform.isAndroid) {
      return `${baseClasses} elevation-2 active:elevation-4`;
    }
    return baseClasses;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // After sign out, the user will be redirected to login
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSwitchRole = () => {
    resetOnboarding();
    // This will trigger the role selection screen
  };

  if (currentView === "announcements") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={getHeaderClasses()}>
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("menu")}
              className={getBackButtonClasses()}
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
            <h1 className={getTitleClasses()}>Announcements</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <AnnouncementManagement />
        </div>
      </div>
    );
  }

  if (currentView === "locations") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={getHeaderClasses()}>
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("menu")}
              className={getBackButtonClasses()}
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
            <h1 className={getTitleClasses()}>Locations</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <LocationManagement />
        </div>
      </div>
    );
  }

  if (currentView === "registrations") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={getHeaderClasses()}>
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("menu")}
              className={getBackButtonClasses()}
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
            <h1 className={getTitleClasses()}>Registrations</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <RegistrationManagement />
        </div>
      </div>
    );
  }

  if (currentView === "live-scores") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className={getHeaderClasses()}>
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView("menu")}
              className={getBackButtonClasses()}
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
            <h1 className={getTitleClasses()}>Live Scores</h1>
          </div>
        </div>
        <div className="px-4 py-6">
          <LiveScoreBoard />
        </div>
      </div>
    );
  }

  // Main menu view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={getHeaderClasses()}>
        <h1 className={getTitleClasses()}>More</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Additional Admin Features */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Features
          </h2>

          <button
            onClick={() => setCurrentView("announcements")}
            className={getMenuItemClasses()}
          >
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Announcements</div>
                <div className="text-sm text-gray-500">
                  Manage league announcements
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            onClick={() => setCurrentView("registrations")}
            className={getMenuItemClasses()}
          >
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Registrations</div>
                <div className="text-sm text-gray-500">
                  Manage player registrations
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            onClick={() => setCurrentView("live-scores")}
            className={getMenuItemClasses()}
          >
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-orange-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  Live Score Board
                </div>
                <div className="text-sm text-gray-500">
                  Update live game scores
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button
            onClick={() => setCurrentView("locations")}
            className={getMenuItemClasses()}
          >
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-purple-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Locations</div>
                <div className="text-sm text-gray-500">
                  Manage game locations
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Account Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>

          <button onClick={handleSwitchRole} className={getMenuItemClasses()}>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900">Switch Role</div>
                <div className="text-sm text-gray-500">
                  Change to player mode
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <button onClick={handleSignOut} className={getMenuItemClasses()}>
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-red-600">Sign Out</div>
                <div className="text-sm text-gray-500">
                  Sign out of admin account
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMoreScreen;
