import { AuthError, Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

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

export interface VerificationStatus {
  type: "email_verification" | "password_reset" | null;
  status: "pending" | "success" | "error" | null;
  message: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  verificationStatus: VerificationStatus;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithProvider: (
    provider: "google" | "github"
  ) => Promise<{ error: AuthError | null }>;
  clearVerificationStatus: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const initialLoadComplete = useRef(false);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      type: null,
      status: null,
      message: null,
    });

  // Computed admin status
  const isAdmin = userProfile?.is_admin ?? false;

  // Function to fetch user profile from database
  const fetchUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    if (process.env.NODE_ENV === "development") {
      devLog("🔍 Fetching user profile for ID:", userId);
    }
    setProfileLoading(true);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user profile:", error);

        // If profile doesn't exist, this might be expected for new users
        if (error.code === "PGRST116") {
          devLog("⚠️ User profile not found - this might be a new user");
          return null;
        }

        throw error;
      }

      devLog("✅ User profile fetched successfully:", {
        id: data.id,
        email: data.email,
        is_admin: data.is_admin,
        created_at: data.created_at,
      });

      return data;
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Function to refresh user profile
  const refreshUserProfile = async () => {
    if (!user?.id) {
      devLog("🚫 No user ID available for profile refresh");
      return;
    }

    devLog("🔄 Refreshing user profile...");
    const profile = await fetchUserProfile(user.id);
    setUserProfile(profile);
  };

  // Helper function to detect verification type from URL
  const detectVerificationType = (): VerificationStatus["type"] => {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    devLog("🔍 Detecting verification type:", {
      search: window.location.search,
      hash: window.location.hash,
      urlParams: Object.fromEntries(urlParams.entries()),
    });

    // Check for Supabase verification tokens in URL parameters
    const hasTokenHash = urlParams.has("token_hash");
    const hasAccessToken = urlParams.has("access_token");
    const hasType = urlParams.has("type");

    // Check for tokens in hash fragment (common for OAuth flows)
    const hashParams = new URLSearchParams(hash.substring(1));
    const hasHashAccessToken = hashParams.has("access_token");
    const hasHashType = hashParams.has("type");

    if (process.env.NODE_ENV === "development") {
      devLog("🔍 Token detection:", {
        hasTokenHash,
        hasAccessToken,
        hasType,
        hasHashAccessToken,
        hasHashType,
        type: urlParams.get("type") || hashParams.get("type"),
      });
    }

    // Check for verification tokens
    if (hasTokenHash || hasAccessToken || hasHashAccessToken) {
      const type = urlParams.get("type") || hashParams.get("type");

      // Check if it's a password reset
      if (type === "recovery") {
        devLog("✅ Detected password reset verification");
        return "password_reset";
      }

      // Check for email confirmation type
      if (type === "signup" || type === "email_change" || !type) {
        devLog("✅ Detected email verification");
        return "email_verification";
      }
    }

    devLog("❌ No verification tokens detected");
    return null;
  };

  // Helper function to handle verification process
  const handleVerification = async () => {
    const verificationType = detectVerificationType();

    if (!verificationType) {
      devLog("🚫 No verification type detected, skipping verification");
      return;
    }

    devLog("🔄 Starting verification process for:", verificationType);

    setVerificationStatus({
      type: verificationType,
      status: "pending",
      message:
        verificationType === "email_verification"
          ? "Verifying your email address..."
          : "Processing password reset...",
    });

    try {
      // Let Supabase process the URL tokens first
      devLog("🔄 Processing verification tokens with Supabase...");

      // For email verification, we need to wait for Supabase to process the tokens
      // The detectSessionInUrl setting should handle this automatically
      let session = null;
      let attempts = 0;
      const maxAttempts = 5;

      // Poll for session establishment with exponential backoff
      while (!session && attempts < maxAttempts) {
        attempts++;
        devLog(`🔄 Attempt ${attempts}/${maxAttempts} to get session...`);

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Supabase session error:", error);
          throw error;
        }

        session = data.session;

        if (!session && attempts < maxAttempts) {
          // Wait with exponential backoff: 500ms, 1s, 2s, 4s
          const delay = Math.min(500 * Math.pow(2, attempts - 1), 4000);
          devLog(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      devLog("📊 Final session data:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
        attempts,
      });

      if (session?.user) {
        devLog("✅ Verification successful!");

        setVerificationStatus({
          type: verificationType,
          status: "success",
          message:
            verificationType === "email_verification"
              ? "Email verified successfully! You can now access admin features."
              : "Password reset completed successfully!",
        });

        // Clear URL parameters after successful verification
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = "";
        window.history.replaceState({}, document.title, url.toString());

        devLog("🧹 Cleared URL parameters");
      } else {
        devLog("❌ No session established after all attempts");
        throw new Error("Session not established after verification");
      }
    } catch (error) {
      console.error("❌ Verification error:", error);
      setVerificationStatus({
        type: verificationType,
        status: "error",
        message:
          verificationType === "email_verification"
            ? "Email verification failed. The link may be expired or invalid."
            : "Password reset failed. Please try again.",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session and handle verification
    const getInitialSession = async () => {
      devLog("🚀 Initializing auth session...");

      try {
        // First, let Supabase handle any verification tokens in the URL
        // This is crucial for email verification to work properly
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Initial session error:", sessionError);
        }

        devLog("📊 Initial session:", {
          hasSession: !!initialSession,
          hasUser: !!initialSession?.user,
          userEmail: initialSession?.user?.email,
          emailConfirmed: initialSession?.user?.email_confirmed_at,
        });

        // Set initial session state and loading to false immediately
        // This ensures the app doesn't hang on profile fetching issues
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          devLog("🔓 Setting loading to false - session established");
          setLoading(false);
          initialLoadComplete.current = true;
        }

        // Load user profile asynchronously without blocking app initialization
        if (initialSession?.user && mounted) {
          devLog("👤 Loading initial user profile asynchronously...");
          fetchUserProfile(initialSession.user.id)
            .then(profile => {
              if (mounted) {
                setUserProfile(profile);
              }
            })
            .catch(error => {
              console.error("❌ Failed to load initial user profile:", error);
            });
        }

        // Handle verification if this is a verification callback
        // This also runs asynchronously to not block the app
        const verificationType = detectVerificationType();
        if (verificationType) {
          console.log("� Handling verification asynchronously...");
          handleVerification().catch(error => {
            console.error("❌ Verification handling failed:", error);
          });
        }

        devLog("✅ Auth initialization complete");
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        if (mounted) {
          devLog("🔓 Setting loading to false - initialization failed");
          setLoading(false);
          initialLoadComplete.current = true;
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      devLog("🔄 Auth state change:", {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        initialLoadComplete: initialLoadComplete.current,
      });

      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        // Always set loading to false for auth state changes after initial load
        // This ensures the app doesn't get stuck on profile loading issues
        if (initialLoadComplete.current) {
          devLog("🔓 Setting loading to false after auth state change");
          setLoading(false);
        }

        // Handle user profile fetching asynchronously without blocking
        if (session?.user) {
          devLog("👤 Fetching user profile after auth change...");
          fetchUserProfile(session.user.id)
            .then(profile => {
              if (mounted) {
                setUserProfile(profile);

                devLog("🔐 Admin status check:", {
                  userId: session.user.id,
                  userEmail: session.user.email,
                  profileExists: !!profile,
                  isAdmin: profile?.is_admin ?? false,
                  profileData: profile,
                });
              }
            })
            .catch(error => {
              console.error(
                "❌ Failed to fetch user profile after auth change:",
                error
              );
              // Don't block the app if profile fetching fails
            });
        } else {
          devLog("🚫 No user session, clearing profile");
          setUserProfile(null);
        }

        // Handle specific auth events
        if (event === "SIGNED_IN" && session?.user) {
          devLog("✅ User signed in successfully");

          // If user just signed in and we have a pending verification, mark it as success
          if (verificationStatus.status === "pending") {
            devLog("✅ Marking pending verification as successful");
            setVerificationStatus(prev => ({
              ...prev,
              status: "success",
              message:
                prev.type === "email_verification"
                  ? "Email verified successfully! You can now access admin features."
                  : "Password reset completed successfully!",
            }));
          }
        }

        if (event === "SIGNED_OUT") {
          devLog("👋 User signed out");
          setUserProfile(null);
        }

        if (event === "TOKEN_REFRESHED") {
          devLog("🔄 Token refreshed");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithProvider = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/sports-admin`,
      },
    });
    return { error };
  };

  const clearVerificationStatus = () => {
    setVerificationStatus({
      type: null,
      status: null,
      message: null,
    });
  };

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    profileLoading,
    verificationStatus,
    isAdmin,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    clearVerificationStatus,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
