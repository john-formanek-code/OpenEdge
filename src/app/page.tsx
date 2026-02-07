import { getHypotheses, getPortfolioRiskSummary, getMarketEvents, getEquitySummary, getBehavioralStats, getEquityReturns, getLatestMarketState } from "@/lib/actions/hypotheses";
import { PanelWorkspace } from "@/components/PanelWorkspace";
import { LiveQuoteStrip } from "@/components/LiveQuoteStrip";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string }>;
}) {
  const params = await searchParams;
  const view = params.view || "dash"; 
  const load = params.load?.toUpperCase();
  
  const data = await getHypotheses('active', params.search);
  const riskSummary = await getPortfolioRiskSummary();
  const events = await getMarketEvents();
  const equity = await getEquitySummary();
  const equityReturns = await getEquityReturns();
  const behavior = await getBehavioralStats();
  const marketState = await getLatestMarketState();

  return (
    <div className="h-full flex flex-col bg-black">
      {/* FUNCTION KEYS (Bloomberg-style strip) */}
      <div className="function-strip">
        {[
          { key: 'F1', label: 'Dashboard', href: '/?view=dash', active: view === 'dash' },
          { key: 'F2', label: 'Risk Suite', href: '/?view=risk', active: view === 'risk' },
          { key: 'F3', label: 'Signal Lab', href: '/lab', active: false },
          { key: 'F4', label: 'Execution', href: '/blotter', active: false },
          { key: 'F5', label: 'Watchlist', href: '/watch', active: false },
          { key: 'F6', label: 'System', href: '/settings', active: false },
          { key: 'F7', label: 'Help', href: '/help', active: false },
          { key: 'F8', label: 'Journal', href: '/blotter?view=journal', active: false },
        ].map((item) => (
          <Link key={item.key} href={item.href} className={`function-key ${item.active ? 'active' : ''}`}>
            <span className="keycode">{item.key}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* LIVE QUOTE STRIP */}
      <LiveQuoteStrip view={view} />

      <PanelWorkspace
        key={load || 'default'}
        watchlist={data}
        riskSummary={riskSummary}
        events={events.map((e) => ({ ...e, startTime: e.startTime?.toISOString?.() || e.startTime }))}
        equity={equity}
        equityReturns={equityReturns}
        behavior={behavior}
        marketState={marketState}
        initialSecurity={load}
      />
    </div>
  );
}
