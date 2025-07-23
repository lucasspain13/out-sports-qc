import React from "react";
import { useOnboarding } from "../../../contexts/OnboardingContext";
import { usePlatform } from "../../../hooks/usePlatform";

interface RoleSelectionScreenProps {
  onComplete: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onComplete,
}) => {
  const { setUserRole, completeOnboarding } = useOnboarding();
  const { isIOS, isAndroid } = usePlatform();

  console.log("RoleSelectionScreen: Rendering role selection screen", {
    isIOS,
    isAndroid,
  });

  const handleRoleSelect = (role: "user" | "admin") => {
    console.log("RoleSelectionScreen: Role selected:", role);
    setUserRole(role);
    completeOnboarding();
    onComplete();
  };

  // Platform-specific styling
  const getButtonClasses = (variant: "primary" | "secondary" = "primary") => {
    const baseClasses =
      "w-full p-4 rounded-lg font-semibold transition-all duration-200 active:scale-95";

    if (isIOS) {
      if (variant === "primary") {
        return `${baseClasses} bg-blue-500 text-white shadow-lg active:bg-blue-600`;
      } else {
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200 active:bg-gray-200`;
      }
    } else if (isAndroid) {
      if (variant === "primary") {
        return `${baseClasses} bg-blue-600 text-white shadow-md elevation-2 active:elevation-4 active:bg-blue-700`;
      } else {
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 shadow-sm active:bg-gray-50`;
      }
    } else {
      // Web fallback
      if (variant === "primary") {
        return `${baseClasses} bg-blue-600 text-white shadow-md hover:bg-blue-700`;
      } else {
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50`;
      }
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "min-h-screen flex items-center justify-center px-6";

    if (isIOS) {
      return `${baseClasses} bg-gray-50`;
    } else if (isAndroid) {
      return `${baseClasses} bg-blue-50`;
    } else {
      return `${baseClasses} bg-gray-50`;
    }
  };

  const getCardClasses = () => {
    const baseClasses = "w-full max-w-md p-8 rounded-xl";

    if (isIOS) {
      return `${baseClasses} bg-white shadow-lg`;
    } else if (isAndroid) {
      return `${baseClasses} bg-white shadow-xl elevation-8`;
    } else {
      return `${baseClasses} bg-white shadow-lg`;
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className={getCardClasses()}>
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Out Sports League"
            className="h-16 w-16 mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Out Sports League
          </h1>
          <p className="text-gray-600 text-sm">
            Let us know how you'll be using the app
          </p>
        </div>

        {/* Role Selection Options */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => handleRoleSelect("user")}
            className={getButtonClasses("secondary")}
          >
            <div className="text-left">
              <div className="text-lg font-semibold mb-1">I'm a Player</div>
              <div className="text-sm text-gray-500">
                View schedules, scores, and team information
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect("admin")}
            className={getButtonClasses("primary")}
          >
            <div className="text-left">
              <div className="text-lg font-semibold mb-1">
                I'm an Administrator
              </div>
              <div className="text-sm text-white/90">
                Manage leagues, teams, and game schedules
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            You can change this later in the app settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
