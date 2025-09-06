export {
  PlatformConditional,
  PlatformContainer,
  PlatformStyles,
  PlatformVariant,
  PlatformWrapper,
  withPlatform,
  type PlatformComponentProps,
  type PlatformConditionalProps,
  type PlatformContainerProps,
  type PlatformStylesProps,
  type PlatformVariantProps,
} from "./PlatformWrapper";

// Mobile Registration Forms
export { default as AndroidRegistrationForm } from "./android/AndroidRegistrationForm";
export { default as IOSRegistrationForm } from "./ios/IOSRegistrationForm";
export { default as PlatformRegistrationForm } from "./PlatformRegistrationForm";
export { default as SubstituteRegistrationForm } from "./SubstituteRegistrationForm";

// Date Picker Components
export { default as AndroidDatePicker } from "./android/AndroidDatePicker";
export { default as IOSDatePicker } from "./ios/IOSDatePicker";

// Mobile Components
export { default as MobileHeader } from "./mobile/MobileHeader";
export { default as MobileModal } from "./mobile/MobileModal";
export { default as MobileTabBar } from "./mobile/MobileTabBar";
export { default as PlatformButton } from "./mobile/PlatformButton";
export { default as PlatformCard } from "./mobile/PlatformCard";
export { default as SwipeableGameCard } from "./mobile/SwipeableGameCard";

// Type exports
export type { HeaderAction, MobileHeaderProps } from "./mobile/MobileHeader";
export type { MobileModalProps } from "./mobile/MobileModal";
export type { TabItem } from "./mobile/MobileTabBar";
export type { PlatformButtonProps } from "./mobile/PlatformButton";
export type { PlatformCardProps } from "./mobile/PlatformCard";
export type {
  SwipeAction,
  SwipeableGameCardProps,
} from "./mobile/SwipeableGameCard";

// Platform form types
export interface PlatformFormProps {
  sportType: "kickball" | "dodgeball";
  onSuccess?: () => void;
}
