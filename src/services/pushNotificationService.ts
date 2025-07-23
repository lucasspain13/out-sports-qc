import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  PushNotifications,
  PushNotificationSchema,
} from "@capacitor/push-notifications";

interface AnnouncementNotification {
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  type: "general" | "game" | "registration" | "maintenance" | "event";
  target_audience: "all" | "players" | "teams" | "kickball" | "dodgeball";
}

class PushNotificationService {
  private isInitialized = false;

  async initialize() {
    if (!Capacitor.isNativePlatform()) {
      console.log("Push notifications are only available on native platforms");
      return;
    }

    try {
      // Request permissions
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== "granted") {
        console.warn("Push notification permissions not granted");
        return;
      }

      // Register with FCM/APNS
      await PushNotifications.register();

      // Setup listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log("Push notifications initialized successfully");
    } catch (error) {
      console.error("Error initializing push notifications:", error);
    }
  }

  private setupListeners() {
    // On successful registration
    PushNotifications.addListener("registration", token => {
      if (process.env.NODE_ENV === "development") {
        console.log("Push registration success, token received");
      }
      // Send token to your server/Supabase to store for user
      this.storePushToken(token.value);
    });

    // On registration error
    PushNotifications.addListener("registrationError", error => {
      console.error("Push registration error:", error);
    });

    // Handle incoming push notifications when app is in foreground
    PushNotifications.addListener("pushNotificationReceived", notification => {
      console.log("Push notification received in foreground:", notification);

      // Show local notification for better UX
      this.showLocalNotification(notification);
    });

    // Handle push notification tap/click
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      notification => {
        console.log("Push notification action performed:", notification);

        // Handle navigation based on notification data
        this.handleNotificationTap(notification);
      }
    );
  }

  private async storePushToken(token: string) {
    try {
      // TODO: Store the push token in Supabase database instead of localStorage
      // This is a security improvement - tokens should be associated with authenticated users
      localStorage.setItem("pushToken", token);

      // You could also send this to your server/Supabase
      // to associate with the current user
      if (process.env.NODE_ENV === "development") {
        console.log("Push token stored locally");
      }
    } catch (error) {
      console.error("Error storing push token:", error);
    }
  }

  private async showLocalNotification(notification: PushNotificationSchema) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || "Out Sports League",
            body: notification.body || "",
            id: Math.floor(Math.random() * 10000),
            schedule: { at: new Date(Date.now() + 1000) }, // Show immediately
            sound: "default",
            attachments: [],
            actionTypeId: "",
            extra: notification.data || {},
          },
        ],
      });
    } catch (error) {
      console.error("Error showing local notification:", error);
    }
  }

  private handleNotificationTap(notification: any) {
    try {
      const notificationData = notification.notification?.data;

      if (notificationData?.type) {
        switch (notificationData.type) {
          case "game":
            // Navigate to games/schedule
            window.location.hash = "#schedule";
            break;
          case "registration":
            // Navigate to registration
            window.location.hash = "#registration";
            break;
          case "announcement":
          default:
            // Navigate to home page
            window.location.hash = "#home";
            break;
        }
      }
    } catch (error) {
      console.error("Error handling notification tap:", error);
    }
  }

  async scheduleLocalAnnouncementNotification(
    announcement: AnnouncementNotification
  ) {
    try {
      if (!Capacitor.isNativePlatform()) {
        console.log("Local notifications only available on native platforms");
        return;
      }

      // Check permissions for local notifications
      const permissions = await LocalNotifications.requestPermissions();
      if (permissions.display !== "granted") {
        console.warn("Local notification permissions not granted");
        return;
      }

      // Get priority-based sound and other settings
      const notificationSettings = this.getNotificationSettings(
        announcement.priority
      );

      await LocalNotifications.schedule({
        notifications: [
          {
            title: `📢 ${announcement.title}`,
            body: announcement.content,
            id: Math.floor(Math.random() * 10000),
            schedule: { at: new Date(Date.now() + 1000) }, // Show immediately
            sound: notificationSettings.sound || undefined,
            attachments: [],
            actionTypeId: "",
            extra: {
              type: announcement.type,
              priority: announcement.priority,
              target_audience: announcement.target_audience,
            },
          },
        ],
      });

      console.log("Local announcement notification scheduled");
    } catch (error) {
      console.error("Error scheduling local notification:", error);
    }
  }

  private getNotificationSettings(priority: string) {
    switch (priority) {
      case "urgent":
        return {
          sound: "default", // You can customize sound files
          vibration: true,
        };
      case "high":
        return {
          sound: "default",
          vibration: true,
        };
      case "normal":
        return {
          sound: "default",
          vibration: false,
        };
      case "low":
        return {
          sound: null, // Silent notification
          vibration: false,
        };
      default:
        return {
          sound: "default",
          vibration: false,
        };
    }
  }

  // Method to get the current push token (if available) - sanitized
  getCurrentPushToken(): string | null {
    const token = localStorage.getItem("pushToken");
    if (process.env.NODE_ENV === "development" && token) {
      console.log(
        "Push token retrieved (sanitized):",
        token.substring(0, 10) + "..."
      );
    }
    return token;
  }

  // Method to clear stored push token (useful for logout)
  clearPushToken() {
    localStorage.removeItem("pushToken");
  }

  // Check if push notifications are supported and enabled
  isSupported(): boolean {
    return Capacitor.isNativePlatform() && this.isInitialized;
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();

// Auto-initialize when service is imported
if (Capacitor.isNativePlatform()) {
  pushNotificationService.initialize().catch(console.error);
}
