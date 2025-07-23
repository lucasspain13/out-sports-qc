import React, { useState } from "react";
import AboutFeaturesManagement from "../admin/AboutFeaturesManagement";
import { AdminLayout } from "../admin/AdminLayout";
import { AnnouncementManagement } from "../admin/AnnouncementManagement";
import ContentManagement from "../admin/ContentManagement";
import CoreValuesManagement from "../admin/CoreValuesManagement";
import { DashboardOverview } from "../admin/DashboardOverview";
import { FAQManagement } from "../admin/FAQManagement";
import { GameManagement } from "../admin/GameManagement";
import { HeroContentManagement } from "../admin/HeroContentManagement";
import LeadershipManagement from "../admin/LeadershipManagement";
import { LiveScoreBoard } from "../admin/LiveScoreBoard";
import { LocationManagement } from "../admin/LocationManagement";
import { PlayerManagement } from "../admin/PlayerManagement";
import { RegistrationManagement } from "../admin/RegistrationManagement";
import SiteSettingsManagement from "../admin/SiteSettingsManagement";
import { SportsInfoManagement } from "../admin/SportsInfoManagement";
import { TeamManagement } from "../admin/TeamManagement";
import TestimonialsManagement from "../admin/TestimonialsManagement";
import { TimelineManagement } from "../admin/TimelineManagement";
import { ProtectedRoute } from "../auth/ProtectedRoute";

const AdminDashboardContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview onNavigate={setCurrentPage} />;
      case "content":
        return <ContentManagement />;
      case "core-values":
        return <CoreValuesManagement />;
      case "leadership":
        return <LeadershipManagement />;
      case "testimonials":
        return <TestimonialsManagement />;
      case "faqs":
        return <FAQManagement />;
      case "timeline":
        return <TimelineManagement />;
      case "hero-content":
        return <HeroContentManagement />;
      case "sports-info":
        return <SportsInfoManagement />;
      case "about-features":
        return <AboutFeaturesManagement />;
      case "site-settings":
        return <SiteSettingsManagement />;
      case "announcements":
        return <AnnouncementManagement />;
      case "registrations":
        return <RegistrationManagement />;
      case "teams":
        return <TeamManagement />;
      case "players":
        return <PlayerManagement />;
      case "games":
        return <GameManagement />;
      case "live-scores":
        return <LiveScoreBoard />;
      case "locations":
        return <LocationManagement />;
      default:
        return <DashboardOverview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
};
