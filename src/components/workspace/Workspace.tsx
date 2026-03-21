import React, { useRef } from 'react';
import { useWorkspaceLayout } from '@/hooks/useWorkspaceLayout';
import { DraggablePanel } from './DraggablePanel';
import { PanelState } from '@/types/workspace';

interface WorkspaceProps {
  initialPanels: PanelState[];
  renderPanelContent: (panel: PanelState) => React.ReactNode;
}

export function Workspace({ initialPanels, renderPanelContent }: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const {
    state,
    isLoaded,
    bringToFront,
    updatePanelBounds,
    toggleMaximize,
    closePanel,
    openPanel,
    resetLayout,
  } = useWorkspaceLayout(initialPanels);

  if (!isLoaded) {
    return <div className="w-full h-full bg-black animate-pulse" />;
  }

  const closedPanels = state.panels.filter((p) => p.isClosed);

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0a] overflow-hidden relative">
      {/* Optional: Workspace Toolbar / Status bar to reopen panels */}
      <div className="h-8 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 justify-between z-50">
        <div className="text-xs font-mono text-zinc-500 flex gap-4 items-center">
          <span className="text-amber-500 font-bold">TRADE OS WORKSPACE</span>
          <span className="text-zinc-700">|</span>
          {closedPanels.length > 0 && (
            <div className="flex gap-2 items-center">
              <span>Reopen:</span>
              {closedPanels.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openPanel(p.id)}
                  className="hover:text-amber-500 transition-colors uppercase"
                >
                  {p.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={resetLayout}
          className="text-xs font-mono text-zinc-600 hover:text-red-400 transition-colors"
        >
          Reset Layout
        </button>
      </div>

      {/* The Workspace Area */}
      <div ref={workspaceRef} className="flex-1 relative overflow-hidden">
        {state.panels.map((panel) => (
          <DraggablePanel
            key={panel.id}
            panel={panel}
            isActive={state.activePanelId === panel.id}
            workspaceRef={workspaceRef}
            onBringToFront={bringToFront}
            onUpdateBounds={updatePanelBounds}
            onToggleMaximize={toggleMaximize}
            onClose={closePanel}
          >
            {renderPanelContent(panel)}
          </DraggablePanel>
        ))}
      </div>
    </div>
  );
}
