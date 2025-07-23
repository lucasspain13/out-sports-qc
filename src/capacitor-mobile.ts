import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { pushNotificationService } from "./services/pushNotificationService";

export const initializeMobileApp = async () => {
  // Only run on mobile platforms
  if (Capacitor.isNativePlatform()) {
    // Configure Status Bar
    try {
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setBackgroundColor({ color: "#ffffff" });
    } catch (error) {
      console.log("Status Bar not available");
    }

    // Configure Keyboard
    try {
      Keyboard.addListener("keyboardWillShow", info => {
        document.body.style.paddingBottom = `${info.keyboardHeight}px`;
      });

      Keyboard.addListener("keyboardWillHide", () => {
        document.body.style.paddingBottom = "0px";
      });
    } catch (error) {
      console.log("Keyboard not available");
    }

    // Initialize Push Notifications
    try {
      await pushNotificationService.initialize();
      console.log("Push notifications initialized");
    } catch (error) {
      console.log("Push notifications not available:", error);
    }

    // Hide Splash Screen
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.log("Splash Screen not available");
    }
  }
};
