import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Announcement } from "../types";

interface UseAnnouncementsOptions {
  limit?: number;
  targetAudience?: string;
  types?: string[];
  priorities?: string[];
}

export const useAnnouncements = (options: UseAnnouncementsOptions = {}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { limit, targetAudience = "all", types, priorities } = options;

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      // Add target audience filter
      if (targetAudience !== "all") {
        query = query.in("target_audience", ["all", targetAudience]);
      }

      // Add type filter
      if (types && types.length > 0) {
        query = query.in("type", types);
      }

      // Add priority filter
      if (priorities && priorities.length > 0) {
        query = query.in("priority", priorities);
      }

      // Order by priority (urgent first) then by creation date
      query = query
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch announcements"
      );
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase
      .channel("announcements-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        payload => {
          console.log("Announcement change detected:", payload);
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetAudience, limit, types?.join(","), priorities?.join(",")]);

  const refreshAnnouncements = () => {
    fetchAnnouncements();
  };

  return {
    announcements,
    loading,
    error,
    refresh: refreshAnnouncements,
    hasAnnouncements: announcements.length > 0,
  };
};

// Hook specifically for high-priority announcements
export const useUrgentAnnouncements = (limit = 3) => {
  return useAnnouncements({
    priorities: ["urgent", "high"],
    limit,
  });
};

// Hook for game-related announcements
export const useGameAnnouncements = (sportType?: string, limit = 5) => {
  return useAnnouncements({
    types: ["game"],
    targetAudience: sportType,
    limit,
  });
};

// Hook for registration announcements
export const useRegistrationAnnouncements = (limit = 3) => {
  return useAnnouncements({
    types: ["registration"],
    limit,
  });
};
