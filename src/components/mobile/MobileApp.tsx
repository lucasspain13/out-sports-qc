import React from "react";
import App from "../../App";
import { useOnboarding } from "../../contexts/OnboardingContext";
import AdminApp from "./AdminApp";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";

const MobileApp: React.FC = () => {
  const { hasCompletedOnboarding, userRole, isNativePlatform } =
    useOnboarding();

  // If not on native platform, render regular app
  if (!isNativePlatform) {
    return <App />;
  }

  // If onboarding not completed, show role selection
  if (!hasCompletedOnboarding) {
    return (
      <RoleSelectionScreen
        onComplete={() => {
          // The onComplete callback is handled by the RoleSelectionScreen itself
          // through the OnboardingContext
        }}
      />
    );
  }

  // Route based on user role
  switch (userRole) {
    case "admin":
      return <AdminApp />;
    case "user":
    default:
      return <App />;
  }
};

export default MobileApp;
