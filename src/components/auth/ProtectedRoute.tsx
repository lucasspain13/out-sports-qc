import React from "react";
import { useAuth } from "../../hooks/useAuth";

// Development logging utility - sanitized for production
const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    if (data) {
      // Sanitize sensitive data for logging
      const sanitizedData = { ...data };
      if (sanitizedData.userId) {
        sanitizedData.userId = sanitizedData.userId.substring(0, 8) + "...";
      }
      if (sanitizedData.userEmail) {
        sanitizedData.userEmail = sanitizedData.userEmail.replace(
          /(.{2}).*(@.*)/,
          "$1***$2"
        );
      }
      console.log(message, sanitizedData);
    } else {
      console.log(message);
    }
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  requireAdmin = false,
}) => {
  const {
    user,
    loading,
    profileLoading,
    userProfile,
    isAdmin,
    refreshUserProfile,
  } = useAuth();

  devLog("🔐 ProtectedRoute Debug:", {
    hasUser: !!user,
    userEmail: user?.email,
    userId: user?.id,
    loading,
    profileLoading,
    hasUserProfile: !!userProfile,
    userProfileData: userProfile,
    isAdmin,
    requireAdmin,
    emailConfirmed: user?.email_confirmed_at,
  });

  // Show loading while auth or profile is loading
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Checking authentication..." : "Loading user profile..."}
          </p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    devLog("❌ ProtectedRoute: No user found, showing auth required");
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600">Please sign in to access this page.</p>
          </div>
        </div>
      )
    );
  }

  // Check if email is confirmed
  if (!user.email_confirmed_at) {
    devLog("❌ ProtectedRoute: Email not confirmed");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification Required
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your email and click the verification link to access
            this page.
          </p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
        </div>
      </div>
    );
  }

  // Admin access check
  if (requireAdmin) {
    devLog("🔐 ProtectedRoute: Admin access required, checking...");

    // If no user profile exists, show diagnostic info
    if (!userProfile) {
      devLog("❌ ProtectedRoute: No user profile found for admin check");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profile Setup Required
            </h2>
            <p className="text-gray-600 mb-4">
              Your user profile needs to be set up before you can access admin
              features.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Email Confirmed:</strong>{" "}
                {user.email_confirmed_at ? "Yes" : "No"}
              </p>
              <p>
                <strong>Profile Found:</strong> No
              </p>
            </div>
            <button
              onClick={refreshUserProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              Retry Profile Load
            </button>
            <a
              href="#admin-login"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-block"
            >
              Back to Login
            </a>
          </div>
        </div>
      );
    }

    // Check admin status
    if (!isAdmin) {
      console.log("❌ ProtectedRoute: User is not admin");
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have administrator permissions to access this page.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
              <h3 className="font-semibold mb-2">Debug Information:</h3>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Profile Found:</strong> Yes
              </p>
              <p>
                <strong>Admin Status:</strong>{" "}
                {userProfile.is_admin ? "Yes" : "No"}
              </p>
              <p>
                <strong>Profile Created:</strong> {userProfile.created_at}
              </p>
            </div>
            <a
              href="#home"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      );
    }

    console.log("✅ ProtectedRoute: Admin access granted");
  }

  console.log("✅ ProtectedRoute: Access granted, rendering children");
  return <>{children}</>;
};
