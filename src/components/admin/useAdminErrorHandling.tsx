import React from "react";
import {
  getErrorActionSuggestion,
  parseSupabaseError,
} from "../../lib/errorHandling";

/**
 * Custom hook for admin components to handle database errors consistently
 */
export function useAdminErrorHandling() {
  const [error, setError] = React.useState<string | null>(null);
  const [errorActionSuggestion, setErrorActionSuggestion] = React.useState<
    string | null
  >(null);

  const handleError = React.useCallback((err: any, prefix?: string) => {
    const errorMessage = parseSupabaseError(err);
    const actionSuggestion = getErrorActionSuggestion(err);

    if (prefix) {
      setError(`${prefix}: ${errorMessage}`);
    } else {
      setError(errorMessage);
    }

    setErrorActionSuggestion(actionSuggestion);
    console.error("Admin operation error:", err);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setErrorActionSuggestion(null);
  }, []);

  const handleSuccess = React.useCallback(() => {
    // Clear errors on successful operations
    clearError();
  }, [clearError]);

  return {
    error,
    errorActionSuggestion,
    handleError,
    clearError,
    handleSuccess,
  };
}
