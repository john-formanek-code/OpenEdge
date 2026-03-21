import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { PanelState } from '@/types/workspace';
import { cn } from '@/lib/utils';

interface DraggablePanelProps {
  panel: PanelState;
  isActive: boolean;
  workspaceRef: React.RefObject<HTMLDivElement | null>;
  onBringToFront: (id: string) => void;
  onUpdateBounds: (id: string, bounds: Partial<Pick<PanelState, 'x' | 'y' | 'width' | 'height'>>) => void;
  onToggleMaximize: (id: string) => void;
  onClose: (id: string) => void;
  children: React.ReactNode;
}

export function DraggablePanel({
  panel,
  isActive,
  workspaceRef,
  onBringToFront,
  onUpdateBounds,
  onToggleMaximize,
  onClose,
  children,
}: DraggablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Esc to un-maximize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panel.isMaximized && isActive) {
        onToggleMaximize(panel.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panel.isMaximized, panel.id, isActive, onToggleMaximize]);

  const handlePointerDownHeader = (e: React.PointerEvent<HTMLDivElement>) => {
    if (panel.isMaximized) return; // Cannot drag when maximized
    e.preventDefault();
    e.stopPropagation();
    
    onBringToFront(panel.id);
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPanelX = panel.x;
    const startPanelY = panel.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!workspaceRef.current) return;
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      
      let newX = startPanelX + (moveEvent.clientX - startX);
      let newY = startPanelY + (moveEvent.clientY - startY);

      // Constrain to workspace
      newX = Math.max(0, Math.min(newX, workspaceRect.width - panel.width));
      newY = Math.max(0, Math.min(newY, workspaceRect.height - panel.height));

      onUpdateBounds(panel.id, { x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDownResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (panel.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();

    onBringToFront(panel.id);
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = panel.width;
    const startHeight = panel.height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!workspaceRef.current) return;
      const workspaceRect = workspaceRef.current.getBoundingClientRect();

      let newWidth = startWidth + (moveEvent.clientX - startX);
      let newHeight = startHeight + (moveEvent.clientY - startY);

      // Min sizes
      newWidth = Math.max(250, newWidth);
      newHeight = Math.max(150, newHeight);

      // Max sizes based on workspace and current position
      newWidth = Math.min(newWidth, workspaceRect.width - panel.x);
      newHeight = Math.min(newHeight, workspaceRect.height - panel.y);

      onUpdateBounds(panel.id, { width: newWidth, height: newHeight });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  if (panel.isClosed) return null;

  const maximizedStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: panel.zIndex,
  };

  const normalStyle: React.CSSProperties = {
    top: `${panel.y}px`,
    left: `${panel.x}px`,
    width: `${panel.width}px`,
    height: `${panel.height}px`,
    zIndex: panel.zIndex,
  };

  const currentStyle = panel.isMaximized ? maximizedStyle : normalStyle;

  return (
    <div
      ref={panelRef}
      onPointerDown={() => onBringToFront(panel.id)}
      style={currentStyle}
      className={cn(
        "absolute flex flex-col bg-black border shadow-2xl transition-all duration-75",
        "group/panel",
        panel.isMaximized ? "transition-[width,height,top,left] duration-300 ease-in-out" : "",
        isActive ? "border-amber-500/50" : "border-zinc-800",
        isDragging && "opacity-90 shadow-amber-500/10 border-amber-500/80 cursor-grabbing",
        isResizing && "opacity-90 border-amber-500/80"
      )}
    >
      {/* Header / Drag Handle */}
      <div
        onPointerDown={handlePointerDownHeader}
        className={cn(
          "flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur select-none",
          !panel.isMaximized && "cursor-grab active:cursor-grabbing",
          isActive ? "text-amber-500" : "text-zinc-500"
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-amber-500" : "bg-zinc-700")} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            {panel.title}
          </span>
        </div>

        {/* Controls - Fade in on panel hover or header hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-200">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onToggleMaximize(panel.id)}
            className="p-1 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded transition-colors"
            title={panel.isMaximized ? "Restore (Esc)" : "Maximize"}
          >
            {panel.isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onClose(panel.id)}
            className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-zinc-950/50 relative">
        {children}
      </div>

      {/* Resize Handle */}
      {!panel.isMaximized && (
        <div
          onPointerDown={handlePointerDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
        >
          {/* Subtle resize indicator */}
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-zinc-700 group-hover/panel:border-amber-500/50 transition-colors" />
        </div>
      )}
    </div>
  );
}
