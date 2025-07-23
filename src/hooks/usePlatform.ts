import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";

export interface PlatformInfo {
  platform: "ios" | "android" | "web";
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  isMobile: boolean;
  isNative: boolean;
  deviceInfo: {
    model?: string;
    version?: string;
    manufacturer?: string;
    isVirtual?: boolean;
  };
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>(() => {
    const platform = Capacitor.getPlatform() as "ios" | "android" | "web";
    const isNative = Capacitor.isNativePlatform();

    return {
      platform,
      isIOS: platform === "ios",
      isAndroid: platform === "android",
      isWeb: platform === "web",
      isMobile: isNative || window.innerWidth <= 768,
      isNative,
      deviceInfo: {},
    };
  });

  useEffect(() => {
    const updatePlatformInfo = async () => {
      try {
        const platform = Capacitor.getPlatform() as "ios" | "android" | "web";
        const isNative = Capacitor.isNativePlatform();

        // Get basic device info from user agent if not native
        let deviceInfo = {};
        if (isNative) {
          // For now, we'll leave device info empty since @capacitor/device is not installed
          // This can be enhanced later by installing @capacitor/device plugin
          deviceInfo = {};
        } else {
          // For web, we can get some info from user agent
          const userAgent = navigator.userAgent;
          deviceInfo = {
            model: /iPhone|iPad|iPod/.test(userAgent)
              ? "iOS Device"
              : /Android/.test(userAgent)
              ? "Android Device"
              : "Web Browser",
          };
        }

        setPlatformInfo({
          platform,
          isIOS: platform === "ios",
          isAndroid: platform === "android",
          isWeb: platform === "web",
          isMobile: isNative || window.innerWidth <= 768,
          isNative,
          deviceInfo,
        });
      } catch (error) {
        console.error("Error updating platform info:", error);
      }
    };

    updatePlatformInfo();

    // Listen for window resize to update mobile detection
    const handleResize = () => {
      setPlatformInfo(prev => ({
        ...prev,
        isMobile: prev.isNative || window.innerWidth <= 768,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return platformInfo;
};

// Utility functions for platform-specific styling
export const getPlatformClass = (
  platformInfo: PlatformInfo,
  baseClass?: string
): string => {
  const classes = [baseClass].filter(Boolean);

  if (platformInfo.isIOS) {
    classes.push("platform-ios");
  } else if (platformInfo.isAndroid) {
    classes.push("platform-android");
  } else {
    classes.push("platform-web");
  }

  if (platformInfo.isMobile) {
    classes.push("platform-mobile");
  }

  if (platformInfo.isNative) {
    classes.push("platform-native");
  }

  return classes.join(" ");
};

// Hook for platform-specific values
export const usePlatformValue = <T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  mobile?: T;
  default: T;
}): T => {
  const platform = usePlatform();

  if (platform.isIOS && values.ios !== undefined) {
    return values.ios;
  }

  if (platform.isAndroid && values.android !== undefined) {
    return values.android;
  }

  if (platform.isWeb && values.web !== undefined) {
    return values.web;
  }

  if (platform.isMobile && values.mobile !== undefined) {
    return values.mobile;
  }

  return values.default;
};

// Hook for conditional rendering based on platform
export const usePlatformRender = () => {
  const platform = usePlatform();

  return {
    renderIOS: (component: React.ReactNode) =>
      platform.isIOS ? component : null,
    renderAndroid: (component: React.ReactNode) =>
      platform.isAndroid ? component : null,
    renderWeb: (component: React.ReactNode) =>
      platform.isWeb ? component : null,
    renderMobile: (component: React.ReactNode) =>
      platform.isMobile ? component : null,
    renderNative: (component: React.ReactNode) =>
      platform.isNative ? component : null,
  };
};
