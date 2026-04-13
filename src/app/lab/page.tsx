import { db } from "@/db";
import { strategies, backtests, marketFeatures } from "@/db/schema";
import { desc } from "drizzle-orm";
import { AlertTriangle, Clock, FastForward, Heart } from "lucide-react";
import { getExpectancyStats, getBehavioralStats } from "@/lib/actions/hypotheses";
import { AddFeatureForm } from "@/components/AddFeatureForm";
import { BacktestConfigForm } from "@/components/BacktestConfigForm";

export default async function SignalLabPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = tab || 'research';

  const allStrategies = await db.select().from(strategies);
  const recentBacktests = await db.select().from(backtests).orderBy(desc(backtests.createdAt)).limit(5);
  const realFeatures = await db.select().from(marketFeatures).orderBy(desc(marketFeatures.timestamp)).limit(10);
  const setupStats = await getExpectancyStats();
  const behavioral = await getBehavioralStats();

  return (
    <div className="h-full flex flex-col bg-black">
      
      {/* Tab Strip */}
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 flex items-center justify-between text-[10px] font-bold">
        <div className="flex space-x-4">
          <a href="?tab=research" className={currentTab === 'research' ? 'text-[var(--terminal-accent)]' : 'text-zinc-600'}>1. SIGNAL_RESEARCH</a>
          <a href="?tab=performance" className={currentTab === 'performance' ? 'text-[var(--terminal-accent)]' : 'text-zinc-600'}>2. PERFORMANCE_ANAL</a>
        </div>
        <div className="text-zinc-500 font-mono">QUANT_STATION: 01</div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-[1px] bg-[#222] overflow-hidden p-[1px]">
        
        {currentTab === 'research' ? (
          <>
            {/* Feature Store (Left) */}
            <div className="col-span-4 bg-black flex flex-col min-h-0">
              <div className="terminal-header">
                <span>FEATURE_STORE // TICKER_DATA</span>
                <AddFeatureForm />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-[9px] font-mono border-collapse">
                  <thead className="bg-[#050505] text-zinc-600 sticky top-0 border-b border-[#222]">
                    <tr>
                      <th className="text-left p-2">SYM</th>
                      <th className="text-left p-2">NAME</th>
                      <th className="text-right p-2 pr-4">VAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realFeatures.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-zinc-700 italic uppercase">No signals stored. Use form above.</td>
                      </tr>
                    ) : realFeatures.map((f) => (
                      <tr key={f.id} className="border-b border-[#111] hover:bg-[#0a0a0a]">
                        <td className="p-2 font-bold text-white uppercase">{f.symbol}</td>
                        <td className="p-2 text-zinc-500 uppercase">{f.name}</td>
                        <td className="p-2 pr-4 text-right text-blue-400 font-bold">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategy & Backtest (Right) */}
            <div className="col-span-8 bg-black flex flex-col min-h-0 border-l border-[#333]">
              <div className="terminal-header">STRATEGY_REGISTRY & SIM_QUEUE</div>
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="border border-[#333] p-4">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4">Active Strategies</h4>
                    <div className="space-y-2">
                      {allStrategies.length === 0 ? (
                        <div className="text-[9px] text-zinc-700 uppercase">No active playbooks.</div>
                      ) : allStrategies.map(s => (
                        <div key={s.id} className="bg-[#050505] border border-[#222] p-2 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-[#e5e5e5] uppercase">{s.name}</span>
                          <span className="text-[8px] bg-green-900/30 text-green-500 px-1 border border-green-900/50 font-black">LIVE</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <BacktestConfigForm strategies={allStrategies} />
                </div>
                <div className="space-y-4">
                   <div className="border border-red-900/30 bg-red-950/10 p-4">
                     <div className="flex items-center text-red-500 text-[10px] font-black uppercase mb-2 tracking-tighter">
                       <AlertTriangle className="w-3 h-3 mr-1" /> Overfit / Leakage Alarms
                     </div>
                     <p className="text-[9px] text-red-400 leading-tight">Overlap detected in 2 concurrent backtests. Ensure walk-forward windows are anchored correctly.</p>
                   </div>
                   <div className="border border-[#333] p-4 flex-1">
                     <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4">Job Queue</h4>
                     {recentBacktests.length === 0 ? (
                        <div className="text-[9px] text-zinc-700 uppercase">Queue empty.</div>
                     ) : recentBacktests.map(j => (
                       <div key={j.id} className="flex justify-between items-center text-[9px] font-mono border-b border-[#111] py-1">
                         <span className="text-zinc-400">{j.type}</span>
                         <span className="text-yellow-500 uppercase">{j.status}</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12 bg-black flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-6">
            <div className="grid grid-cols-3 gap-4">
               {/* Behavioral Scorecard */}
               <div className="border border-[#333] bg-[#050505] p-4 flex flex-col items-center text-center">
                  <Clock className="w-5 h-5 text-blue-400 mb-2" />
                  <div className="text-[18px] font-black text-white font-mono">{behavioral.latency}</div>
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Trigger to Fill Latency</div>
               </div>
               <div className="border border-[#333] bg-[#050505] p-4 flex flex-col items-center text-center">
                  <FastForward className="w-5 h-5 text-amber-500 mb-2" />
                  <div className="text-[18px] font-black text-white font-mono">{behavioral.drift}</div>
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Manual Plan Drift</div>
               </div>
               <div className="border border-[#333] bg-[#050505] p-4 flex flex-col items-center text-center">
                  <Heart className="w-5 h-5 text-red-500 mb-2" />
                  <div className="text-[18px] font-black text-white font-mono">{behavioral.breakRate}</div>
                  <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Rule Violation Rate</div>
               </div>
            </div>

            <div className="border border-[#333] bg-black flex flex-col min-h-0">
              <div className="terminal-header">PLAYBOOK_EXPECTANCY // PERFORMANCE_DECOMP</div>
              <div className="p-4">
                <table className="w-full text-[10px] font-mono border-collapse">
                  <thead className="bg-[#050505] text-zinc-600 border-b border-[#222]">
                    <tr>
                      <th className="text-left p-3 font-normal uppercase">Setup_Type</th>
                      <th className="text-left p-3 font-normal uppercase">Count</th>
                      <th className="text-left p-3 font-normal uppercase">Win_Rate</th>
                      <th className="text-left p-3 font-normal uppercase">Avg_R</th>
                      <th className="text-right p-3 pr-6 font-normal uppercase">Alpha_Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setupStats.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-700 italic uppercase">No closed trades available for decomposition.</td>
                      </tr>
                    ) : setupStats.map((s) => (
                      <tr key={s.name} className="border-b border-[#111] hover:bg-[#0a0a0a]">
                        <td className="p-3 font-bold text-white uppercase">{s.name}</td>
                        <td className="p-3 text-zinc-500">{s.count}</td>
                        <td className="p-3">
                          <span className={s.winRate > 50 ? 'text-green-500' : 'text-zinc-400'}>{s.winRate.toFixed(1)}%</span>
                        </td>
                        <td className={`p-3 font-bold ${s.expectancy > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {s.expectancy.toFixed(2)}R
                        </td>
                        <td className="p-3 pr-6 text-right">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                            s.expectancy > 0.5 ? 'border-green-900 text-green-500' : 'border-zinc-800 text-zinc-600'
                          }`}>
                            {s.expectancy > 0.5 ? 'EDGE+' : 'NO_ALPHA'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
