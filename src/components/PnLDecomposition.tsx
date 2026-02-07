'use client';

import { useState } from 'react';
import { Layers, Target, Activity } from 'lucide-react';

export function PnLDecomposition({ pnl, positionSize }: { pnl: number, positionSize: number }) {
  const [benchmarkReturn, setBenchmarkReturn] = useState(0); // in %
  
  // Real Calculation Logic
  // Beta PnL = Position Size * Benchmark Return
  // Alpha PnL = Total PnL - Beta PnL - Execution Cost (Assumed ~5% of alpha for estimation)
  
  const betaPnL = positionSize * (benchmarkReturn / 100);
  // Simplify: Total = Alpha + Beta. Ignore execution for the decomposition math to keep it clean, 
  // or subtract a fixed fee estimation.
  const alphaPnL = pnl - betaPnL;

  return (
    <div className="bb-card">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[color:var(--bb-border)]">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[var(--bb-amber)]" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest">PnL Attribution</h3>
        </div>
        <div className="flex items-center space-x-2 bg-black border border-[color:var(--bb-border)] px-2 py-1">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.06em]">Benchmark %</span>
          <input 
            type="number" 
            value={benchmarkReturn}
            onChange={(e) => setBenchmarkReturn(parseFloat(e.target.value))}
            className="bb-input w-16 bg-transparent border-0 focus:outline-none text-right"
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Alpha */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0c0c0c] flex items-center justify-center border border-[color:var(--bb-border)]">
              <Target className="w-4 h-4 text-[var(--bb-green)]" />
            </div>
            <div>
              <div className="text-sm font-bold">Alpha (Edge)</div>
              <div className="text-[10px] text-zinc-500">Your decision contribution</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-mono font-bold ${alphaPnL > 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
              {alphaPnL > 0 ? '+' : ''}{alphaPnL.toFixed(2)}
            </div>
            <div className="text-[10px] text-[var(--bb-green)] font-bold uppercase">True Edge</div>
          </div>
        </div>

        {/* Beta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0c0c0c] flex items-center justify-center border border-[color:var(--bb-border)]">
              <Activity className="w-4 h-4 text-[var(--bb-amber)]" />
            </div>
            <div>
              <div className="text-sm font-bold">Beta (Market)</div>
              <div className="text-[10px] text-zinc-500">Passive market returns</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-mono font-bold ${betaPnL > 0 ? 'text-[#55c8ff]' : 'text-zinc-400'}`}>
              {betaPnL > 0 ? '+' : ''}{betaPnL.toFixed(2)}
            </div>
            <div className="text-[10px] text-zinc-500">Benchmark Contribution</div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[color:var(--bb-border)] text-center">
        <p className="text-[10px] text-zinc-500">
          Adjust the <strong>Benchmark %</strong> to split market beta from true alpha.
        </p>
      </div>
    </div>
  );
}
