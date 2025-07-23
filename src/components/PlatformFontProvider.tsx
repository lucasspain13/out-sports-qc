import React, { useEffect } from "react";
import { getPlatformClass, usePlatform } from "../hooks/usePlatform";

export const PlatformFontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const platform = usePlatform();

  useEffect(() => {
    // Apply platform classes to document body for global font styling
    const bodyClasses = getPlatformClass(platform).split(" ");

    // Remove any existing platform classes
    document.body.classList.remove(
      "platform-ios",
      "platform-android",
      "platform-web",
      "platform-mobile",
      "platform-native"
    );

    // Add current platform classes
    bodyClasses.forEach(className => {
      if (className.trim()) {
        document.body.classList.add(className.trim());
      }
    });

    // Set data attributes for CSS targeting
    document.body.setAttribute("data-platform", platform.platform);
    document.body.setAttribute("data-mobile", platform.isMobile.toString());
    document.body.setAttribute("data-native", platform.isNative.toString());

    // Apply platform-specific body styling
    if (platform.isIOS) {
      document.body.style.fontFamily = "var(--font-primary)";
    } else if (platform.isAndroid) {
      document.body.style.fontFamily = "var(--font-primary)";
    } else {
      document.body.style.fontFamily = "var(--font-primary)";
    }

    return () => {
      // Cleanup is not necessary as the body classes should persist
      // across the entire app lifecycle
    };
  }, [platform]);

  return <>{children}</>;
};
