import React from "react";
import App from "../../App";
import { useOnboarding } from "../../contexts/OnboardingContext";
import AdminApp from "./AdminApp";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";

const MobileApp: React.FC = () => {
  const { hasCompletedOnboarding, userRole, isNativePlatform } =
    useOnboarding();

  console.log("MobileApp render:", {
    isNativePlatform,
    hasCompletedOnboarding,
    userRole,
  });

  // If not on native platform, render regular app
  if (!isNativePlatform) {
    console.log("MobileApp: Rendering regular app for web platform");
    return <App />;
  }

  // If onboarding not completed, show role selection
  if (!hasCompletedOnboarding) {
    console.log("MobileApp: Rendering role selection screen");
    return (
      <RoleSelectionScreen
        onComplete={() => {
          console.log("Role selection completed");
          // The onComplete callback is handled by the RoleSelectionScreen itself
          // through the OnboardingContext
        }}
      />
    );
  }

  console.log("MobileApp: Routing based on user role:", userRole);

  // Route based on user role
  switch (userRole) {
    case "admin":
      console.log("MobileApp: Rendering AdminApp");
      return <AdminApp />;
    case "user":
    default:
      console.log("MobileApp: Rendering regular App");
      return <App />;
  }
};

export default MobileApp;
