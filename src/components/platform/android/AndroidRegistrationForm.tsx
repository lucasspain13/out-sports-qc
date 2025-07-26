import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNotification } from "../../../contexts/NotificationContext";
import { supabase } from "../../../lib/supabase";

interface AndroidRegistrationFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  preferredPronouns: string;
  age: string;
  email: string;
  phone: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
  emergencyContactName: string;
  emergencyContactPhone: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  dietaryRestrictions: string;
  medicalConditions: string;
  agreeToTerms: boolean;
  agreeToEmailUpdates: boolean;
}

const AndroidRegistrationForm: React.FC<AndroidRegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    preferredPronouns: "",
    age: "",
    email: "",
    phone: "",
    shirtSize: "M",
    emergencyContactName: "",
    emergencyContactPhone: "",
    experienceLevel: "beginner",
    dietaryRestrictions: "",
    medicalConditions: "",
    agreeToTerms: false,
    agreeToEmailUpdates: true,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
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
      // Show Material Design snackbar
      showNotification({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in all required fields to continue.",
        duration: 4000,
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
          preferred_pronouns: formData.preferredPronouns,
          age: parseInt(formData.age),
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          shirt_size: formData.shirtSize,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          experience_level: formData.experienceLevel,
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
    <div className="android-form-section">
      <h3 className="android-section-title">Personal Information</h3>
      <div className="android-form-fields">
        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "firstName" ? "focused" : ""
            }`}
          >
            <input
              type="text"
              value={formData.firstName}
              onChange={e => handleInputChange("firstName", e.target.value)}
              onFocus={() => handleFocus("firstName")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.firstName ? "filled" : ""
              }`}
            >
              First Name *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "lastName" ? "focused" : ""
            }`}
          >
            <input
              type="text"
              value={formData.lastName}
              onChange={e => handleInputChange("lastName", e.target.value)}
              onFocus={() => handleFocus("lastName")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.lastName ? "filled" : ""
              }`}
            >
              Last Name *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "email" ? "focused" : ""
            }`}
          >
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.email ? "filled" : ""
              }`}
            >
              Email Address *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "phone" ? "focused" : ""
            }`}
          >
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange("phone", e.target.value)}
              onFocus={() => handleFocus("phone")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.phone ? "filled" : ""
              }`}
            >
              Phone Number *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="android-form-section">
      <h3 className="android-section-title">Emergency Contact & Sizing</h3>
      <div className="android-form-fields">
        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "emergencyContactName" ? "focused" : ""
            }`}
          >
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={e =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              onFocus={() => handleFocus("emergencyContactName")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.emergencyContactName ? "filled" : ""
              }`}
            >
              Emergency Contact Name *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-textfield-container">
          <div
            className={`android-textfield ${
              focusedField === "emergencyContactPhone" ? "focused" : ""
            }`}
          >
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={e =>
                handleInputChange("emergencyContactPhone", e.target.value)
              }
              onFocus={() => handleFocus("emergencyContactPhone")}
              onBlur={handleBlur}
              className="android-textfield-input"
              required
            />
            <label
              className={`android-textfield-label ${
                formData.emergencyContactPhone ? "filled" : ""
              }`}
            >
              Emergency Contact Phone *
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-select-container">
          <label className="android-select-label">Shirt Size *</label>
          <select
            value={formData.shirtSize}
            onChange={e => handleInputChange("shirtSize", e.target.value)}
            className="android-select-input"
            required
          >
            {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="android-select-container">
          <label className="android-select-label">
            How did you hear about us?
          </label>
          <select
            value={formData.howDidYouHear}
            onChange={e => handleInputChange("howDidYouHear", e.target.value)}
            className="android-select-input"
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
    <div className="android-form-section">
      <h3 className="android-section-title">Experience & Preferences</h3>

      <div className="android-radio-group">
        <h4 className="android-radio-group-title">Experience Level *</h4>
        {experienceLevels.map(level => (
          <label key={level.value} className="android-radio-item">
            <input
              type="radio"
              name="experienceLevel"
              value={level.value}
              checked={formData.experienceLevel === level.value}
              onChange={e =>
                handleInputChange("experienceLevel", e.target.value)
              }
              className="android-radio-input"
            />
            <div className="android-radio-circle">
              <div className="android-radio-inner" />
            </div>
            <div className="android-radio-content">
              <span className="android-radio-emoji">{level.emoji}</span>
              <span className="android-radio-label">{level.label}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="android-form-fields">
        <div className="android-textfield-container">
          <div
            className={`android-textfield android-textfield-textarea ${
              focusedField === "dietaryRestrictions" ? "focused" : ""
            }`}
          >
            <textarea
              value={formData.dietaryRestrictions}
              onChange={e =>
                handleInputChange("dietaryRestrictions", e.target.value)
              }
              onFocus={() => handleFocus("dietaryRestrictions")}
              onBlur={handleBlur}
              rows={3}
              className="android-textarea-input"
            />
            <label
              className={`android-textfield-label ${
                formData.dietaryRestrictions ? "filled" : ""
              }`}
            >
              Dietary Restrictions or Allergies
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>

        <div className="android-textfield-container">
          <div
            className={`android-textfield android-textfield-textarea ${
              focusedField === "medicalConditions" ? "focused" : ""
            }`}
          >
            <textarea
              value={formData.medicalConditions}
              onChange={e =>
                handleInputChange("medicalConditions", e.target.value)
              }
              onFocus={() => handleFocus("medicalConditions")}
              onBlur={handleBlur}
              rows={3}
              className="android-textarea-input"
            />
            <label
              className={`android-textfield-label ${
                formData.medicalConditions ? "filled" : ""
              }`}
            >
              Medical Conditions or Injuries
            </label>
            <div className="android-textfield-underline" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="android-form-section">
      <h3 className="android-section-title">Terms & Agreements</h3>
      <div className="android-checkbox-group">
        <label className="android-checkbox-item">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={e => handleInputChange("agreeToTerms", e.target.checked)}
            className="android-checkbox-input"
          />
          <div className="android-checkbox-box">
            <svg className="android-checkbox-check" viewBox="0 0 24 24">
              <path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41L9 19l10.59-10.59a.996.996 0 1 0-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <div className="android-checkbox-content">
            <span className="android-checkbox-title">
              Terms and Conditions *
            </span>
            <span className="android-checkbox-subtitle">
              I agree to the terms and conditions and understand the risks of
              participating in {sportDisplayName.toLowerCase()} activities.
            </span>
          </div>
        </label>

        <label className="android-checkbox-item">
          <input
            type="checkbox"
            checked={formData.agreeToEmailUpdates}
            onChange={e =>
              handleInputChange("agreeToEmailUpdates", e.target.checked)
            }
            className="android-checkbox-input"
          />
          <div className="android-checkbox-box">
            <svg className="android-checkbox-check" viewBox="0 0 24 24">
              <path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41L9 19l10.59-10.59a.996.996 0 1 0-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <div className="android-checkbox-content">
            <span className="android-checkbox-title">Email Updates</span>
            <span className="android-checkbox-subtitle">
              I would like to receive email updates about league news, events,
              and schedules.
            </span>
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
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="android-form-container"
    >
      {/* App Bar */}
      <div className="android-app-bar">
        <div className="android-app-bar-content">
          <span className="android-form-emoji">{sportEmoji}</span>
          <div className="android-app-bar-title">
            <h2 className="android-form-title">Join {sportDisplayName}</h2>
            <p className="android-form-subtitle">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Linear Progress */}
        <div className="android-linear-progress">
          <div className="android-linear-progress-buffer" />
          <div
            className="android-linear-progress-primary"
            style={{ transform: `scaleX(${progressPercentage / 100})` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="android-form-content">{renderCurrentStep()}</div>

      {/* Navigation FAB and Button */}
      <div className="android-form-navigation">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="android-button android-button-text"
          >
            Back
          </button>
        )}

        <div className="android-nav-spacer" />

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!validateStep(currentStep)}
            className="android-fab"
          >
            <svg className="android-fab-icon" viewBox="0 0 24 24">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !validateStep(currentStep)}
            className="android-fab android-fab-submit"
          >
            {loading ? (
              <div className="android-circular-progress" />
            ) : (
              <svg className="android-fab-icon" viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default AndroidRegistrationForm;
