import { Capacitor } from "@capacitor/core";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "user" | "admin" | null;

interface OnboardingContextType {
  userRole: UserRole;
  hasCompletedOnboarding: boolean;
  setUserRole: (role: UserRole) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  isNativePlatform: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  USER_ROLE: "out-sports-user-role",
  ONBOARDING_COMPLETED: "out-sports-onboarding-completed",
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced platform detection for better simulator support
  // Add URL parameter override for testing: ?forceRoleSelection=true
  const urlParams = new URLSearchParams(window.location.search);
  const forceRoleSelection = urlParams.get("forceRoleSelection") === "true";
  const shouldResetOnboarding = urlParams.get("resetOnboarding") === "true";

  const isNativePlatform = Capacitor.isNativePlatform() || forceRoleSelection;

  console.log("OnboardingProvider: Platform detection", {
    capacitorIsNative: Capacitor.isNativePlatform(),
    forceRoleSelection,
    shouldResetOnboarding,
    finalIsNative: isNativePlatform,
    platform: Capacitor.getPlatform(),
  });

  // Initialize from storage on mount
  useEffect(() => {
    const initializeOnboarding = () => {
      console.log("OnboardingProvider: Initializing...", {
        isNativePlatform,
        shouldResetOnboarding,
      });

      // Clear onboarding if reset parameter is set
      if (shouldResetOnboarding) {
        console.log(
          "OnboardingProvider: Resetting onboarding due to URL parameter"
        );
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      }

      try {
        // Only check onboarding for native platforms
        if (isNativePlatform) {
          const storedRole = localStorage.getItem(
            STORAGE_KEYS.USER_ROLE
          ) as UserRole;
          const storedOnboarding =
            localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === "true";

          console.log("OnboardingProvider: Native platform detected", {
            storedRole,
            storedOnboarding,
            keys: STORAGE_KEYS,
          });

          setUserRoleState(storedRole);
          setHasCompletedOnboarding(storedOnboarding);
        } else {
          console.log(
            "OnboardingProvider: Web platform detected, skipping onboarding"
          );
          // For web, skip onboarding
          setHasCompletedOnboarding(true);
          setUserRoleState("user"); // Default to user role for web
        }
      } catch (error) {
        console.error("Error initializing onboarding:", error);
        // Fallback to not completed
        setHasCompletedOnboarding(!isNativePlatform);
        setUserRoleState(isNativePlatform ? null : "user");
      }
      setIsLoading(false);
    };

    initializeOnboarding();
  }, [isNativePlatform, shouldResetOnboarding]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role && isNativePlatform) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    if (isNativePlatform) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
    }
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setUserRoleState(null);
    if (isNativePlatform) {
      localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    }
  };

  // Don't render children until onboarding state is loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingContext.Provider
      value={{
        userRole,
        hasCompletedOnboarding,
        setUserRole,
        completeOnboarding,
        resetOnboarding,
        isNativePlatform,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
