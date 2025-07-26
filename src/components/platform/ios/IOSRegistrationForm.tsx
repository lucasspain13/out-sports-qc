import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { supabase } from "../../../lib/supabase";

interface IOSRegistrationFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  emergencyContactName: string;
  emergencyContactPhone: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  howDidYouHear: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  agreeToTerms: boolean;
  agreeToEmailUpdates: boolean;
}

const IOSRegistrationForm: React.FC<IOSRegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shirtSize: "M",
    emergencyContactName: "",
    emergencyContactPhone: "",
    experienceLevel: "beginner",
    howDidYouHear: "",
    dietaryRestrictions: "",
    medicalConditions: "",
    agreeToTerms: false,
    agreeToEmailUpdates: true,
  });

  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "☄️" : "🏐";

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const experienceLevels = [
    { value: "beginner", label: "Beginner - New to this!", emoji: "🌱" },
    {
      value: "intermediate",
      label: "Intermediate - Some experience",
      emoji: "⭐",
    },
    { value: "advanced", label: "Advanced - Experienced player", emoji: "🏆" },
  ];

  const hearAboutOptions = [
    "Social Media",
    "Friend Referral",
    "Google Search",
    "Community Board",
    "Previous Season Player",
    "Other",
  ];

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      case 2:
        return !!(
          formData.emergencyContactName &&
          formData.emergencyContactPhone &&
          formData.shirtSize
        );
      case 3:
        return !!formData.experienceLevel;
      case 4:
        return formData.agreeToTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      // Show iOS-style alert
      showNotification({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in all required fields to continue.",
        duration: 3000,
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      showNotification({
        type: "error",
        title: "Agreement Required",
        message: "Please agree to the terms and conditions to continue.",
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("player_registrations").insert([
        {
          sport_type: sportType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          shirt_size: formData.shirtSize,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          experience_level: formData.experienceLevel,
          how_did_you_hear: formData.howDidYouHear,
          dietary_restrictions: formData.dietaryRestrictions || null,
          medical_conditions: formData.medicalConditions || null,
          agree_to_terms: formData.agreeToTerms,
          agree_to_email_updates: formData.agreeToEmailUpdates,
          registration_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      showNotification({
        type: "success",
        title: "Registration Successful!",
        message: `Welcome to the ${sportDisplayName} League! We'll be in touch soon.`,
        duration: 8000,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        shirtSize: "M",
        emergencyContactName: "",
        emergencyContactPhone: "",
        experienceLevel: "beginner",
        howDidYouHear: "",
        dietaryRestrictions: "",
        medicalConditions: "",
        agreeToTerms: false,
        agreeToEmailUpdates: true,
      });

      setCurrentStep(1);
      onSuccess?.();
    } catch (error: any) {
      console.error("Registration error:", error);
      showNotification({
        type: "error",
        title: "Registration Failed",
        message: error.message || "Something went wrong. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="ios-form-section">
      <div className="ios-section-header">
        <h3 className="ios-section-title">Personal Information</h3>
      </div>
      <div className="ios-grouped-table">
        <div className="ios-table-cell">
          <label className="ios-cell-label">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={e => handleInputChange("firstName", e.target.value)}
            className="ios-text-input"
            placeholder="First name"
            required
          />
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={e => handleInputChange("lastName", e.target.value)}
            className="ios-text-input"
            placeholder="Last name"
            required
          />
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleInputChange("email", e.target.value)}
            className="ios-text-input"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => handleInputChange("phone", e.target.value)}
            className="ios-text-input"
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="ios-form-section">
      <div className="ios-section-header">
        <h3 className="ios-section-title">Emergency Contact & Sizing</h3>
      </div>
      <div className="ios-grouped-table">
        <div className="ios-table-cell">
          <label className="ios-cell-label">Emergency Contact Name</label>
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={e =>
              handleInputChange("emergencyContactName", e.target.value)
            }
            className="ios-text-input"
            placeholder="Contact person's name"
            required
          />
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">Emergency Contact Phone</label>
          <input
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={e =>
              handleInputChange("emergencyContactPhone", e.target.value)
            }
            className="ios-text-input"
            placeholder="(555) 123-4567"
            required
          />
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">Shirt Size</label>
          <select
            value={formData.shirtSize}
            onChange={e => handleInputChange("shirtSize", e.target.value)}
            className="ios-select-input"
            required
          >
            {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="ios-table-cell">
          <label className="ios-cell-label">How did you hear about us?</label>
          <select
            value={formData.howDidYouHear}
            onChange={e => handleInputChange("howDidYouHear", e.target.value)}
            className="ios-select-input"
          >
            <option value="">Select an option</option>
            {hearAboutOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="ios-form-section">
      <div className="ios-section-header">
        <h3 className="ios-section-title">Experience & Preferences</h3>
      </div>

      <div className="ios-grouped-table mb-6">
        <div className="ios-section-header-small">
          <h4 className="ios-section-subtitle">Experience Level</h4>
        </div>
        {experienceLevels.map(level => (
          <label key={level.value} className="ios-table-cell ios-radio-cell">
            <div className="ios-radio-content">
              <span className="ios-radio-emoji">{level.emoji}</span>
              <span className="ios-radio-label">{level.label}</span>
            </div>
            <input
              type="radio"
              name="experienceLevel"
              value={level.value}
              checked={formData.experienceLevel === level.value}
              onChange={e =>
                handleInputChange("experienceLevel", e.target.value)
              }
              className="ios-radio-input"
            />
          </label>
        ))}
      </div>

      <div className="ios-grouped-table">
        <div className="ios-table-cell ios-textarea-cell">
          <label className="ios-cell-label">
            Dietary Restrictions or Allergies
          </label>
          <textarea
            value={formData.dietaryRestrictions}
            onChange={e =>
              handleInputChange("dietaryRestrictions", e.target.value)
            }
            rows={3}
            className="ios-textarea-input"
            placeholder="Please list any dietary restrictions..."
          />
        </div>
        <div className="ios-table-cell ios-textarea-cell">
          <label className="ios-cell-label">
            Medical Conditions or Injuries
          </label>
          <textarea
            value={formData.medicalConditions}
            onChange={e =>
              handleInputChange("medicalConditions", e.target.value)
            }
            rows={3}
            className="ios-textarea-input"
            placeholder="Please list any medical conditions we should know about..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="ios-form-section">
      <div className="ios-section-header">
        <h3 className="ios-section-title">Terms & Agreements</h3>
      </div>
      <div className="ios-grouped-table">
        <label className="ios-table-cell ios-switch-cell">
          <div className="ios-switch-content">
            <div className="ios-switch-text">
              <span className="ios-switch-title">Terms and Conditions</span>
              <span className="ios-switch-subtitle">
                I agree to the terms and conditions and understand the risks of
                participating in {sportDisplayName.toLowerCase()} activities.
              </span>
            </div>
            <div className="ios-switch">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={e =>
                  handleInputChange("agreeToTerms", e.target.checked)
                }
                className="ios-switch-input"
              />
              <span className="ios-switch-slider"></span>
            </div>
          </div>
        </label>

        <label className="ios-table-cell ios-switch-cell">
          <div className="ios-switch-content">
            <div className="ios-switch-text">
              <span className="ios-switch-title">Email Updates</span>
              <span className="ios-switch-subtitle">
                I would like to receive email updates about league news, events,
                and schedules.
              </span>
            </div>
            <div className="ios-switch">
              <input
                type="checkbox"
                checked={formData.agreeToEmailUpdates}
                onChange={e =>
                  handleInputChange("agreeToEmailUpdates", e.target.checked)
                }
                className="ios-switch-input"
              />
              <span className="ios-switch-slider"></span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="ios-form-container"
    >
      {/* Header */}
      <div className="ios-form-header">
        <div className="ios-form-title-container">
          <span className="ios-form-emoji">{sportEmoji}</span>
          <div>
            <h2 className="ios-form-title">Join {sportDisplayName}</h2>
            <p className="ios-form-subtitle">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="ios-progress-container">
          <div className="ios-progress-bar">
            <div
              className="ios-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="ios-progress-text">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="ios-form-content">{renderCurrentStep()}</div>

      {/* Navigation */}
      <div className="ios-form-navigation">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="ios-button ios-button-secondary"
          >
            Back
          </button>
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className="ios-button ios-button-primary"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !validateStep(currentStep)}
            className="ios-button ios-button-primary"
          >
            {loading ? (
              <>
                <div className="ios-spinner" />
                Processing...
              </>
            ) : (
              <>{sportEmoji} Join League</>
            )}
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default IOSRegistrationForm;
