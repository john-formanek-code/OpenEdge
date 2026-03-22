'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioRiskPanel } from './PortfolioRiskPanel';
import { SurvivalPanel } from './SurvivalPanel';
import { WatchlistBoard } from './WatchlistBoard';
import { WorldEquityIndices } from './WorldEquityIndices';
import { EconomicCalendar } from './EconomicCalendar';
import { MultiChartGrid } from './TradingViewChart';
import { MarketMovers } from './MarketMovers';
import { DraggablePanel } from './workspace/DraggablePanel';
import { useWorkspaceLayout } from '@/hooks/useWorkspaceLayout';
import { PanelState as WorkspacePanelState } from '@/types/workspace';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export type Hypothesis = {
  id: string;
  symbol: string;
  bias: 'long' | 'short' | 'neutral';
  state?: string | null;
};

export type Cluster = { name: string; exposure: number; rCount?: number };
export type StopLevel = { price: number; risk: number; hypothesisId: string };
export type RiskSummary = { clusters: Cluster[]; stops: StopLevel[] };
export type MarketEvent = { id: string; name: string; impact: string; startTime: string | Date };
export type Equity = { balance: number; drawdown: number };
export type MarketStateSummary = { regime: string; vixProxy: number; biasSummary: string };

type FunctionId = 'WATCH' | 'RISK' | 'NEWS' | 'WATCHLIST' | 'WEI' | 'ECO' | 'CHARTS' | 'TOP';

const FUNCTION_REGISTRY: Record<FunctionId, { label: string; requiresContext?: boolean; related: FunctionId[] }> = {
  WATCH: { label: 'Monitor', related: ['RISK', 'NEWS'] },
  RISK: { label: 'Risk Suite', related: ['WATCH', 'NEWS'] },
  NEWS: { label: 'News/Events', related: ['WATCH'] },
  WATCHLIST: { label: 'Watchlist', related: ['WATCH'] },
  WEI: { label: 'World Markets', related: ['ECO'] },
  ECO: { label: 'Economic Calendar', related: ['WEI'] },
  CHARTS: { label: 'Multi-Charts', related: ['WATCHLIST'] },
  TOP: { label: 'Top Movers', related: ['WATCH'] },
};

const INITIAL_WORKSPACE_PANELS: WorkspacePanelState[] = [
  {
    id: 'WATCH',
    title: 'Monitor',
    x: 10,
    y: 10,
    width: 500,
    height: 400,
    isMaximized: false,
    isClosed: false,
    zIndex: 1,
  },
  {
    id: 'RISK',
    title: 'Risk Suite',
    x: 520,
    y: 10,
    width: 600,
    height: 400,
    isMaximized: false,
    isClosed: false,
    zIndex: 2,
  },
  {
    id: 'NEWS',
    title: 'News/Events',
    x: 10,
    y: 420,
    width: 500,
    height: 300,
    isMaximized: false,
    isClosed: false,
    zIndex: 3,
  },
];

function WatchPanel({ data, security, onSelect }: { data: Hypothesis[]; security?: string; onSelect: (symbol: string) => void }) {
  const rows = security ? data.filter((d) => d.symbol === security) : data;
  return (
    <div className="p-2 h-full overflow-auto">
      <table className="w-full text-[11px] font-mono border-collapse">
        <thead>
          <tr className="text-[#666] border-b border-[#222] text-left">
            <th className="pb-1">Ticker</th>
            <th className="pb-1">Bias</th>
            <th className="pb-1 text-right">State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#111] cursor-pointer hover:bg-[#0f0f0f]"
              onClick={() => onSelect(item.symbol)}
            >
              <td className="py-1 font-bold text-[var(--bb-amber)]">{item.symbol}</td>
              <td className={cn("py-1", item.bias === 'long' ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]')}>
                {item.bias.toUpperCase()}
              </td>
              <td className="py-1 text-right text-[#888]">{item.state?.slice(0, 3) || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskPanel({ riskSummary, equityReturns, equity }: { riskSummary: RiskSummary; equityReturns: number[]; equity: Equity }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-2 h-full overflow-auto">
      <div className="bg-[#050505] border border-[#111] p-1">
        <SurvivalPanel currentDD={equity.drawdown} historyR={equityReturns} />
      </div>
      <div className="bg-[#050505] border border-[#111] p-1">
        <PortfolioRiskPanel data={riskSummary} />
      </div>
    </div>
  );
}

function NewsPanel({ events, marketState }: { events: MarketEvent[]; marketState: MarketStateSummary }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2">
            <div className="lg:col-span-2 border border-[#111] bg-[#050505] overflow-auto max-h-[250px]">
                <div className="text-[9px] font-black text-[#555] uppercase px-2 py-1 border-b border-[#111] bg-[#0a0a0a] sticky top-0">Upcoming Events</div>
                <div className="divide-y divide-[#111]">
                    {events.map((e) => {
                        const ts = new Date(e.startTime);
                        return (
                            <div key={e.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-[#0f0f0f]">
                                <div className="flex items-center space-x-2">
                                    <span className={cn("text-[9px] font-bold", e.impact === 'high' ? 'text-[var(--bb-red)]' : 'text-[#aaa]')}>
                                        {e.impact.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-white truncate max-w-[150px]">{e.name}</span>
                                </div>
                                <span className="text-[10px] text-[#888] font-mono">{ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border border-[#111] bg-[#050505] p-2 space-y-2 text-[10px]">
                <div className="flex justify-between items-center">
                    <span className="text-[#888]">REGIME</span>
                    <span className="text-[var(--bb-amber)] font-black uppercase">{marketState.regime}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#888]">VIX</span>
                    <span className="text-white font-mono">{marketState.vixProxy}</span>
                </div>
                <div className="h-px bg-[#111]" />
                <div className="text-[#888]">NARRATIVE</div>
                <div className="text-white leading-tight">{marketState.biasSummary}</div>
            </div>
        </div>
    </div>
  );
}

export function PanelWorkspace({
  watchlist,
  riskSummary,
  events,
  equity,
  equityReturns,
  marketState,
  initialSecurity,
}: {
  watchlist: Hypothesis[];
  riskSummary: RiskSummary;
  events: MarketEvent[];
  equity: Equity;
  equityReturns: number[];
  marketState: MarketStateSummary;
  initialSecurity?: string | null;
}) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const {
    state,
    isLoaded,
    bringToFront,
    updatePanelBounds,
    toggleMaximize,
    closePanel,
    openPanel,
    addOrOpenPanel,
  } = useWorkspaceLayout(INITIAL_WORKSPACE_PANELS);

  const [panelSecurities, setPanelSecurities] = useState<Record<string, string>>({
    WATCH: initialSecurity || '',
  });

  const pushSecurity = useCallback(
    (symbol: string, targetId: string) => {
      const normalized = symbol.toUpperCase();
      setPanelSecurities((prev) => ({ ...prev, [targetId]: normalized }));
    },
    []
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragData = e.dataTransfer.getData('application/trade-os-panel');
    if (!dragData) return;

    try {
      const { id, title } = JSON.parse(dragData);
      
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      const spawnX = Math.max(10, Math.min(dropX - 100, rect.width - 510));
      const spawnY = Math.max(10, Math.min(dropY - 20, rect.height - 410));

      addOrOpenPanel({
        id,
        title,
        x: spawnX,
        y: spawnY,
        width: 500,
        height: 400,
      });
    } catch (err) {
      console.error('Failed to parse drag data', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  if (!isLoaded) {
    return <div className="flex-1 bg-black animate-pulse" />;
  }

  const renderPanel = (panel: WorkspacePanelState) => {
    switch (panel.id) {
      case 'WATCH':
        return <WatchPanel data={watchlist} security={panelSecurities[panel.id]} onSelect={(s) => pushSecurity(s, panel.id)} />;
      case 'RISK':
        return <RiskPanel riskSummary={riskSummary} equityReturns={equityReturns} equity={equity} />;
      case 'NEWS':
        return <NewsPanel events={events} marketState={marketState} />;
      case 'WATCHLIST':
        return <div className="h-full overflow-hidden"><WatchlistBoard /></div>;
      case 'WEI':
        return <div className="h-full overflow-hidden"><WorldEquityIndices /></div>;
      case 'ECO':
        return <div className="h-full overflow-hidden"><EconomicCalendar /></div>;
      case 'CHARTS':
        return <div className="h-full overflow-hidden"><MultiChartGrid initialSymbol={panelSecurities[panel.id] || 'BTC'} /></div>;
      case 'TOP':
        return <div className="h-full overflow-hidden"><MarketMovers /></div>;
      default:
        // Handle cases where panel.id might be the title or something else from drag
        if (panel.id === 'WATCHLIST') return <div className="h-full overflow-hidden"><WatchlistBoard /></div>;
        if (panel.id === 'WEI') return <div className="h-full overflow-hidden"><WorldEquityIndices /></div>;
        if (panel.id === 'ECO') return <div className="h-full overflow-hidden"><EconomicCalendar /></div>;
        if (panel.id === 'CHARTS') return <div className="h-full overflow-hidden"><MultiChartGrid /></div>;
        if (panel.id === 'TOP') return <div className="h-full overflow-hidden"><MarketMovers /></div>;
        return null;
    }
  };

  const closedPanels = state.panels.filter(p => p.isClosed);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-black">
      {/* Reopen panels bar - subtle and only shown if panels are closed */}
      {closedPanels.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1 border-b border-[#1a1a1a] bg-[#050505] z-50">
          <span className="text-[9px] font-black text-zinc-600 uppercase mr-2">Restore:</span>
          <div className="flex gap-1">
            {closedPanels.map(p => (
              <button 
                key={p.id} 
                onClick={() => openPanel(p.id)}
                className="h-6 px-2 bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 hover:text-amber-500 uppercase font-bold transition-colors"
              >
                +{p.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WORKSPACE AREA */}
      <div 
        ref={workspaceRef} 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 relative overflow-hidden bg-[#030303]"
      >
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px'}} />
          
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
              <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm">
                  {/* Internal panel info bar */}
                  <div className="flex items-center justify-between px-2 py-1 bg-zinc-900/30 border-b border-zinc-800/50">
                      <div className="text-[9px] font-mono text-zinc-500">
                          ID: <span className="text-amber-500/80">{panel.id}</span>
                          {panelSecurities[panel.id] && (
                              <> | SEC: <span className="text-zinc-300">{panelSecurities[panel.id]}</span></>
                          )}
                      </div>
                      <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">STATUS: LIVE</div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    {renderPanel(panel)}
                  </div>
              </div>
            </DraggablePanel>
          ))}
      </div>
    </div>
  );
}
