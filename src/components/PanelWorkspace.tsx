'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { PortfolioRiskPanel } from './PortfolioRiskPanel';
import { SurvivalPanel } from './SurvivalPanel';
import { BehavioralDashboard } from './BehavioralDashboard';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type Hypothesis = {
  id: string;
  symbol: string;
  bias: 'long' | 'short' | 'neutral';
  state?: string | null;
};

type Cluster = { name: string; exposure: number; rCount?: number };
type StopLevel = { price: number; risk: number; hypothesisId: string };
type RiskSummary = { clusters: Cluster[]; stops: StopLevel[] };
type MarketEvent = { id: string; name: string; impact: string; startTime: string | Date };
type Equity = { balance: number; drawdown: number };
type BehavioralStats = Parameters<typeof BehavioralDashboard>[0]['stats'];
type MarketStateSummary = { regime: string; vixProxy: number; biasSummary: string };
type Suggestion = {
  id: string;
  label: string;
  sublabel?: string;
  type: 'function' | 'security';
  payload: FunctionId | string;
};

type PanelState = {
  id: number;
  security?: string;
  functionId: FunctionId;
};

type FunctionId = 'WATCH' | 'RISK' | 'NEWS' | 'BEHAV';

const FUNCTION_REGISTRY: Record<FunctionId, { label: string; requiresContext?: boolean; related: FunctionId[] }> = {
  WATCH: { label: 'Monitor', related: ['RISK', 'NEWS'] },
  RISK: { label: 'Risk Suite', related: ['WATCH', 'NEWS'] },
  NEWS: { label: 'News/Events', related: ['WATCH'] },
  BEHAV: { label: 'Behavioral', related: ['WATCH', 'RISK'] },
};

const FUNCTIONS_BY_NUMBER: FunctionId[] = ['WATCH', 'RISK', 'NEWS', 'BEHAV'];

function WatchPanel({ data, security, onSelect }: { data: Hypothesis[]; security?: string; onSelect: (symbol: string) => void }) {
  const rows = security ? data.filter((d) => d.symbol === security) : data;
  return (
    <div className="panel-body">
      <table className="bb-table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Bias</th>
            <th className="text-right">State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr
              key={item.id}
              className="bb-row cursor-pointer hover:bg-[#0f0f0f]"
              onClick={() => onSelect(item.symbol)}
            >
              <td className="font-bold text-[var(--bb-amber)]">{item.symbol}</td>
              <td className={item.bias === 'long' ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}>
                {item.bias.toUpperCase()}
              </td>
              <td className="text-right text-[#888]">{item.state?.slice(0, 3) || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskPanel({ riskSummary, equityReturns, equity }: { riskSummary: RiskSummary; equityReturns: number[]; equity: Equity }) {
  return (
    <div className="grid grid-cols-2 gap-2 panel-body">
      <div className="panel-subwindow">
        <SurvivalPanel currentDD={equity.drawdown} historyR={equityReturns} />
      </div>
      <div className="panel-subwindow">
        <PortfolioRiskPanel data={riskSummary} />
      </div>
    </div>
  );
}

function NewsPanel({ events }: { events: MarketEvent[] }) {
  return (
    <div className="panel-body">
      <div className="bb-header sticky top-0 z-10">Upcoming Events</div>
      <div className="divide-y divide-[#111]">
        {events.map((e) => {
          const ts = new Date(e.startTime);
          return (
            <div key={e.id} className="flex items-center justify-between py-2 px-1 bb-row">
              <div className="flex items-center space-x-2">
                <span className={`bb-pill ${e.impact === 'high' ? 'text-[var(--bb-red)]' : 'text-[#aaa]'}`}>
                  {e.impact.toUpperCase()}
                </span>
                <span className="text-[10px] text-white">{e.name}</span>
              </div>
              <span className="text-[10px] text-[#888] font-mono">{ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BehaviorPanel({ stats }: { stats: BehavioralStats }) {
  return (
    <div className="panel-body">
      <BehavioralDashboard stats={stats} />
    </div>
  );
}

export function PanelWorkspace({
  watchlist,
  riskSummary,
  events,
  equity,
  equityReturns,
  behavior,
  marketState,
  initialSecurity,
}: {
  watchlist: Hypothesis[];
  riskSummary: RiskSummary;
  events: MarketEvent[];
  equity: Equity;
  equityReturns: number[];
  behavior: BehavioralStats;
  marketState: MarketStateSummary;
  initialSecurity?: string | null;
}) {
  const [activePanel, setActivePanel] = useState(0);
  const [panels, setPanels] = useState<PanelState[]>(() => [
    { id: 0, functionId: 'WATCH', security: initialSecurity || undefined },
    { id: 1, functionId: 'RISK' },
    { id: 2, functionId: 'NEWS' },
  ]);
  const [sector, setSector] = useState<'EQUITY' | 'CRYPTO' | 'FX'>('EQUITY');
  const [command, setCommand] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [linked, setLinked] = useState(true);

  const cyclePanel = useCallback((dir: 1 | -1) => {
    setActivePanel((p) => {
      const next = (p + dir + panels.length) % panels.length;
      return next;
    });
  }, [panels.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMenu(false);
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setShowMenu((s) => !s);
      }
      if (e.ctrlKey && e.shiftKey && e.key === ']') {
        e.preventDefault();
        cyclePanel(1);
      }
      if (e.ctrlKey && e.shiftKey && e.key === '[') {
        e.preventDefault();
        cyclePanel(-1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cyclePanel]);

  const pushSecurity = useCallback(
    (symbol: string, targetPanel: number) => {
      const normalized = symbol.toUpperCase();
      setPanels((prev) =>
        prev.map((p) =>
          linked || p.id === targetPanel
            ? { ...p, security: `${normalized}${sector === 'EQUITY' ? '' : `:${sector}`}` }
            : p
        )
      );
    },
    [linked, sector]
  );

  const handleGo = (input: string) => {
    const tokens = input.trim().toUpperCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return;
    let panelIndex = activePanel;
    if (/^P\d$/.test(tokens[0])) {
      panelIndex = parseInt(tokens[0].slice(1), 10) - 1;
      tokens.shift();
    }
    const updated = [...panels];
    const panel = { ...updated[panelIndex] };

    // link toggle
    if (tokens.includes('LNK') || tokens.includes('LINK')) setLinked(true);
    if (tokens.includes('UNL') || tokens.includes('UNLINK')) setLinked(false);

    // function mnemonic
    const fn = tokens.find((t) => FUNCTIONS_BY_NUMBER.includes(t as FunctionId));
    if (fn) panel.functionId = fn as FunctionId;

    // numeric jump (menu or related)
    if (/^\d$/.test(tokens[0] || '')) {
      const idx = parseInt(tokens[0], 10) - 1;
      if (showMenu) {
        const fnTarget = FUNCTIONS_BY_NUMBER[idx];
        if (fnTarget) panel.functionId = fnTarget;
      } else {
        const rel = FUNCTION_REGISTRY[panel.functionId].related[idx];
        if (rel) panel.functionId = rel;
      }
    }

    // security context (simple ticker)
    const tickerToken = tokens.find((t) => /^[A-Z]{1,6}$/.test(t));
    if (tickerToken) {
      pushSecurity(tickerToken, panelIndex);
    }

    updated[panelIndex] = { ...panel, security: panel.security };
    setPanels(updated);
    setActivePanel(panelIndex);
    setShowMenu(false);
    setShowSuggestions(false);
    setCommand('');
  };

  const suggestions: Suggestion[] = useMemo(() => {
    const term = command.trim().toUpperCase();
    if (!term) return [];
    const fnMatches = FUNCTIONS_BY_NUMBER.filter((fn) => fn.startsWith(term) || FUNCTION_REGISTRY[fn].label.toUpperCase().includes(term)).map((fn) => ({
      id: `fn-${fn}`,
      label: FUNCTION_REGISTRY[fn].label,
      sublabel: fn,
      type: 'function' as const,
      payload: fn,
    }));
    const securityMatches = watchlist
      .filter((w) => w.symbol.toUpperCase().includes(term))
      .map((w) => ({
        id: `sec-${w.id}`,
        label: w.symbol.toUpperCase(),
        sublabel: w.bias.toUpperCase(),
        type: 'security' as const,
        payload: w.symbol.toUpperCase(),
      }));
    return [...fnMatches, ...securityMatches].slice(0, 10);
  }, [command, watchlist]);

  const handleSuggestionExecute = (s: Suggestion) => {
    if (s.type === 'function') {
      handleGo(String(s.payload));
    } else if (s.type === 'security') {
      handleGo(String(s.payload));
    }
  };

  const renderPanel = (panel: PanelState) => {
    switch (panel.functionId) {
      case 'WATCH':
        return <WatchPanel data={watchlist} security={panel.security} onSelect={(s) => pushSecurity(s, panel.id)} />;
      case 'RISK':
        return <RiskPanel riskSummary={riskSummary} equityReturns={equityReturns} equity={equity} />;
      case 'NEWS':
        return (
          <div className="panel-body grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 panel-subwindow">
              <NewsPanel events={events} />
            </div>
            <div className="panel-subwindow">
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">REGIME</span>
                  <span className="text-[var(--bb-amber)] font-black uppercase">{marketState.regime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">VIX</span>
                  <span className="text-white font-mono">{marketState.vixProxy}</span>
                </div>
                <div className="bb-divider" />
                <div className="text-[#888]">NARRATIVE</div>
                <div className="text-white leading-tight">{marketState.biasSummary}</div>
              </div>
            </div>
          </div>
        );
      case 'BEHAV':
        return <BehaviorPanel stats={behavior} />;
      default:
        return null;
    }
  };

  const menuItems = useMemo(
    () =>
      FUNCTIONS_BY_NUMBER.map((fn, idx) => ({
        id: fn,
        label: `${idx + 1}) ${FUNCTION_REGISTRY[fn].label}`,
      })),
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="panel-commandbar sticky top-0 z-20 backdrop-blur-[2px]">
        <div className="flex items-center space-x-2">
          <span className="bb-pill">P{activePanel + 1}</span>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as 'EQUITY' | 'CRYPTO' | 'FX')}
            className="bb-select h-8 w-24"
            aria-label="Sector key"
          >
            <option value="EQUITY">EQUITY</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="FX">FX</option>
          </select>
          <button
            type="button"
            className={`bb-button h-8 px-3 ${linked ? '' : 'secondary'}`}
            onClick={() => setLinked((v) => !v)}
          >
            {linked ? 'LINKED' : 'UNLINKED'}
          </button>
        </div>
        <form
          className="panel-input flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (highlightIdx >= 0 && suggestions[highlightIdx]) {
              handleSuggestionExecute(suggestions[highlightIdx]);
            } else {
              handleGo(command);
            }
          }}
        >
          <span className="prompt">&gt;</span>
          <input
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setShowSuggestions(true);
              setHighlightIdx(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
            onKeyDown={(e) => {
              if (!showSuggestions || suggestions.length === 0) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightIdx((i) => (i + 1) % suggestions.length);
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightIdx((i) => (i - 1 + suggestions.length) % suggestions.length);
              }
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                setHighlightIdx(-1);
              }
            }}
            placeholder="Example: AAPL GO  |  RISK GO  |  P2 NEWS GO"
            className="panel-input-field"
            autoFocus
          />
          <button type="submit" className="bb-button h-7 px-3">GO</button>
        </form>
      </div>
      <div className="hint-line">GO executes · Alt+M toggles MENU · Esc closes overlays · Ctrl+Shift+[ / ] switches panels · Sector key filters ticker context</div>

      {showMenu && (
        <div className="panel-menu">
          <div className="menu-header">FUNCTION MENU — ACTIVE PANEL P{activePanel + 1}</div>
          <div className="menu-grid">
            {menuItems.map((m) => (
              <button key={m.id} className="menu-item" onClick={() => handleGo(String(menuItems.indexOf(m) + 1))}>
                <span className="num-link">{menuItems.indexOf(m) + 1}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <div className="menu-footer">Tip: type the number then GO to jump.</div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="panel-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              className={cn('suggestion-row', highlightIdx === i && 'active')}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionExecute(s);
              }}
            >
              <span className="suggestion-label">{s.label}</span>
              <span className="suggestion-sub">{s.sublabel}</span>
              <span className="suggestion-type">{s.type}</span>
            </button>
          ))}
          <div className="menu-footer">Arrows to navigate · Enter/GO to run · Esc to close</div>
        </div>
      )}

      <div className="panel-grid">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={cn('panel-shell', activePanel === panel.id && 'panel-active')}
            onClick={() => setActivePanel(panel.id)}
          >
            <div className="panel-toolbar">
              <div className="flex items-center space-x-2">
                <span className="bb-chip">P{panel.id + 1}</span>
                <span className="toolbar-title">{FUNCTION_REGISTRY[panel.functionId].label}</span>
                <span className="toolbar-security">{panel.security || 'NO SECURITY LOADED'}</span>
              </div>
              <div className="flex items-center space-x-2 text-[9px] text-[#7a7a7a]">
                <span className="bb-pill">LINKED</span>
                <span>STATUS: LIVE</span>
              </div>
            </div>
            {renderPanel(panel)}
          </div>
        ))}
      </div>
    </div>
  );
}
