import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Announcement, AnnouncementBannerProps } from "../../types";

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  className = "",
  maxHeight = "200px",
  showPriority = true,
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchActiveAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order("priority", { ascending: false }) // urgent first
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error);
        return;
      }

      const allActiveAnnouncements = data || [];

      // Get current dismissed announcements from session storage
      const dismissed = sessionStorage.getItem("dismissed-announcements");
      let currentDismissedIds: string[] = [];
      if (dismissed) {
        try {
          currentDismissedIds = JSON.parse(dismissed);
        } catch (error) {
          console.error("Error parsing dismissed announcements:", error);
        }
      }

      // Filter out dismissed announcements
      const visibleAnnouncements = allActiveAnnouncements.filter(
        announcement => !currentDismissedIds.includes(announcement.id)
      );

      setAnnouncements(visibleAnnouncements);
      setIsVisible(visibleAnnouncements.length > 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load dismissed announcements from session storage on component mount
    const dismissed = sessionStorage.getItem("dismissed-announcements");
    if (dismissed) {
      try {
        const dismissedIds = JSON.parse(dismissed);
        // Just log for debugging - we don't need to store in state
        console.log("Loaded dismissed announcements:", dismissedIds);
      } catch (error) {
        console.error(
          "Error parsing dismissed announcements from session storage:",
          error
        );
      }
    }

    fetchActiveAnnouncements();

    // Set up real-time subscription for announcements
    const channel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          fetchActiveAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Only run on mount

  // Auto-rotate announcements every 5 seconds if there are multiple
  useEffect(() => {
    if (announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          badge: "bg-red-600 text-white",
          icon: "🚨",
        };
      case "high":
        return {
          bg: "bg-orange-50 border-orange-200",
          text: "text-orange-800",
          badge: "bg-orange-600 text-white",
          icon: "⚠️",
        };
      case "normal":
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          badge: "bg-blue-600 text-white",
          icon: "ℹ️",
        };
      case "low":
        return {
          bg: "bg-gray-50 border-gray-200",
          text: "text-gray-800",
          badge: "bg-gray-600 text-white",
          icon: "📝",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          badge: "bg-blue-600 text-white",
          icon: "ℹ️",
        };
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "game":
        return { badge: "bg-green-600 text-white", icon: "🏆" };
      case "registration":
        return { badge: "bg-purple-600 text-white", icon: "📝" };
      case "maintenance":
        return { badge: "bg-yellow-600 text-white", icon: "🔧" };
      case "event":
        return { badge: "bg-indigo-600 text-white", icon: "🎉" };
      default:
        return { badge: "bg-gray-600 text-white", icon: "📢" };
    }
  };

  const handleDismiss = () => {
    const currentAnnouncement = announcements[currentIndex];
    if (currentAnnouncement) {
      // Get current dismissed list from session storage
      const dismissed = sessionStorage.getItem("dismissed-announcements");
      let dismissedIds: string[] = [];

      if (dismissed) {
        try {
          dismissedIds = JSON.parse(dismissed);
        } catch (error) {
          console.error("Error parsing dismissed announcements:", error);
        }
      }

      // Add current announcement ID to dismissed list
      if (!dismissedIds.includes(currentAnnouncement.id)) {
        dismissedIds.push(currentAnnouncement.id);

        // Save updated list to session storage
        try {
          sessionStorage.setItem(
            "dismissed-announcements",
            JSON.stringify(dismissedIds)
          );
        } catch (error) {
          console.error(
            "Error saving dismissed announcements to session storage:",
            error
          );
        }

        // Filter current announcements to exclude dismissed ones
        const remainingAnnouncements = announcements.filter(
          announcement => !dismissedIds.includes(announcement.id)
        );

        if (remainingAnnouncements.length === 0) {
          setIsVisible(false);
        } else {
          // Update announcements list and reset index
          setAnnouncements(remainingAnnouncements);
          setCurrentIndex(0);
        }
      }
    }
  };

  const currentAnnouncement = announcements[currentIndex];

  if (
    loading ||
    !isVisible ||
    announcements.length === 0 ||
    !currentAnnouncement
  ) {
    return null;
  }

  const priorityStyles = getPriorityStyles(currentAnnouncement.priority);
  const typeStyles = getTypeStyles(currentAnnouncement.type);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden ${className}`}
          style={{ maxHeight }}
        >
          <div
            className={`border-l-4 border-r border-t border-b rounded-lg bg-white/70 backdrop-blur-md ${
              currentAnnouncement.priority === "urgent"
                ? "border-l-red-500 border-red-300/70"
                : currentAnnouncement.priority === "high"
                ? "border-l-orange-500 border-orange-300/70"
                : currentAnnouncement.priority === "normal"
                ? "border-l-blue-500 border-blue-300/70"
                : "border-l-gray-500 border-gray-300/70"
            }`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Header with badges */}
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span
                      className="text-lg"
                      role="img"
                      aria-label="announcement"
                    >
                      {priorityStyles.icon}
                    </span>

                    {showPriority && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityStyles.badge}`}
                      >
                        {currentAnnouncement.priority.toUpperCase()}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles.badge}`}
                    >
                      {typeStyles.icon} {currentAnnouncement.type.toUpperCase()}
                    </span>

                    {announcements.length > 1 && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {currentIndex + 1} of {announcements.length}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base sm:text-lg font-semibold ${priorityStyles.text} mb-1`}
                  >
                    {currentAnnouncement.title}
                  </h3>

                  {/* Content */}
                  <div className={`${priorityStyles.text} opacity-90`}>
                    <p className="text-sm leading-relaxed">
                      {currentAnnouncement.content}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="mt-2 text-xs text-gray-600 space-x-3">
                    <span>
                      {new Date(
                        currentAnnouncement.created_at
                      ).toLocaleDateString()}
                    </span>
                    {currentAnnouncement.expires_at && (
                      <span>
                        Expires:{" "}
                        {new Date(
                          currentAnnouncement.expires_at
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className={`flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors ${priorityStyles.text}`}
                  aria-label="Dismiss announcement"
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

              {/* Progress indicator for multiple announcements */}
              {announcements.length > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    {announcements.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentIndex
                            ? currentAnnouncement.priority === "urgent"
                              ? "bg-red-600"
                              : currentAnnouncement.priority === "high"
                              ? "bg-orange-600"
                              : currentAnnouncement.priority === "normal"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                            : "bg-white bg-opacity-50"
                        }`}
                        aria-label={`Go to announcement ${index + 1}`}
                      />
                    ))}
                  </div>

                  {announcements.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentIndex(
                            (currentIndex - 1 + announcements.length) %
                              announcements.length
                          )
                        }
                        className={`p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors ${priorityStyles.text}`}
                        aria-label="Previous announcement"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setCurrentIndex(
                            (currentIndex + 1) % announcements.length
                          )
                        }
                        className={`p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors ${priorityStyles.text}`}
                        aria-label="Next announcement"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
