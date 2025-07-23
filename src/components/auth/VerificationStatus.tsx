import React from "react";
import { VerificationStatus as VerificationStatusType } from "../../contexts/AuthContext";

interface VerificationStatusProps {
  verificationStatus: VerificationStatusType;
  onDismiss: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  verificationStatus,
  onDismiss,
}) => {
  if (!verificationStatus.type || !verificationStatus.status) {
    return null;
  }

  const getStatusStyles = () => {
    switch (verificationStatus.status) {
      case "pending":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (verificationStatus.status) {
      case "pending":
        return (
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case "success":
        return (
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (verificationStatus.type) {
      case "email_verification":
        return "Email Verification";
      case "password_reset":
        return "Password Reset";
      default:
        return "Verification";
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div
        className={`border rounded-lg p-4 shadow-lg ${getStatusStyles()}`}
        role="alert"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">{getTitle()}</h3>
            {verificationStatus.message && (
              <p className="mt-1 text-sm opacity-90">
                {verificationStatus.message}
              </p>
            )}
            {verificationStatus.status === "success" && (
              <p className="mt-2 text-xs opacity-75">
                You can now access all features. This message will auto-dismiss
                in 5 seconds.
              </p>
            )}
            {verificationStatus.status === "error" && (
              <p className="mt-2 text-xs opacity-75">
                Please try clicking the verification link again or contact
                support if the issue persists.
              </p>
            )}
          </div>
          {verificationStatus.status !== "pending" && (
            <div className="ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex text-sm opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Dismiss"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
