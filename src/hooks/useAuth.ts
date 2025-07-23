import { useState } from "react";
import { useAuth as useAuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};

export const useAuthOperations = () => {
  const { signIn, signUp, signOut, signInWithProvider } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signOut();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: "google" | "github") => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleProviderSignIn,
    clearError,
  };
};

// Hook for checking admin permissions using database-based roles
export const useAdminAuth = () => {
  const { userProfile, isAdmin, profileLoading } = useAuth();

  // All admin permissions are based on the database is_admin flag
  const canManageTeams = isAdmin;
  const canManagePlayers = isAdmin;
  const canManageGames = isAdmin;
  const canManageLocations = isAdmin;

  return {
    isAdmin,
    canManageTeams,
    canManagePlayers,
    canManageGames,
    canManageLocations,
    profileLoading,
    userProfile,
  };
};
