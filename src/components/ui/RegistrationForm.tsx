import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { supabase } from "../../lib/supabase";

interface RegistrationFormProps {
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

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
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
  const sportEmoji = sportType === "kickball" ? "⚽" : "🏐";

  const experienceLevels = [
    { value: "beginner", label: "Beginner - I'm new to this!", emoji: "🌱" },
    {
      value: "intermediate",
      label: "Intermediate - I've played before",
      emoji: "⭐",
    },
    { value: "advanced", label: "Advanced - I'm pretty good!", emoji: "🏆" },
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
        message: `Welcome to the ${sportDisplayName} League! We'll be in touch soon with next steps.`,
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">{sportEmoji}</div>
        <h3 className="heading-3 text-gray-900 mb-2">
          Join the {sportDisplayName} League!
        </h3>
        <p className="body-base text-gray-600">
          Fill out the form below to register for the upcoming season
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="heading-4 text-gray-900 border-b border-gray-200 pb-2">
            Personal Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => handleInputChange("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shirt Size *
            </label>
            <select
              value={formData.shirtSize}
              onChange={e => handleInputChange("shirtSize", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              required
            >
              {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="heading-4 text-gray-900 border-b border-gray-200 pb-2">
            Additional Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={e =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="Contact person's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={e =>
                handleInputChange("emergencyContactPhone", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Experience Level *
            </label>
            <div className="space-y-3">
              {experienceLevels.map(level => (
                <label
                  key={level.value}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level.value}
                    checked={formData.experienceLevel === level.value}
                    onChange={e =>
                      handleInputChange("experienceLevel", e.target.value)
                    }
                    className="h-4 w-4 text-brand-teal focus:ring-brand-teal focus:ring-offset-0"
                  />
                  <span className="ml-3 text-2xl">{level.emoji}</span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {level.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did you hear about us?
            </label>
            <select
              value={formData.howDidYouHear}
              onChange={e => handleInputChange("howDidYouHear", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300"
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

      {/* Full-width fields */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions or Allergies
          </label>
          <textarea
            value={formData.dietaryRestrictions}
            onChange={e =>
              handleInputChange("dietaryRestrictions", e.target.value)
            }
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300 resize-none"
            placeholder="Please list any dietary restrictions, allergies, or special accommodations..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions or Injuries
          </label>
          <textarea
            value={formData.medicalConditions}
            onChange={e =>
              handleInputChange("medicalConditions", e.target.value)
            }
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none transition-all duration-300 resize-none"
            placeholder="Please list any medical conditions or injuries we should be aware of..."
          />
        </div>
      </div>

      {/* Agreements */}
      <div className="mt-8 space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={e => handleInputChange("agreeToTerms", e.target.checked)}
            className="mt-1 h-4 w-4 text-brand-teal focus:ring-brand-teal focus:ring-offset-0 rounded"
          />
          <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
            I agree to the{" "}
            <a
              href="#terms"
              className="text-brand-teal hover:text-brand-teal-dark font-medium"
            >
              Terms and Conditions
            </a>{" "}
            and understand the risks associated with participating in{" "}
            {sportDisplayName.toLowerCase()} activities. *
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToEmailUpdates"
            checked={formData.agreeToEmailUpdates}
            onChange={e =>
              handleInputChange("agreeToEmailUpdates", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-brand-teal focus:ring-brand-teal focus:ring-offset-0 rounded"
          />
          <label
            htmlFor="agreeToEmailUpdates"
            className="ml-3 text-sm text-gray-600"
          >
            I would like to receive email updates about league news, events, and
            game schedules.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-brand-teal to-brand-blue text-white hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing Registration...
            </div>
          ) : (
            <>
              {sportEmoji} Join {sportDisplayName} League
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default RegistrationForm;
