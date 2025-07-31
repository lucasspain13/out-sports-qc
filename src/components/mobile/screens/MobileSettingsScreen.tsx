import React, { useState } from "react";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import { usePlatform } from "../../../hooks/usePlatform";

interface MobileSettingsScreenProps {
  onBack: () => void;
}

const MobileSettingsScreen: React.FC<MobileSettingsScreenProps> = ({
  onBack,
}) => {
  const { resetOnboarding, userRole } = useOnboarding();
  const { isIOS, isAndroid } = usePlatform();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleResetRole = () => {
    resetOnboarding();
    // This will trigger a re-render and show the role selection screen
  };

  const getButtonClasses = (
    variant: "danger" | "primary" | "secondary" = "primary"
  ) => {
    const baseClasses =
      "w-full p-3 rounded-lg font-medium transition-all duration-200 active:scale-95";

    if (isIOS) {
      switch (variant) {
        case "danger":
          return `${baseClasses} bg-red-500 text-white shadow-lg active:bg-red-600`;
        case "primary":
          return `${baseClasses} bg-blue-500 text-white shadow-lg active:bg-blue-600`;
        case "secondary":
          return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200 active:bg-gray-200`;
      }
    } else if (isAndroid) {
      switch (variant) {
        case "danger":
          return `${baseClasses} bg-red-600 text-white shadow-md elevation-2 active:elevation-4 active:bg-red-700`;
        case "primary":
          return `${baseClasses} bg-blue-600 text-white shadow-md elevation-2 active:elevation-4 active:bg-blue-700`;
        case "secondary":
          return `${baseClasses} bg-white text-gray-700 border border-gray-300 shadow-sm active:bg-gray-50`;
      }
    }

    // Web fallback
    switch (variant) {
      case "danger":
        return `${baseClasses} bg-red-600 text-white shadow-md hover:bg-red-700`;
      case "primary":
        return `${baseClasses} bg-blue-600 text-white shadow-md hover:bg-blue-700`;
      case "secondary":
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50`;
    }
  };

  const getHeaderClasses = () => {
    if (isIOS) {
      return "bg-white border-b border-gray-200";
    } else if (isAndroid) {
      return "bg-blue-600 text-white shadow-md elevation-4";
    }
    return "bg-white border-b border-gray-200";
  };

  const getBackButtonClasses = () => {
    if (isAndroid) {
      return "text-white hover:text-gray-200";
    }
    return "text-gray-600 hover:text-gray-800";
  };

  const getHeaderTextClasses = () => {
    if (isAndroid) {
      return "text-xl font-semibold text-white";
    }
    return "text-xl font-semibold text-gray-900";
  };

  if (showConfirmDialog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="text-orange-500 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Reset User Role?
            </h2>
            <p className="text-gray-600 text-sm">
              This will sign you out and return you to the role selection
              screen. You'll need to choose your role again.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResetRole}
              className={getButtonClasses("danger")}
            >
              Yes, Reset Role
            </button>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className={getButtonClasses("secondary")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${getHeaderClasses()} px-4 py-3 flex items-center`}>
        <button onClick={onBack} className={`${getBackButtonClasses()} mr-3`}>
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
        <h1 className={getHeaderTextClasses()}>Settings</h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Current Role Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Current Role
          </h2>
          <p className="text-gray-600 mb-3">
            You are currently using the app as an{" "}
            <span className="font-medium text-blue-600">
              {userRole === "admin" ? "Administrator" : "Player"}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            {userRole === "admin"
              ? "You have access to administrative features like managing leagues and games."
              : "You can view schedules, scores, and team information."}
          </p>
        </div>

        {/* Reset Role Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Change Role
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            If you need to switch between administrator and player modes, you
            can reset your role selection.
          </p>
          <button
            onClick={() => setShowConfirmDialog(true)}
            className={getButtonClasses("danger")}
          >
            Reset User Role
          </button>
        </div>

        {/* App Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Out Sports League Mobile App</p>
            <p>Version 1.0.0</p>
            <p className="pt-2 text-xs text-gray-400">
              © 2025 Out Sports League. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSettingsScreen;
