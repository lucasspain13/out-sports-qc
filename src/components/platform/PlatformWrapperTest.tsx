import React from "react";
import {
  PlatformConditional,
  PlatformContainer,
  PlatformWrapper,
  withPlatform,
} from "./index";

// Example component that uses platform-specific styling
const BaseTestComponent: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4 bg-blue-100 rounded">
    <h3 className="font-bold">{title}</h3>
  </div>
);

// Enhanced with platform wrapper
const PlatformEnhancedTest = withPlatform(BaseTestComponent);

// Main test component demonstrating all wrapper features
const PlatformWrapperTest: React.FC = () => {
  return (
    <PlatformContainer maxWidth="lg" padding="lg" safeArea>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">
          Platform Wrapper System Test
        </h1>

        {/* Basic Platform Wrapper */}
        <PlatformWrapper className="border-2 border-gray-200 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Basic Platform Wrapper</h2>
          <p>This content is wrapped with platform-specific classes.</p>
        </PlatformWrapper>

        {/* Platform Conditional Rendering */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">
            Platform Conditional Content
          </h2>

          <PlatformConditional
            ios={
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                🍎 iOS-specific content with iOS styling
              </div>
            }
            android={
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                🤖 Android-specific content with Material Design
              </div>
            }
            web={
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                🌐 Web-specific content with standard styling
              </div>
            }
            fallback={
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                ❓ Unknown platform fallback content
              </div>
            }
          />
        </div>

        {/* Enhanced Component with Platform Wrapper */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Enhanced Component</h2>
          <PlatformEnhancedTest title="This component is enhanced with platform detection" />
        </div>

        {/* Mobile vs Desktop Content */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Mobile vs Desktop</h2>

          <PlatformConditional
            mobile={
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                📱 Mobile-optimized content (smaller text, touch-friendly
                buttons)
              </div>
            }
            fallback={
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
                💻 Desktop content with more detailed information and hover
                effects
              </div>
            }
          />
        </div>

        {/* Native vs Web Content */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">Native vs Web</h2>

          <PlatformConditional
            native={
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                📱 Native app content with platform-specific features
              </div>
            }
            web={
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                🌐 Web browser content with web-specific features
              </div>
            }
          />
        </div>
      </div>
    </PlatformContainer>
  );
};

export default PlatformWrapperTest;
