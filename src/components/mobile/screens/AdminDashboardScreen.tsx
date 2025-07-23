import React from "react";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import { usePlatform } from "../../../hooks/usePlatform";
import { DashboardOverview } from "../../admin/DashboardOverview";

interface AdminDashboardScreenProps {
  onNavigate?: (tabId: string) => void;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onNavigate,
}) => {
  const platform = usePlatform();
  const { resetOnboarding } = useOnboarding();

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

  const getSettingsButtonClasses = () => {
    const baseClasses =
      "w-10 h-10 rounded-full flex items-center justify-center transition-colors";
    if (platform.isIOS) {
      return `${baseClasses} bg-gray-100 hover:bg-gray-200`;
    } else if (platform.isAndroid) {
      return `${baseClasses} bg-white/10 hover:bg-white/20`;
    }
    return `${baseClasses} bg-gray-100 hover:bg-gray-200`;
  };

  const getSettingsIconClasses = () => {
    if (platform.isAndroid) {
      return "w-5 h-5 text-white";
    }
    return "w-5 h-5 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={getHeaderClasses()}>
        <div className="flex items-center justify-between">
          <h1 className={getTitleClasses()}>Admin Dashboard</h1>
          <button
            onClick={() => resetOnboarding()}
            className={getSettingsButtonClasses()}
            title="Switch Role"
          >
            <svg
              className={getSettingsIconClasses()}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <DashboardOverview onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
