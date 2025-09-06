import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { supabase } from "../../lib/supabase";

interface SubstituteRegistrationFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  preferredPronouns: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  agreeToTerms: boolean;
  agreeToLiabilityWaiver: boolean;
  agreeToPhotoRelease: boolean;
  agreeToTextUpdates: boolean;
  confirmAge18Plus: boolean;
}

const SubstituteRegistrationForm: React.FC<SubstituteRegistrationFormProps> = ({
  sportType,
  onSuccess,
}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    preferredPronouns: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    agreeToTerms: false,
    agreeToLiabilityWaiver: false,
    agreeToPhotoRelease: false,
    agreeToTextUpdates: false,
    confirmAge18Plus: false,
  });

  const sportDisplayName =
    sportType.charAt(0).toUpperCase() + sportType.slice(1);
  const sportEmoji = sportType === "kickball" ? "☄️" : "🏐";

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Limit to 10 digits maximum
    const limitedPhone = phoneNumber.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (limitedPhone.length <= 3) {
      return limitedPhone;
    } else if (limitedPhone.length <= 6) {
      return `${limitedPhone.slice(0, 3)}-${limitedPhone.slice(3)}`;
    } else {
      return `${limitedPhone.slice(0, 3)}-${limitedPhone.slice(3, 6)}-${limitedPhone.slice(6, 10)}`;
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  };

  const getPhoneInputStyles = (phone: string) => {
    if (phone.length === 0) {
      // No input yet - default style
      return "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300";
    }
    
    const isValid = validatePhoneNumber(phone);
    if (isValid) {
      // Valid phone number - green border
      return "w-full px-4 py-3 rounded-lg border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300";
    } else {
      // Invalid phone number - red border
      return "w-full px-4 py-3 rounded-lg border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-300";
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    if (field === 'phone' || field === 'emergencyContactPhone') {
      // Format phone numbers
      const formattedPhone = typeof value === 'string' ? formatPhoneNumber(value) : value;
      setFormData(prev => ({ ...prev, [field]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required waiver agreements
    if (!formData.agreeToLiabilityWaiver) {
      showNotification({
        type: "error",
        title: "Liability Waiver Required",
        message: "You must agree to submit the liability waiver to participate.",
        duration: 5000,
      });
      return;
    }

    if (!formData.agreeToPhotoRelease) {
      showNotification({
        type: "error",
        title: "Photo Release Required",
        message: "You must agree to submit the photo release waiver to participate.",
        duration: 5000,
      });
      return;
    }

    // Validate text updates agreement (required for substitute communication)
    if (!formData.agreeToTextUpdates) {
      showNotification({
        type: "error",
        title: "Text Messages Required",
        message: "You must agree to receive text messages so we can contact you when teams need substitutes.",
        duration: 5000,
      });
      return;
    }

    // Validate age confirmation checkbox
    if (!formData.confirmAge18Plus) {
      showNotification({
        type: "error",
        title: "Age Confirmation Required",
        message: "You must confirm that you are 18 or older to participate.",
        duration: 5000,
      });
      return;
    }

    // Validate phone numbers have exactly 10 digits
    if (!validatePhoneNumber(formData.phone)) {
      showNotification({
        type: "error",
        title: "Invalid Phone Number",
        message: "Please enter a valid 10-digit phone number.",
        duration: 5000,
      });
      return;
    }

    if (!validatePhoneNumber(formData.emergencyContactPhone)) {
      showNotification({
        type: "error",
        title: "Invalid Emergency Contact Phone",
        message: "Please enter a valid 10-digit emergency contact phone number.",
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      // Use the dedicated substitute_registrations table
      const { error } = await supabase.from("substitute_registrations").insert([
        {
          sport_type: sportType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          preferred_pronouns: formData.preferredPronouns,
          age: 18, // Default age since we only confirm 18+
          phone: formData.phone,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          notes: "General substitute registration",
          agree_to_terms: true, // Default to true since checkbox is removed
          agree_to_text_updates: formData.agreeToTextUpdates,
          registration_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      showNotification({
        type: "success",
        title: "Substitute Registration Successful!",
        message: `Welcome to the ${sportDisplayName} substitute pool! We'll contact you when teams need subs.`,
        duration: 8000,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        preferredPronouns: "",
        phone: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        agreeToTerms: false,
        agreeToLiabilityWaiver: false,
        agreeToPhotoRelease: false,
        agreeToTextUpdates: false,
        confirmAge18Plus: false,
      });

      onSuccess?.();
    } catch (error: any) {
      console.error("Substitute registration error:", error);
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
        <div className="text-4xl mb-4">🦸 {sportEmoji}</div>
        <h3 className="heading-3 text-gray-900 mb-2">
          Join the {sportDisplayName} Substitute Pool!
        </h3>
        <p className="body-base text-gray-600">
          Help keep games running smoothly with flexible participation
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
              First Name (required)
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => handleInputChange("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name (required)
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => handleInputChange("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Pronouns (required)
            </label>
            <input
              type="text"
              value={formData.preferredPronouns}
              onChange={e => handleInputChange("preferredPronouns", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              placeholder="e.g., he/him, she/her, they/them"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Confirmation (required)
            </label>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="confirmAge18Plus"
                checked={formData.confirmAge18Plus}
                onChange={e => handleInputChange("confirmAge18Plus", e.target.checked)}
                className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 rounded"
                required
              />
              <label
                htmlFor="confirmAge18Plus"
                className="ml-3 text-sm text-gray-600"
              >
                I confirm that I am 18 years of age or older.
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (required)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange("phone", e.target.value)}
              className={getPhoneInputStyles(formData.phone)}
              placeholder="123-456-7890"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll text you when teams need substitutes
            </p>
          </div>
        </div>

        {/* Emergency Contact Information */}
        <div className="space-y-4">
          <h4 className="heading-4 text-gray-900 border-b border-gray-200 pb-2">
            Emergency Contact Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Name (required)
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={e =>
                handleInputChange("emergencyContactName", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              placeholder="Contact person's name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Phone (required)
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={e =>
                handleInputChange("emergencyContactPhone", e.target.value)
              }
              className={getPhoneInputStyles(formData.emergencyContactPhone)}
              placeholder="123-456-7890"
              required
            />
          </div>
        </div>
      </div>

      {/* Agreements */}
      <div className="mt-8 space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToLiabilityWaiver"
            checked={formData.agreeToLiabilityWaiver}
            onChange={e =>
              handleInputChange("agreeToLiabilityWaiver", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 rounded"
          />
          <label
            htmlFor="agreeToLiabilityWaiver"
            className="ml-3 text-sm text-gray-600"
          >
            I agree to submit the{" "}
            <a
              href="#liability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:text-brand-blue-dark font-medium underline"
            >
              Liability Release Waiver
            </a>{" "}
            before participating in league activities. (required)
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToPhotoRelease"
            checked={formData.agreeToPhotoRelease}
            onChange={e =>
              handleInputChange("agreeToPhotoRelease", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 rounded"
          />
          <label
            htmlFor="agreeToPhotoRelease"
            className="ml-3 text-sm text-gray-600"
          >
            I agree to submit the{" "}
            <a
              href="#photo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:text-brand-blue-dark font-medium underline"
            >
              Photo Release Waiver
            </a>{" "}
            before participating in league activities. (required)
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTextUpdates"
            checked={formData.agreeToTextUpdates}
            onChange={e =>
              handleInputChange("agreeToTextUpdates", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 rounded"
          />
          <label
            htmlFor="agreeToTextUpdates"
            className="ml-3 text-sm text-gray-600"
          >
            I agree to receive text messages when teams need substitutes. This is the primary way we'll contact you for substitute opportunities. (required)
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
              : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5"
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
              🦸 Join {sportDisplayName} Substitute Pool
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default SubstituteRegistrationForm;
