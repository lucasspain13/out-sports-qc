import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { pushNotificationService } from "../services/pushNotificationService";
import { useAuth } from "./useAuth";

interface PushTokenData {
  push_token: string;
  platform: "ios" | "android" | "web";
  device_id?: string;
  app_version?: string;
}

export const usePushToken = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const registerPushToken = async (tokenData: PushTokenData) => {
    if (!user) {
      setError("User not authenticated");
      return false;
    }

    try {
      // Check if token already exists for this user/device
      const { data: existingToken, error: checkError } = await supabase
        .from("push_tokens")
        .select("id, push_token")
        .eq("user_id", user.id)
        .eq("device_id", tokenData.device_id || "unknown")
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found"
        throw checkError;
      }

      if (existingToken && existingToken.push_token === tokenData.push_token) {
        // Token already exists and is the same, just mark as active
        const { error: updateError } = await supabase
          .from("push_tokens")
          .update({
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingToken.id);

        if (updateError) throw updateError;

        if (process.env.NODE_ENV === "development") {
          console.log("Push token status updated");
        }
        setIsRegistered(true);
        return true;
      }

      // Insert or update the push token
      const { error: upsertError } = await supabase.from("push_tokens").upsert(
        {
          user_id: user.id,
          push_token: tokenData.push_token,
          platform: tokenData.platform,
          device_id: tokenData.device_id || "unknown",
          app_version: tokenData.app_version,
          is_active: true,
        },
        {
          onConflict: "user_id,device_id",
        }
      );

      if (upsertError) throw upsertError;

      if (process.env.NODE_ENV === "development") {
        console.log("Push token registration completed");
      }
      setIsRegistered(true);
      setError(null);
      return true;
    } catch (err) {
      console.error("Error registering push token:", err);
      setError(
        err instanceof Error ? err.message : "Failed to register push token"
      );
      return false;
    }
  };

  const unregisterPushToken = async (deviceId?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("push_tokens")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .eq("device_id", deviceId || "unknown");

      if (error) throw error;

      if (process.env.NODE_ENV === "development") {
        console.log("Push token status updated");
      }
      setIsRegistered(false);
      return true;
    } catch (err) {
      console.error("Error unregistering push token:", err);
      setError(
        err instanceof Error ? err.message : "Failed to unregister push token"
      );
      return false;
    }
  };

  const initializePushNotifications = async () => {
    if (!Capacitor.isNativePlatform() || !user) {
      return;
    }

    try {
      // Initialize the push notification service
      await pushNotificationService.initialize();

      // Get the current push token
      const currentToken = pushNotificationService.getCurrentPushToken();

      if (currentToken) {
        // Register the token with our backend
        const platform = Capacitor.getPlatform() as "ios" | "android";
        const deviceId = await getDeviceId();
        const appVersion = await getAppVersion();

        await registerPushToken({
          push_token: currentToken,
          platform: platform,
          device_id: deviceId,
          app_version: appVersion,
        });
      }
    } catch (err) {
      console.error("Error initializing push notifications:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize push notifications"
      );
    }
  };

  const getDeviceId = async (): Promise<string> => {
    try {
      // In a real app, you might want to use a proper device ID plugin
      // For now, we'll create a simple identifier
      const stored = localStorage.getItem("deviceId");
      if (stored) return stored;

      const deviceId = `${Capacitor.getPlatform()}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("deviceId", deviceId);
      return deviceId;
    } catch (error) {
      return "unknown";
    }
  };

  const getAppVersion = async (): Promise<string> => {
    try {
      // You could use @capacitor/app plugin to get the actual app version
      return "1.0.0"; // Placeholder
    } catch (error) {
      return "unknown";
    }
  };

  // Initialize push notifications when user is available
  useEffect(() => {
    if (user && Capacitor.isNativePlatform()) {
      initializePushNotifications();
    } else if (!user) {
      setIsRegistered(false);
      setError(null);
    }
  }, [user]);

  // Clean up push token on logout
  useEffect(() => {
    if (!user && isRegistered) {
      // Clear the push token from local storage
      pushNotificationService.clearPushToken();
      setIsRegistered(false);
    }
  }, [user, isRegistered]);

  return {
    isRegistered,
    error,
    registerPushToken,
    unregisterPushToken,
    initializePushNotifications,
    isSupported: pushNotificationService.isSupported(),
  };
};
