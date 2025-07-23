import React from "react";
import ReactDOM from "react-dom/client";
import { initializeMobileApp } from "./capacitor-mobile";
import { PlatformFontProvider } from "./components/PlatformFontProvider";
import MobileApp from "./components/mobile/MobileApp";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import "./index.css";
import { performSecurityChecks } from "./lib/productionSecurity";
import { SecurityManager } from "./lib/security";

// Perform security checks before app initialization
performSecurityChecks();

// Apply security headers
SecurityManager.applyClientSecurityHeaders();

// Initialize mobile app if running on native platform
initializeMobileApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlatformFontProvider>
      <NotificationProvider>
        <OnboardingProvider>
          <AuthProvider>
            <MobileApp />
          </AuthProvider>
        </OnboardingProvider>
      </NotificationProvider>
    </PlatformFontProvider>
  </React.StrictMode>
);
