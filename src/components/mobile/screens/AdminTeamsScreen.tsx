import React from "react";
import { usePlatform } from "../../../hooks/usePlatform";
import { TeamManagement } from "../../admin/TeamManagement";

const AdminTeamsScreen: React.FC = () => {
  const platform = usePlatform();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={getHeaderClasses()}>
        <h1 className={getTitleClasses()}>Team Management</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <TeamManagement />
      </div>
    </div>
  );
};

export default AdminTeamsScreen;
