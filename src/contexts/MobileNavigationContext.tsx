import React, { createContext, useCallback, useContext, useState } from "react";

export interface TabRoute {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  badge?: number;
  href?: string;
}

export interface MobileNavigationState {
  activeTabId: string;
  tabs: TabRoute[];
  history: string[];
  canGoBack: boolean;
}

export interface MobileNavigationContextType {
  state: MobileNavigationState;
  setActiveTab: (tabId: string) => void;
  addTab: (tab: TabRoute) => void;
  removeTab: (tabId: string) => void;
  updateTabBadge: (tabId: string, badge?: number) => void;
  goBack: () => void;
  clearHistory: () => void;
  pushToHistory: (tabId: string) => void;
}

const MobileNavigationContext =
  createContext<MobileNavigationContextType | null>(null);

export interface MobileNavigationProviderProps {
  children: React.ReactNode;
  initialTabId?: string;
  initialTabs?: TabRoute[];
  maxHistoryLength?: number;
}

export const MobileNavigationProvider: React.FC<
  MobileNavigationProviderProps
> = ({
  children,
  initialTabId = "",
  initialTabs = [],
  maxHistoryLength = 10,
}) => {
  const [state, setState] = useState<MobileNavigationState>({
    activeTabId: initialTabId,
    tabs: initialTabs,
    history: [],
    canGoBack: false,
  });

  const setActiveTab = useCallback(
    (tabId: string) => {
      setState(prevState => {
        // Don't add to history if it's the same tab
        if (prevState.activeTabId === tabId) {
          return prevState;
        }

        // Add current tab to history if it's not empty
        const newHistory = prevState.activeTabId
          ? [prevState.activeTabId, ...prevState.history].slice(
              0,
              maxHistoryLength
            )
          : prevState.history;

        return {
          ...prevState,
          activeTabId: tabId,
          history: newHistory,
          canGoBack: newHistory.length > 0,
        };
      });
    },
    [maxHistoryLength]
  );

  const addTab = useCallback((tab: TabRoute) => {
    setState(prevState => ({
      ...prevState,
      tabs: [...prevState.tabs.filter(t => t.id !== tab.id), tab],
    }));
  }, []);

  const removeTab = useCallback((tabId: string) => {
    setState(prevState => {
      const newTabs = prevState.tabs.filter(t => t.id !== tabId);
      let newActiveTabId = prevState.activeTabId;

      // If we're removing the active tab, switch to the first available tab
      if (prevState.activeTabId === tabId && newTabs.length > 0) {
        newActiveTabId = newTabs[0].id;
      }

      // Remove the tab from history as well
      const newHistory = prevState.history.filter(id => id !== tabId);

      return {
        ...prevState,
        tabs: newTabs,
        activeTabId: newActiveTabId,
        history: newHistory,
        canGoBack: newHistory.length > 0,
      };
    });
  }, []);

  const updateTabBadge = useCallback((tabId: string, badge?: number) => {
    setState(prevState => ({
      ...prevState,
      tabs: prevState.tabs.map(tab =>
        tab.id === tabId ? { ...tab, badge } : tab
      ),
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prevState => {
      if (prevState.history.length === 0) {
        return prevState;
      }

      const [previousTabId, ...remainingHistory] = prevState.history;

      return {
        ...prevState,
        activeTabId: previousTabId,
        history: remainingHistory,
        canGoBack: remainingHistory.length > 0,
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      history: [],
      canGoBack: false,
    }));
  }, []);

  const pushToHistory = useCallback(
    (tabId: string) => {
      setState(prevState => {
        const newHistory = [
          tabId,
          ...prevState.history.filter(id => id !== tabId),
        ].slice(0, maxHistoryLength);

        return {
          ...prevState,
          history: newHistory,
          canGoBack: newHistory.length > 0,
        };
      });
    },
    [maxHistoryLength]
  );

  const contextValue: MobileNavigationContextType = {
    state,
    setActiveTab,
    addTab,
    removeTab,
    updateTabBadge,
    goBack,
    clearHistory,
    pushToHistory,
  };

  return (
    <MobileNavigationContext.Provider value={contextValue}>
      {children}
    </MobileNavigationContext.Provider>
  );
};

export const useMobileNavigation = (): MobileNavigationContextType => {
  const context = useContext(MobileNavigationContext);
  if (!context) {
    throw new Error(
      "useMobileNavigation must be used within a MobileNavigationProvider"
    );
  }
  return context;
};

export default MobileNavigationContext;
