import { useState, useEffect, useCallback } from 'react';
import { PanelState, WorkspaceState } from '@/types/workspace';

const STORAGE_KEY = 'trade_os_workspace_layout';

export function useWorkspaceLayout(initialPanels: PanelState[]) {
  const [state, setState] = useState<WorkspaceState>({
    panels: initialPanels,
    activePanelId: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkspaceState;
        // Merge stored state with initial panels to pick up new panels or titles
        const mergedPanels = initialPanels.map((initialPanel) => {
          const storedPanel = parsed.panels.find((p) => p.id === initialPanel.id);
          return storedPanel ? { ...initialPanel, ...storedPanel, title: initialPanel.title } : initialPanel;
        });
        setState({ ...parsed, panels: mergedPanels });
      } else {
        setState({ panels: initialPanels, activePanelId: null });
      }
    } catch (e) {
      console.error('Failed to load workspace layout', e);
    }
    setIsLoaded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const bringToFront = useCallback((id: string) => {
    setState((prev) => {
      const maxZ = Math.max(...prev.panels.map((p) => p.zIndex), 0);
      return {
        ...prev,
        activePanelId: id,
        panels: prev.panels.map((p) =>
          p.id === id ? { ...p, zIndex: maxZ + 1 } : p
        ),
      };
    });
  }, []);

  const updatePanelBounds = useCallback((id: string, updates: Partial<Pick<PanelState, 'x' | 'y' | 'width' | 'height'>>) => {
    setState((prev) => ({
      ...prev,
      panels: prev.panels.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setState((prev) => {
      const panel = prev.panels.find((p) => p.id === id);
      if (!panel) return prev;
      
      const isMaximized = !panel.isMaximized;
      const maxZ = Math.max(...prev.panels.map((p) => p.zIndex), 0);

      return {
        ...prev,
        activePanelId: id,
        panels: prev.panels.map((p) =>
          p.id === id ? { ...p, isMaximized, zIndex: maxZ + 1 } : p
        ),
      };
    });
  }, []);

  const closePanel = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      panels: prev.panels.map((p) => (p.id === id ? { ...p, isClosed: true } : p)),
    }));
  }, []);

  const openPanel = useCallback((id: string) => {
    setState((prev) => {
      const maxZ = Math.max(...prev.panels.map((p) => p.zIndex), 0);
      return {
        ...prev,
        activePanelId: id,
        panels: prev.panels.map((p) =>
          p.id === id ? { ...p, isClosed: false, zIndex: maxZ + 1 } : p
        ),
      };
    });
  }, []);

  const addOrOpenPanel = useCallback((panel: Omit<PanelState, 'zIndex' | 'isClosed' | 'isMaximized'>) => {
    setState((prev) => {
      const existing = prev.panels.find(p => p.id === panel.id);
      const maxZ = Math.max(...prev.panels.map((p) => p.zIndex), 0);
      
      if (existing) {
        return {
          ...prev,
          activePanelId: panel.id,
          panels: prev.panels.map(p => 
            p.id === panel.id ? { ...p, isClosed: false, zIndex: maxZ + 1 } : p
          )
        };
      }

      const newPanel: PanelState = {
        ...panel,
        isClosed: false,
        isMaximized: false,
        zIndex: maxZ + 1
      };

      return {
        ...prev,
        activePanelId: panel.id,
        panels: [...prev.panels, newPanel]
      };
    });
  }, []);
  
  const resetLayout = useCallback(() => {
    setState({ panels: initialPanels, activePanelId: null });
    localStorage.removeItem(STORAGE_KEY);
  }, [initialPanels]);

  return {
    state,
    isLoaded,
    bringToFront,
    updatePanelBounds,
    toggleMaximize,
    closePanel,
    openPanel,
    addOrOpenPanel,
    resetLayout,
  };
}
