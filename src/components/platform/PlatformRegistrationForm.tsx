import React from "react";
import RegistrationForm from "../ui/RegistrationForm";

interface PlatformRegistrationFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}

const PlatformRegistrationForm: React.FC<PlatformRegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  // Use the main registration form for all platforms for now
  // This ensures consistency and avoids mobile-specific issues
  return <RegistrationForm sportType={sportType} onSuccess={onSuccess} />;
};

export default PlatformRegistrationForm;
