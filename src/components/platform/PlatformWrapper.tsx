import React from "react";
import { getPlatformClass, usePlatform } from "../../hooks/usePlatform";

// Platform-specific component props
export interface PlatformComponentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

// Platform wrapper component that applies platform-specific classes
export const PlatformWrapper: React.FC<PlatformComponentProps> = ({
  children,
  className,
  style,
  testId,
}) => {
  const platform = usePlatform();
  const platformClass = getPlatformClass(platform, className);

  return (
    <div
      className={platformClass}
      style={style}
      data-testid={testId}
      data-platform={platform.platform}
    >
      {children}
    </div>
  );
};

// Higher-order component for platform-specific rendering
export function withPlatform<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const PlatformEnhancedComponent = (props: P) => {
    const platform = usePlatform();

    return (
      <div
        data-platform={platform.platform}
        className={getPlatformClass(platform)}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  PlatformEnhancedComponent.displayName = `withPlatform(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return PlatformEnhancedComponent;
}

// Platform-specific conditional rendering component
export interface PlatformConditionalProps {
  ios?: React.ReactNode;
  android?: React.ReactNode;
  web?: React.ReactNode;
  mobile?: React.ReactNode;
  native?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PlatformConditional: React.FC<PlatformConditionalProps> = ({
  ios,
  android,
  web,
  mobile,
  native,
  fallback,
}) => {
  const platform = usePlatform();

  // Priority order: specific platform > mobile/native > fallback
  if (platform.isIOS && ios) return <>{ios}</>;
  if (platform.isAndroid && android) return <>{android}</>;
  if (platform.isWeb && web) return <>{web}</>;
  if (platform.isMobile && mobile) return <>{mobile}</>;
  if (platform.isNative && native) return <>{native}</>;
  if (fallback) return <>{fallback}</>;

  return null;
};

// Platform-specific component variants
export interface PlatformVariantProps<T = any> {
  iosComponent?: React.ComponentType<T>;
  androidComponent?: React.ComponentType<T>;
  webComponent?: React.ComponentType<T>;
  mobileComponent?: React.ComponentType<T>;
  defaultComponent: React.ComponentType<T>;
  componentProps: T;
}

export function PlatformVariant<T extends Record<string, any>>({
  iosComponent: IOSComponent,
  androidComponent: AndroidComponent,
  webComponent: WebComponent,
  mobileComponent: MobileComponent,
  defaultComponent: DefaultComponent,
  componentProps,
}: PlatformVariantProps<T>) {
  const platform = usePlatform();

  // Choose component based on platform priority
  const ComponentToRender =
    (platform.isIOS && IOSComponent) ||
    (platform.isAndroid && AndroidComponent) ||
    (platform.isWeb && WebComponent) ||
    (platform.isMobile && MobileComponent) ||
    DefaultComponent;

  return <ComponentToRender {...(componentProps as any)} />;
}

// Platform-specific style provider
export interface PlatformStylesProps {
  iosStyles?: React.CSSProperties;
  androidStyles?: React.CSSProperties;
  webStyles?: React.CSSProperties;
  mobileStyles?: React.CSSProperties;
  defaultStyles?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

export const PlatformStyles: React.FC<PlatformStylesProps> = ({
  iosStyles,
  androidStyles,
  webStyles,
  mobileStyles,
  defaultStyles,
  children,
  className,
}) => {
  const platform = usePlatform();

  // Merge styles based on platform
  let appliedStyles = defaultStyles || {};

  if (platform.isMobile && mobileStyles) {
    appliedStyles = { ...appliedStyles, ...mobileStyles };
  }

  if (platform.isIOS && iosStyles) {
    appliedStyles = { ...appliedStyles, ...iosStyles };
  } else if (platform.isAndroid && androidStyles) {
    appliedStyles = { ...appliedStyles, ...androidStyles };
  } else if (platform.isWeb && webStyles) {
    appliedStyles = { ...appliedStyles, ...webStyles };
  }

  const platformClass = getPlatformClass(platform, className);

  return (
    <div className={platformClass} style={appliedStyles}>
      {children}
    </div>
  );
};

// Platform-aware container component
export interface PlatformContainerProps extends PlatformComponentProps {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  centered?: boolean;
  safeArea?: boolean;
}

export const PlatformContainer: React.FC<PlatformContainerProps> = ({
  children,
  className = "",
  maxWidth = "lg",
  padding = "md",
  centered = true,
  safeArea = true,
  style,
  testId,
}) => {
  const platform = usePlatform();

  // Build classes based on platform and props
  const classes = [
    // Base classes
    "w-full",

    // Max width
    maxWidth === "sm"
      ? "max-w-sm"
      : maxWidth === "md"
      ? "max-w-md"
      : maxWidth === "lg"
      ? "max-w-lg"
      : maxWidth === "xl"
      ? "max-w-xl"
      : maxWidth === "2xl"
      ? "max-w-2xl"
      : maxWidth === "full"
      ? "max-w-full"
      : "max-w-lg",

    // Centering
    centered ? "mx-auto" : "",

    // Padding
    padding === "none"
      ? ""
      : padding === "sm"
      ? "p-2"
      : padding === "md"
      ? "p-4"
      : padding === "lg"
      ? "p-6"
      : "p-4",

    // Safe area
    safeArea ? "px-safe py-safe" : "",

    // Custom className
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const platformClass = getPlatformClass(platform, classes);

  return (
    <div
      className={platformClass}
      style={style}
      data-testid={testId}
      data-platform={platform.platform}
    >
      {children}
    </div>
  );
};
