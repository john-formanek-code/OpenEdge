export interface PanelState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isClosed: boolean;
  zIndex: number;
}

export interface WorkspaceState {
  panels: PanelState[];
  activePanelId: string | null;
}
