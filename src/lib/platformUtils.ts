import { Capacitor } from "@capacitor/core";

// Platform constants
export const PLATFORMS = {
  IOS: "ios" as const,
  ANDROID: "android" as const,
  WEB: "web" as const,
} as const;

// Platform detection utilities
export const PlatformUtils = {
  // Basic platform checks
  isIOS: () => Capacitor.getPlatform() === "ios",
  isAndroid: () => Capacitor.getPlatform() === "android",
  isWeb: () => Capacitor.getPlatform() === "web",
  isMobile: () => Capacitor.isNativePlatform() || window.innerWidth <= 768,
  isNative: () => Capacitor.isNativePlatform(),

  // Get current platform
  getCurrentPlatform: () =>
    Capacitor.getPlatform() as "ios" | "android" | "web",

  // Platform-specific feature detection
  supportsHapticFeedback: () => {
    return (
      Capacitor.isNativePlatform() &&
      (Capacitor.getPlatform() === "ios" ||
        Capacitor.getPlatform() === "android")
    );
  },

  supportsPushNotifications: () => {
    return (
      Capacitor.isNativePlatform() ||
      ("Notification" in window && "serviceWorker" in navigator)
    );
  },

  supportsStatusBar: () => {
    return Capacitor.isNativePlatform();
  },

  supportsKeyboard: () => {
    return Capacitor.isNativePlatform();
  },

  // Safe area detection
  hasSafeAreas: () => {
    if (!Capacitor.isNativePlatform()) return false;

    // iOS devices with notches/dynamic islands
    if (Capacitor.getPlatform() === "ios") {
      const hasNotch =
        window.innerHeight > 800 || // iPhone X and newer tend to be taller
        CSS.supports("padding-top: env(safe-area-inset-top)");
      return hasNotch;
    }

    // Android devices with cutouts
    if (Capacitor.getPlatform() === "android") {
      return CSS.supports("padding-top: env(safe-area-inset-top)");
    }

    return false;
  },

  // Device orientation utilities
  getOrientation: () => {
    if (screen.orientation) {
      return screen.orientation.type;
    }

    // Fallback for older browsers
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  },

  isLandscape: () => {
    const orientation = PlatformUtils.getOrientation();
    return orientation.includes("landscape");
  },

  isPortrait: () => {
    const orientation = PlatformUtils.getOrientation();
    return orientation.includes("portrait");
  },
};

// Platform-specific styling helpers
export const PlatformStyles = {
  // Get platform-specific border radius
  getBorderRadius: (size: "sm" | "md" | "lg" = "md") => {
    const platform = Capacitor.getPlatform();

    const radiusMap = {
      ios: {
        sm: "6px",
        md: "12px",
        lg: "16px",
      },
      android: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      web: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    };

    return (
      radiusMap[platform as keyof typeof radiusMap]?.[size] ||
      radiusMap.web[size]
    );
  },

  // Get platform-specific shadow
  getShadow: (elevation: "low" | "medium" | "high" = "medium") => {
    const platform = Capacitor.getPlatform();

    if (platform === "ios") {
      const shadowMap = {
        low: "0 1px 3px rgba(0, 0, 0, 0.1)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
        high: "0 8px 24px rgba(0, 0, 0, 0.2)",
      };
      return shadowMap[elevation];
    }

    if (platform === "android") {
      const elevationMap = {
        low: "0 2px 4px rgba(0, 0, 0, 0.2)",
        medium: "0 4px 8px rgba(0, 0, 0, 0.25)",
        high: "0 8px 16px rgba(0, 0, 0, 0.3)",
      };
      return elevationMap[elevation];
    }

    // Web fallback
    const webShadowMap = {
      low: "0 1px 3px rgba(0, 0, 0, 0.1)",
      medium: "0 2px 8px rgba(0, 0, 0, 0.1)",
      high: "0 4px 16px rgba(0, 0, 0, 0.15)",
    };
    return webShadowMap[elevation];
  },

  // Get platform-specific button height
  getButtonHeight: (size: "sm" | "md" | "lg" = "md") => {
    const platform = Capacitor.getPlatform();

    if (platform === "ios") {
      const heightMap = {
        sm: "32px",
        md: "44px", // iOS standard touch target
        lg: "54px",
      };
      return heightMap[size];
    }

    if (platform === "android") {
      const heightMap = {
        sm: "36px",
        md: "48px", // Material Design standard
        lg: "56px",
      };
      return heightMap[size];
    }

    // Web fallback
    const webHeightMap = {
      sm: "32px",
      md: "40px",
      lg: "48px",
    };
    return webHeightMap[size];
  },

  // Get platform-specific spacing
  getSpacing: (size: "xs" | "sm" | "md" | "lg" | "xl" = "md") => {
    const platform = Capacitor.getPlatform();

    const spacingMap = {
      ios: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      android: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      web: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    };

    return (
      spacingMap[platform as keyof typeof spacingMap]?.[size] ||
      spacingMap.web[size]
    );
  },
};

// Platform-specific animation configurations
export const PlatformAnimations = {
  // Get platform-appropriate transition duration
  getDuration: (speed: "fast" | "normal" | "slow" = "normal") => {
    const platform = Capacitor.getPlatform();

    const durationMap = {
      ios: {
        fast: 200,
        normal: 300,
        slow: 500,
      },
      android: {
        fast: 150,
        normal: 250,
        slow: 400,
      },
      web: {
        fast: 150,
        normal: 200,
        slow: 300,
      },
    };

    return (
      durationMap[platform as keyof typeof durationMap]?.[speed] ||
      durationMap.web[speed]
    );
  },

  // Get platform-appropriate easing function
  getEasing: () => {
    const platform = Capacitor.getPlatform();

    const easingMap = {
      ios: "cubic-bezier(0.4, 0.0, 0.2, 1)", // iOS default
      android: "cubic-bezier(0.4, 0.0, 0.2, 1)", // Material Design
      web: "ease-out",
    };

    return easingMap[platform as keyof typeof easingMap] || easingMap.web;
  },
};
