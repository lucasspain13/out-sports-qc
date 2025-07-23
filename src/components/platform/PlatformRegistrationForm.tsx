import React from "react";
import { usePlatform } from "../../hooks/usePlatform";
import RegistrationForm from "../ui/RegistrationForm";
import AndroidRegistrationForm from "./android/AndroidRegistrationForm";
import IOSRegistrationForm from "./ios/IOSRegistrationForm";

interface PlatformRegistrationFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}

const PlatformRegistrationForm: React.FC<PlatformRegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  const platform = usePlatform();

  // Render platform-specific forms for mobile
  if (platform.isMobile) {
    if (platform.isIOS) {
      return (
        <IOSRegistrationForm sportType={sportType} onSuccess={onSuccess} />
      );
    } else if (platform.isAndroid) {
      return (
        <AndroidRegistrationForm sportType={sportType} onSuccess={onSuccess} />
      );
    }
  }

  // Fallback to original form for web/desktop
  return <RegistrationForm sportType={sportType} onSuccess={onSuccess} />;
};

export default PlatformRegistrationForm;
