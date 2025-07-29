import React, { useState } from "react";
import { useAuth, useAuthOperations } from "../../hooks/useAuth";
import { navigateTo } from "../../lib/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const { user } = useAuth();
  const { handleSignOut } = useAuthOperations();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await handleSignOut();
    navigateTo("admin-login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "content", label: "Site Content", icon: "📝" },
    { id: "core-values", label: "Core Values", icon: "⭐" },
    { id: "leadership", label: "Leadership", icon: "👥" },
    { id: "testimonials", label: "Testimonials", icon: "💬" },
    { id: "faqs", label: "FAQs", icon: "❓" },
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "hero-content", label: "Hero Content", icon: "🖼️" },
    { id: "sports-info", label: "Sports Info", icon: "☄️" },
    { id: "about-features", label: "About Features", icon: "✨" },
    { id: "site-settings", label: "Site Settings", icon: "⚙️" },
    { id: "announcements", label: "Announcements", icon: "📢" },
    { id: "live-scores", label: "Live Scores", icon: "⚡" },
    { id: "registrations", label: "Registrations", icon: "📝" },
    { id: "teams", label: "Teams", icon: "👥" },
    { id: "players", label: "Players", icon: "🏃" },
    { id: "games", label: "Games", icon: "🏆" },
    { id: "locations", label: "Locations", icon: "📍" },
    { id: "feedback", label: "Website Feedback", icon: "💭" },
  ];

  // Mobile Tab Bar Component for iOS-style navigation
  const MobileTabBar: React.FC = () => (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 ios-tab-bar">
      <div className="ios-tab-bar-background ios-tab-bar-scrollable">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              onPageChange(item.id);
              setSidebarOpen(false);
            }}
            className={`ios-tab-item ios-tab-item-scrollable ${
              currentPage === item.id ? "active" : ""
            }`}
          >
            <div className="ios-tab-icon">
              <span className="text-xl">{item.icon}</span>
            </div>
            <span className="ios-tab-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Mobile Header for iOS-style top navigation
  const MobileHeader: React.FC = () => (
    <div className="sm:hidden bg-white border-b border-gray-200 px-safe pt-safe">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-semibold text-gray-900">
          {menuItems.find(item => item.id === currentPage)?.label ||
            "Dashboard"}
        </h1>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
          aria-label="Sign out"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 0v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Layout - iOS Style */}
      <div className="sm:hidden min-h-screen bg-gray-50">
        <MobileHeader />

        {/* Main content with proper padding for mobile */}
        <main
          className="px-safe py-4"
          style={{
            paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="px-4">{children}</div>
        </main>

        <MobileTabBar />
      </div>

      {/* Desktop/Tablet Layout - Existing Sidebar Design */}
      <div className="hidden sm:flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
        >
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600 flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 overflow-y-auto py-4" style={{ paddingBottom: '6rem' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User info and logout at bottom of sidebar - Fixed position */}
          <div className="flex-shrink-0 p-4 border-t bg-gray-50">
            <div className="text-xs text-gray-600 mb-2 truncate">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile menu button - positioned absolutely for mobile when header is removed */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white shadow-md"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">{children}</div>
          </main>
        </div>

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};
