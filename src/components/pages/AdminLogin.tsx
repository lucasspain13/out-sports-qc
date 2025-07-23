import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { navigateTo } from "../../lib/navigation";
import { AuthForm } from "../auth/AuthForm";

export const AdminLogin: React.FC = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const { user } = useAuth();

  const handleAuthSuccess = () => {
    // Redirect to admin dashboard after successful authentication
    navigateTo("sports-admin");
  };

  // If user is already authenticated, show success message
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user.email}!
              </h2>
              <p className="text-gray-600 mb-6">
                You are successfully authenticated.
              </p>
              <button
                onClick={() => navigateTo("sports-admin")}
                className="w-full px-6 py-3 text-base btn-base btn-primary focus-visible-ring"
              >
                Go to Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sports League Admin
          </h1>
          <p className="text-gray-600">
            Access the admin dashboard to manage teams, players, games, and
            schedules.
          </p>
        </div>

        <AuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo("home")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};
