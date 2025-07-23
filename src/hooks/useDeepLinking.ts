import { useEffect, useState } from "react";
import { useMobileNavigation } from "../contexts/MobileNavigationContext";

export interface DeepLink {
  path: string;
  tabId: string;
  params?: Record<string, string>;
}

export interface DeepLinkConfig {
  baseUrl: string;
  routes: DeepLink[];
  fallbackTabId: string;
}

// Hook for handling deep linking
export const useDeepLinking = (config: DeepLinkConfig) => {
  const { setActiveTab, state } = useMobileNavigation();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [params, setParams] = useState<Record<string, string>>({});

  // Parse URL parameters
  const parseParams = (search: string): Record<string, string> => {
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  };

  // Find matching route for a path
  const findRoute = (path: string): DeepLink | null => {
    return (
      config.routes.find(route => {
        // Simple path matching - can be enhanced with pattern matching
        return route.path === path || route.path.startsWith(path);
      }) || null
    );
  };

  // Generate deep link URL
  const generateDeepLink = (
    tabId: string,
    additionalParams?: Record<string, string>
  ): string => {
    const route = config.routes.find(r => r.tabId === tabId);
    if (!route) return config.baseUrl;

    const url = new URL(route.path, config.baseUrl);

    // Add parameters
    if (route.params) {
      Object.entries(route.params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  };

  // Handle incoming deep link
  const handleDeepLink = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const urlParams = parseParams(urlObj.search);

      const matchedRoute = findRoute(path);

      if (matchedRoute) {
        // Check if the target tab exists
        const tabExists = state.tabs.some(
          (tab: any) => tab.id === matchedRoute.tabId
        );

        if (tabExists) {
          setCurrentPath(path);
          setParams({ ...matchedRoute.params, ...urlParams });
          setActiveTab(matchedRoute.tabId);
          return true;
        } else {
          console.warn(
            `Deep link target tab "${matchedRoute.tabId}" not found`
          );
        }
      } else {
        console.warn(`No route found for path "${path}"`);
      }

      // Fall back to default tab
      if (config.fallbackTabId) {
        const fallbackExists = state.tabs.some(
          (tab: any) => tab.id === config.fallbackTabId
        );
        if (fallbackExists) {
          setActiveTab(config.fallbackTabId);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error parsing deep link:", error);
      return false;
    }
  };

  // Update URL when tab changes (for web)
  const updateUrl = (tabId: string) => {
    const route = config.routes.find(r => r.tabId === tabId);
    if (route && typeof window !== "undefined") {
      const url = new URL(route.path, window.location.origin);

      // Add current params
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });

      // Update browser URL without triggering navigation
      window.history.replaceState({}, "", url.pathname + url.search);
      setCurrentPath(url.pathname);
    }
  };

  // Listen for URL changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      handleDeepLink(window.location.href);
    };

    // Handle initial URL
    handleDeepLink(window.location.href);

    // Listen for back/forward navigation
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [config, state.tabs]);

  // Update URL when active tab changes
  useEffect(() => {
    if (state.activeTabId) {
      updateUrl(state.activeTabId);
    }
  }, [state.activeTabId]);

  return {
    currentPath,
    params,
    handleDeepLink,
    generateDeepLink,
    updateUrl,
  };
};

// Hook for registering app URL scheme handlers (Capacitor)
export const useAppUrlHandling = (config: DeepLinkConfig) => {
  const { handleDeepLink } = useDeepLinking(config);

  useEffect(() => {
    // Check if we're in a Capacitor environment
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      const { App } = (window as any).Capacitor;

      if (App) {
        const handleAppUrlOpen = (event: any) => {
          if (event.url) {
            handleDeepLink(event.url);
          }
        };

        // Listen for app URL open events
        App.addListener("appUrlOpen", handleAppUrlOpen);

        return () => {
          App.removeAllListeners("appUrlOpen");
        };
      }
    }
  }, [handleDeepLink]);
};

// Utility function to create deep link configuration
export const createDeepLinkConfig = (
  baseUrl: string,
  routes: Omit<DeepLink, "params">[] & { params?: Record<string, string> }[],
  fallbackTabId: string
): DeepLinkConfig => {
  return {
    baseUrl,
    routes: routes as DeepLink[],
    fallbackTabId,
  };
};

export default useDeepLinking;
