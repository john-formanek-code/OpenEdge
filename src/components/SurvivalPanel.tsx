'use client';

import { ShieldAlert, Binary } from 'lucide-react';
import { useMemo } from 'react';

export function SurvivalPanel({ currentDD = 0, historyR = [] }: { currentDD?: number, historyR?: number[] }) {
  const suggestedRisk = useMemo(() => {
    if (currentDD > 10) return 0.25;
    if (currentDD > 5) return 0.5;
    return 1.0;
  }, [currentDD]);

  const distribution = useMemo(() => {
    if (historyR.length < 5) return null;
    
    // Simple Monte Carlo: 1000 paths, 20 trades each
    const paths = 1000;
    const trades = 20;
    const finalReturns: number[] = [];

    for (let p = 0; p < paths; p++) {
      let pathReturn = 0;
      for (let t = 0; t < trades; t++) {
        // Randomly sample from history
        const sample = historyR[Math.floor(Math.random() * historyR.length)];
        pathReturn += sample;
      }
      finalReturns.push(pathReturn);
    }

    const sorted = finalReturns.sort((a, b) => a - b);
    const pick = (pct: number) => {
      const idx = Math.min(sorted.length - 1, Math.floor((pct / 100) * sorted.length));
      return sorted[idx];
    };

    return {
      worst: sorted[0],
      p10: pick(10),
      median: pick(50),
      p90: pick(90),
      best: sorted[sorted.length - 1],
    };
  }, [historyR]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Risk Scaling */}
      <div>
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-[color:var(--bb-border)]">
          <h3 className="text-[10px] font-bold text-[#888] uppercase flex items-center tracking-[0.08em]">
            <ShieldAlert className="w-3 h-3 mr-1 text-[var(--bb-red)]" />
            Survival Protocol
          </h3>
          <span className="text-[9px] bg-[#220000] text-[var(--bb-red)] px-2 border border-red-900 font-black">
            DD: {currentDD}%
          </span>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xl font-mono font-black text-white">{suggestedRisk}%</div>
            <div className="text-[9px] text-[#555] uppercase">Risk Cap</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-[#888]">Mode: Aggressive</div>
          </div>
        </div>
      </div>

      {/* Monte Carlo */}
      <div>
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-[color:var(--bb-border)]">
          <h3 className="text-[10px] font-bold text-[#888] uppercase flex items-center tracking-[0.08em]">
            <Binary className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
            Equity Sim (20T)
          </h3>
        </div>

        {!distribution ? (
          <div className="text-[#444] text-[9px] italic text-center py-2">Awaiting equity history...</div>
        ) : (
          <div className="grid grid-cols-3 gap-1 text-center">
             <div className="bg-[#0b0b0b] p-2 border border-[color:var(--bb-border)]">
               <div className="text-[8px] text-[#555]">P1</div>
               <div className="text-[10px] font-mono text-[var(--bb-red)] font-black">{distribution.worst.toFixed(2)}%</div>
             </div>
             <div className="bg-[#0b0b0b] p-2 border border-[color:var(--bb-border)]">
               <div className="text-[8px] text-[#555]">MED</div>
               <div className="text-[10px] font-mono text-[var(--bb-amber)] font-black">{distribution.median.toFixed(2)}%</div>
             </div>
             <div className="bg-[#0b0b0b] p-2 border border-[color:var(--bb-border)]">
               <div className="text-[8px] text-[#555]">P99</div>
               <div className="text-[10px] font-mono text-[var(--bb-green)] font-black">{distribution.best.toFixed(2)}%</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
