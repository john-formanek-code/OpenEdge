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
  
  const data = await getHypotheses('active', params.search);
  const riskSummary = await getPortfolioRiskSummary();
  const events = await getMarketEvents();
  const equity = await getEquitySummary();
  const equityReturns = await getEquityReturns();
  const behavior = await getBehavioralStats();
  const marketState = await getLatestMarketState();

  return (
    <div className="h-full flex flex-col bg-black">
      {/* FUNCTION KEYS (Fake Tab Strip) */}
      <div className="h-6 bg-[#0b0b0b] border-b border-[color:var(--bb-border)] flex items-end px-1 space-x-1">
        <Link href="/?view=dash" className={`px-4 py-0.5 text-[9px] font-bold border-t border-x border-[color:var(--bb-border)] ${view === 'dash' ? 'bg-[var(--bb-amber)] text-black' : 'bg-black text-[#666] hover:text-[#ccc]'}`}>
          1) DASHBOARD
        </Link>
        <Link href="/?view=risk" className={`px-4 py-0.5 text-[9px] font-bold border-t border-x border-[color:var(--bb-border)] ${view === 'risk' ? 'bg-[var(--bb-amber)] text-black' : 'bg-black text-[#666] hover:text-[#ccc]'}`}>
          2) RISK_SUITE
        </Link>
        <Link href="/lab" className="px-4 py-0.5 text-[9px] font-bold border-t border-x border-[color:var(--bb-border)] bg-black text-[#666] hover:text-[#ccc]">
          3) SIGNAL_LAB
        </Link>
        <Link href="/blotter" className="px-4 py-0.5 text-[9px] font-bold border-t border-x border-[color:var(--bb-border)] bg-black text-[#666] hover:text-[#ccc]">
          4) EXECUTION
        </Link>
      </div>

      {/* LIVE QUOTE STRIP */}
      <LiveQuoteStrip />

      <PanelWorkspace
        watchlist={data}
        riskSummary={riskSummary}
        events={events.map((e) => ({ ...e, startTime: e.startTime?.toISOString?.() || e.startTime }))}
        equity={equity}
        equityReturns={equityReturns}
        behavior={behavior}
        marketState={marketState}
      />
    </div>
  );
}
