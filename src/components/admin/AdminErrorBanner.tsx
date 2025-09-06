import React, { useState } from "react";

interface AdminErrorBannerProps {
  error: string | null;
  actionSuggestion?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export const AdminErrorBanner: React.FC<AdminErrorBannerProps> = ({
  error,
  actionSuggestion,
  onDismiss,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  // Check if error message is long (more than 100 characters)
  const isLongError = error.length > 100;
  const displayError = isLongError && !isExpanded 
    ? `${error.substring(0, 100)}...` 
    : error;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-6 ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-red-800 break-words">
            {displayError}
            {isLongError && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 text-red-600 hover:text-red-800 underline text-xs"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          {actionSuggestion && (
            <div className="mt-2 p-3 bg-red-100 rounded-md">
              <p className="text-sm text-red-700">
                <span className="font-medium">What to do:</span>{" "}
                {actionSuggestion}
              </p>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-3">
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <svg
                className="w-5 h-5"
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
  );
};
