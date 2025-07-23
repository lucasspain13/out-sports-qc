export { useAnnouncements } from "./useAnnouncements";
export { useAuth } from "./useAuth";
export { useDeepLinking } from "./useDeepLinking";
export { useGame } from "./useGames";
export {
  getPlatformClass,
  usePlatform,
  usePlatformRender,
  usePlatformValue,
} from "./usePlatform";
export { usePushToken } from "./usePushToken";
export { useRealtimeScores } from "./useRealtimeScores";
export {
  useScrollAnimation,
  useStaggeredAnimation,
} from "./useScrollAnimation";
export { useTeam, useTeams } from "./useTeams";

// Re-export platform utilities for convenience
export {
  PLATFORMS,
  PlatformAnimations,
  PlatformStyles,
  PlatformUtils,
} from "../lib/platformUtils";
