import { getHypotheses, getPortfolioRiskSummary, getMarketEvents, getEquitySummary, getEquityReturns, getLatestMarketState } from "@/lib/actions/hypotheses";
import { PanelWorkspace, type Hypothesis, type RiskSummary, type MarketEvent, type MarketStateSummary } from "@/components/PanelWorkspace";
import { LiveQuoteStrip } from "@/components/LiveQuoteStrip";
import { FunctionKey } from "@/components/FunctionKey";
import Link from "next/link";

export default async function TerminalPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string; load?: string }>;
}) {
  const params = await searchParams;
  const view = params.view || "dash";
  const load = params.load?.toUpperCase();

  let data, riskSummary, events, equity, equityReturns, marketState;

  try {
    data = await getHypotheses("active", params.search);
    riskSummary = await getPortfolioRiskSummary();
    events = await getMarketEvents();
    equity = await getEquitySummary();
    equityReturns = await getEquityReturns();
    marketState = await getLatestMarketState();
  } catch (error: any) {
    console.error("Terminal Page Error:", error);
    return (
      <div className="h-full flex items-center justify-center bg-black text-amber-500 p-10 font-mono border-4 border-amber-900/30">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl font-black italic">TERMINAL BOOT FAILURE</h2>
          <p className="text-zinc-400 text-sm">A critical exception occurred while initializing the workspace. This is usually due to missing environment variables (DATABASE_URL) or an uninitialized database schema.</p>
          <div className="bg-zinc-900 p-4 border border-zinc-800">
            <p className="text-xs text-red-400">ERROR_DIGEST: {error.digest || "N/A"}</p>
            <p className="text-xs text-zinc-500 mt-2">{error.message}</p>
          </div>
          <div className="flex gap-4 pt-4">
            <Link href="/" className="px-4 py-2 bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition">BACK TO HOME</Link>
            <a href="https://github.com/john-formanek-code/OpenEdge#quick-start" target="_blank" className="px-4 py-2 border border-zinc-800 text-zinc-400 text-xs font-bold hover:border-amber-500/50 hover:text-amber-500 transition">VIEW SETUP GUIDE</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="function-strip">
        {[
          { key: "F1", label: "Dashboard", href: "/terminal?view=dash", active: view === "dash", panelId: "WATCH" },
          { key: "F2", label: "Risk Suite", href: "/terminal?view=risk", active: view === "risk", panelId: "RISK" },
          { key: "F3", label: "World Markets", href: "/terminal?search=WEI", active: false, panelId: "WEI" },
          { key: "F4", label: "Eco Calendar", href: "/terminal?search=ECO", active: false, panelId: "ECO" },
          { key: "F5", label: "Watchlist", href: "/watch", active: false, panelId: "WATCHLIST" },
          { key: "F6", label: "Charts", href: "/terminal?search=CHARTS", active: false, panelId: "CHARTS" },
          { key: "F7", label: "Top Movers", href: "/terminal?search=TOP", active: false, panelId: "TOP" },
          { key: "F8", label: "Pos Builder", href: "/terminal?search=POSB", active: false, panelId: "POSB" },
          { key: "F9", label: "News", href: "/terminal?search=NEWS", active: false, panelId: "NEWS" },
          { key: "F10", label: "Curve", href: "/terminal?search=CURV", active: false, panelId: "CURV" },
          { key: "F11", label: "Heatmap", href: "/terminal?search=HEAT", active: false, panelId: "HEAT" },
          { key: "F12", label: "Alerts", href: "/terminal?search=ALRT", active: false, panelId: "ALRT" },
        ].map((item) => (
          <FunctionKey key={item.key} item={item} />
        ))}
      </div>

      <LiveQuoteStrip view={view} />

      <PanelWorkspace
        key={load || "default"}
        watchlist={data as unknown as Hypothesis[]}
        riskSummary={riskSummary as RiskSummary}
        events={events.map((e: any) => ({ ...e, startTime: e.startTime?.toISOString?.() || e.startTime })) as unknown as MarketEvent[]}
        equity={equity}
        equityReturns={equityReturns}
        marketState={marketState as MarketStateSummary}
        initialSecurity={load}
      />
    </div>
  );
}
