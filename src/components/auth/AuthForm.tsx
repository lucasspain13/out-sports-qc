import React, { useState } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuthOperations } from "../../hooks/useAuth";
import { authRateLimit } from "../../lib/rateLimit";
import Button from "../ui/Button";

interface AuthFormProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
  onSuccess?: () => void;
}

// Basic input validation utilities
const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

const validatePassword = (
  password: string,
  mode: "signin" | "signup"
): string | null => {
  if (!password) return "Password is required";
  if (mode === "signup") {
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
  }
  return null;
};

// Sanitize input to prevent basic XSS
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>?/gm, "");
};

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onModeChange,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    rateLimit?: string;
  }>({});

  const { showNotification } = useNotification();
  const {
    loading,
    error,
    handleSignIn,
    handleSignUp,
    handleProviderSignIn,
    clearError,
  } = useAuthOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password; // Don't sanitize password as it might remove valid characters

    // Check rate limiting
    const rateLimitCheck = authRateLimit.canAttempt(sanitizedEmail, mode);
    if (!rateLimitCheck.allowed) {
      const retryAfter = rateLimitCheck.retryAfter || 0;
      const minutes = Math.ceil(retryAfter / 60);
      setValidationErrors({
        rateLimit: `Too many failed attempts. Please try again in ${minutes} minute${
          minutes > 1 ? "s" : ""
        }.`,
      });
      return;
    }

    // Validate inputs
    const emailError = validateEmail(sanitizedEmail);
    const passwordError = validatePassword(sanitizedPassword, mode);

    setValidationErrors({
      email: emailError || undefined,
      password: passwordError || undefined,
      rateLimit: undefined,
    });

    if (emailError || passwordError) {
      return;
    }

    const result =
      mode === "signin"
        ? await handleSignIn(sanitizedEmail, sanitizedPassword)
        : await handleSignUp(sanitizedEmail, sanitizedPassword);

    // Record rate limit attempt
    authRateLimit.recordAttempt(sanitizedEmail, mode, result.success);

    if (result.success) {
      if (mode === "signup") {
        // For signup, show a message about email verification
        showNotification({
          type: "info",
          title: "Check Your Email",
          message:
            "Please check your email for a verification link to complete your registration.",
          duration: 8000,
        });
      } else {
        onSuccess?.();
      }
    }
  };

  const handleProviderAuth = async (provider: "google" | "github") => {
    clearError();
    const result = await handleProviderSignIn(provider);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "signin" ? "Sign In" : "Sign Up"} to Admin Dashboard
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {validationErrors.rateLimit && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            {validationErrors.rateLimit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
              required
            />
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.password
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Enter your password"
              required
            />
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
            {mode === "signup" && !validationErrors.password && (
              <p className="text-gray-500 text-sm mt-1">
                Password must be at least 8 characters with uppercase,
                lowercase, and number
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full px-6 py-3 text-base btn-base btn-primary focus-visible-ring"
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleProviderAuth("google")}
              disabled={loading}
              className="w-full"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleProviderAuth("github")}
              disabled={loading}
              className="w-full"
            >
              GitHub
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() =>
              onModeChange(mode === "signin" ? "signup" : "signin")
            }
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};
