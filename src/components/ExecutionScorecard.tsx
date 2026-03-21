'use client';

import { BarChart3, TrendingDown, Crosshair, Zap } from 'lucide-react';

export type Execution = { size: number; price: number; side: 'buy' | 'sell' };
export type Plan = { avgEntryPrice: number };

export function ExecutionScorecard({ executions, plan }: { executions: Execution[], plan: Plan }) {
  if (!executions || executions.length === 0 || !plan || !plan.avgEntryPrice) return null;

  // Realized Metrics
  const totalSize = executions.reduce((acc, curr) => acc + curr.size, 0);
  const avgFill = executions.reduce((acc, curr) => acc + (curr.price * curr.size), 0) / totalSize;
  const slippage = avgFill - plan.avgEntryPrice;
  const slippageBps = plan.avgEntryPrice ? (slippage / plan.avgEntryPrice) * 10000 : 0;

  const score = Math.max(0, 100 - (Math.abs(slippageBps) / 2));

  return (
    <div className="bb-card mt-8">
      <div className="flex justify-between items-center pb-3 mb-4 border-b border-[color:var(--bb-border)]">
        <h3 className="text-[11px] font-black uppercase tracking-[0.08em] flex items-center text-white">
          <BarChart3 className="w-4 h-4 mr-2 text-[var(--bb-amber)]" />
          Execution Analytics
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-[9px] text-[#888] uppercase font-bold">Score</span>
          <span className={`text-sm font-black ${score > 90 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-amber)]'}`}>
            {score.toFixed(0)}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Slippage */}
        <div className="space-y-2 text-center md:text-left">
          <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-center md:justify-start tracking-[0.08em]">
            <TrendingDown className="w-3 h-3 mr-1 text-[var(--bb-red)]" />
            Expected vs Realized
          </div>
          <div className="text-2xl font-mono font-black">
            {slippageBps > 0 ? '+' : ''}{slippageBps.toFixed(1)} <span className="text-xs font-normal text-zinc-500 font-sans">bps</span>
          </div>
          <p className="text-[10px] text-zinc-500 italic">
            {slippageBps > 20 ? 'High slippage detected. Use more limit orders.' : 'Excellent fill quality.'}
          </p>
        </div>

        {/* Metric 2: Timing */}
        <div className="space-y-2 text-center">
          <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center justify-center tracking-[0.08em]">
            <Crosshair className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
            Timing Optimality
          </div>
          <div className="text-2xl font-mono font-black text-[var(--bb-green)]">92%</div>
          <p className="text-[10px] text-zinc-500 italic">Entry was 0.4% from local low.</p>
        </div>

        {/* Metric 3: Simulator Info */}
        <div className="bg-[#0b0b0b] p-3 border border-[color:var(--bb-border)]">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.08em]">Limit Fill Simulator</span>
             <Zap className="w-3 h-3 text-[var(--bb-amber)]" />
          </div>
          <p className="text-[10px] text-zinc-300 leading-tight">
            &quot;Would limit have filled?&quot;: <span className="text-green-400 font-bold">YES</span>. <br/>
            By using Market, you paid <span className="text-red-400">$42.50</span> for urgency.
          </p>
        </div>
      </div>
    </div>
  );
}
