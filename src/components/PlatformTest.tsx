import React from "react";
import {
  getPlatformClass,
  usePlatform,
  usePlatformRender,
  usePlatformValue,
} from "../hooks/usePlatform";

const PlatformTest: React.FC = () => {
  const platform = usePlatform();
  const platformRender = usePlatformRender();

  const greeting = usePlatformValue({
    ios: "Hello from iOS!",
    android: "Hello from Android!",
    web: "Hello from Web!",
    default: "Hello from Unknown Platform!",
  });

  const containerClass = getPlatformClass(platform, "p-4 rounded-lg border");

  return (
    <div className={containerClass}>
      <h2 className="text-xl font-bold mb-4">Platform Detection Test</h2>

      <div className="space-y-2">
        <p>
          <strong>Platform:</strong> {platform.platform}
        </p>
        <p>
          <strong>Is iOS:</strong> {platform.isIOS ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Android:</strong> {platform.isAndroid ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Web:</strong> {platform.isWeb ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Mobile:</strong> {platform.isMobile ? "Yes" : "No"}
        </p>
        <p>
          <strong>Is Native:</strong> {platform.isNative ? "Yes" : "No"}
        </p>
        <p>
          <strong>Device Model:</strong>{" "}
          {platform.deviceInfo.model || "Unknown"}
        </p>
      </div>

      <div className="mt-4">
        <p>
          <strong>Platform-specific greeting:</strong> {greeting}
        </p>
      </div>

      <div className="mt-4">
        {platformRender.renderIOS(
          <div className="bg-blue-100 p-2 rounded">iOS-specific content</div>
        )}

        {platformRender.renderAndroid(
          <div className="bg-green-100 p-2 rounded">
            Android-specific content
          </div>
        )}

        {platformRender.renderWeb(
          <div className="bg-gray-100 p-2 rounded">Web-specific content</div>
        )}
      </div>
    </div>
  );
};

export default PlatformTest;
