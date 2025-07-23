import React from "react";

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  fallback,
  errorFallback,
}) => {
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    );
  }

  if (error) {
    return (
      errorFallback || (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load content</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
};

interface ContentSectionProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  minHeight?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  loading,
  error,
  children,
  minHeight = "200px",
}) => {
  return (
    <LoadingState
      loading={loading}
      error={error}
      fallback={
        <div className="flex items-center justify-center" style={{ minHeight }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
      errorFallback={
        <div className="flex items-center justify-center" style={{ minHeight }}>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium mb-2">Content unavailable</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </div>
      }
    >
      {children}
    </LoadingState>
  );
};
