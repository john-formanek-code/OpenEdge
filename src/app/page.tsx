import { getHypotheses, getPortfolioRiskSummary, getMarketEvents, getEquitySummary, getEquityReturns, getLatestMarketState } from "@/lib/actions/hypotheses";
import { PanelWorkspace, type Hypothesis, type RiskSummary, type MarketEvent, type MarketStateSummary } from "@/components/PanelWorkspace";
import { LiveQuoteStrip } from "@/components/LiveQuoteStrip";
import { FunctionKey } from "@/components/FunctionKey";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string; load?: string }>;
}) {
  const params = await searchParams;
  const view = params.view || "dash"; 
  const load = params.load?.toUpperCase();
  
  const data = await getHypotheses('active', params.search);
  const riskSummary = await getPortfolioRiskSummary();
  const events = await getMarketEvents();
  const equity = await getEquitySummary();
  const equityReturns = await getEquityReturns();
  const marketState = await getLatestMarketState();

  return (
    <div className="h-full flex flex-col bg-black">
      {/* FUNCTION KEYS (Bloomberg-style strip) */}
      <div className="function-strip">
        {[
          { key: 'F1', label: 'Dashboard', href: '/?view=dash', active: view === 'dash', panelId: 'WATCH' },
          { key: 'F2', label: 'Risk Suite', href: '/?view=risk', active: view === 'risk', panelId: 'RISK' },
          { key: 'F3', label: 'World Markets', href: '#', active: false, panelId: 'WEI' },
          { key: 'F4', label: 'Eco Calendar', href: '#', active: false, panelId: 'ECO' },
          { key: 'F5', label: 'Watchlist', href: '/watch', active: false, panelId: 'WATCHLIST' },
          { key: 'F6', label: 'Charts', href: '#', active: false, panelId: 'CHARTS' },
          { key: 'F7', label: 'Execution', href: '/blotter', active: false },
          { key: 'F8', label: 'System', href: '/settings', active: false },
        ].map((item) => (
          <FunctionKey key={item.key} item={item} />
        ))}
      </div>

      {/* LIVE QUOTE STRIP */}
      <LiveQuoteStrip view={view} />

      <PanelWorkspace
        key={load || 'default'}
        watchlist={data as unknown as Hypothesis[]}
        riskSummary={riskSummary as RiskSummary}
        events={events.map((e) => ({ ...e, startTime: e.startTime?.toISOString?.() || e.startTime })) as unknown as MarketEvent[]}
        equity={equity}
        equityReturns={equityReturns}
        marketState={marketState as MarketStateSummary}
        initialSecurity={load}
      />
    </div>
  );
}
