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
  preferredPronouns: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
  emergencyContactName: string;
  emergencyContactPhone: string;
  teamRequest: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  agreeToTerms: boolean;
  agreeToLiabilityWaiver: boolean;
  agreeToPhotoRelease: boolean;
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
    preferredPronouns: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    shirtSize: "M",
    emergencyContactName: "",
    emergencyContactPhone: "",
    teamRequest: "",
    dietaryRestrictions: "",
    medicalConditions: "",
    agreeToTerms: false,
    agreeToLiabilityWaiver: false,
    agreeToPhotoRelease: false,
    agreeToEmailUpdates: false,
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

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Get maximum date for 18+ validation (18 years ago)
  const getMaxBirthDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
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

    // Validate date of birth (must be 18 or older)
    if (!formData.dateOfBirth) {
      showNotification({
        type: "error",
        title: "Date of Birth Required",
        message: "Please enter your date of birth.",
        duration: 5000,
      });
      return;
    }

    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      showNotification({
        type: "error",
        title: "Age Requirement",
        message: "You must be 18 or older to participate in our leagues.",
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
      const calculatedAge = calculateAge(formData.dateOfBirth);
      
      const { error } = await supabase.from("player_registrations").insert([
        {
          sport_type: sportType,
          first_name: formData.firstName,
          last_name: formData.lastName,
          preferred_pronouns: formData.preferredPronouns,
          age: calculatedAge,
          date_of_birth: formData.dateOfBirth,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          shirt_size: formData.shirtSize,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          team_request: formData.teamRequest || null,
          dietary_restrictions: formData.dietaryRestrictions || null,
          medical_conditions: formData.medicalConditions || null,
          agree_to_terms: true, // Default to true since checkbox is removed
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
        preferredPronouns: "",
        dateOfBirth: "",
        email: "",
        phone: "",
        shirtSize: "M",
        emergencyContactName: "",
        emergencyContactPhone: "",
        teamRequest: "",
        dietaryRestrictions: "",
        medicalConditions: "",
        agreeToTerms: false,
        agreeToLiabilityWaiver: false,
        agreeToPhotoRelease: false,
        agreeToEmailUpdates: false,
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
              Date of Birth (required)
            </label>
            <input
              type="date"
              max={getMaxBirthDate()}
              value={formData.dateOfBirth}
              onChange={e => handleInputChange("dateOfBirth", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You must be 18 or older to participate
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (required)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              placeholder="OutSportsQC@gmail.com"
              required
            />
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shirt Size (required)
            </label>
            <select
              value={formData.shirtSize}
              onChange={e => handleInputChange("shirtSize", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300"
              required
            >
              {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(size => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions or Allergies (optional)
            </label>
            <textarea
              value={formData.dietaryRestrictions}
              onChange={e =>
                handleInputChange("dietaryRestrictions", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300 resize-none"
              placeholder="Please list any dietary restrictions, allergies, or special accommodations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Conditions or Injuries (optional)
            </label>
            <textarea
              value={formData.medicalConditions}
              onChange={e =>
                handleInputChange("medicalConditions", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300 resize-none"
              placeholder="Please list any medical conditions or injuries we should be aware of..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Request (optional)
            </label>
            <textarea
              value={formData.teamRequest}
              onChange={e => handleInputChange("teamRequest", e.target.value)}
              rows={4}
              className="w-full px-2 py-2 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all duration-300 resize-none"
              placeholder="Request up to 3 specific players to be on your team (e.g., 'John Smith, Jane Doe, Alex Johnson'). We'll do our best to accommodate requests while maintaining team balance."
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
            id="agreeToEmailUpdates"
            checked={formData.agreeToEmailUpdates}
            onChange={e =>
              handleInputChange("agreeToEmailUpdates", e.target.checked)
            }
            className="mt-1 h-4 w-4 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 rounded"
          />
          <label
            htmlFor="agreeToEmailUpdates"
            className="ml-3 text-sm text-gray-600"
          >
            I would like to receive email updates about league news, events, and
            game schedules. (optional)
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
              : "bg-gradient-primary text-white hover:shadow-lg hover:-translate-y-0.5"
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
