'use client';

import { Shield, Layers } from 'lucide-react';

type Cluster = { name: string; exposure: number; rCount?: number };
type StopLevel = { price: number; risk: number; hypothesisId: string };

export function PortfolioRiskPanel({ data }: { data: { clusters: Cluster[]; stops: StopLevel[] } }) {
  const clusters = data?.clusters || [];
  const stops = data?.stops || [];

  const maxExposure = Math.max(...clusters.map(c => c.exposure), 1000);
  const maxStopRisk = Math.max(...stops.map(s => s.risk), 100);
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Risk Clusters */}
      <div>
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-[color:var(--bb-border)]">
          <h3 className="text-[10px] font-bold text-[#888] uppercase flex items-center tracking-[0.08em]">
            <Shield className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
            Gross Exposure Map
          </h3>
          <span className="bb-chip">Risk</span>
        </div>

        <div className="space-y-1">
          {clusters.length === 0 ? (
            <p className="text-[9px] text-[#444] italic uppercase">Nil.</p>
          ) : (
            clusters.map((c: Cluster) => (
              <div key={c.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center w-full">
                  <span className="w-16 font-black text-zinc-300 uppercase">{c.name}</span>
                  <div className="flex-1 bg-[#0e0e0e] h-1.5 mx-2 border border-[color:var(--bb-border)]">
                    <div 
                      className="h-full bg-[var(--bb-amber)] transition-all duration-500" 
                      style={{ width: `${(c.exposure / maxExposure) * 100}%` }} 
                    />
                  </div>
                  <span className="font-mono text-[#b5b5b5]">${c.exposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stop Liquidation Map */}
      <div>
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-[color:var(--bb-border)]">
          <h3 className="text-[10px] font-bold text-[#888] uppercase flex items-center tracking-[0.08em]">
            <Layers className="w-3 h-3 mr-1 text-[var(--bb-red)]" />
            Stop Loss Density
          </h3>
        </div>

        {stops.length === 0 ? (
          <p className="text-[9px] text-[#444] italic uppercase">No active stops.</p>
        ) : (
          <div className="flex items-end justify-between space-x-[1px] h-8 mt-2 bg-red-950/5 p-[1px]">
             {stops.slice(0, 30).map((s: StopLevel, i: number) => (
               <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                 <div 
                   className="w-full bg-[#400] hover:bg-[var(--bb-red)] transition-all duration-300"
                   style={{ height: `${(s.risk / maxStopRisk) * 100}%` }}
                 />
                 <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-red-900 text-[8px] text-white px-1 pointer-events-none z-50 whitespace-nowrap">
                    ${s.risk.toFixed(0)} @ {s.price}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
