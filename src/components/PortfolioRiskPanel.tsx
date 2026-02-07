'use client';

import { Shield, Layers } from 'lucide-react';

type Cluster = { name: string; exposure: number; rCount?: number };
type StopLevel = { price: number; risk: number; hypothesisId: string };

export function PortfolioRiskPanel({ data }: { data: { clusters: Cluster[]; stops: StopLevel[] } }) {
  const clusters = data?.clusters || [];
  const stops = data?.stops || [];
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Risk Clusters */}
      <div>
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-[color:var(--bb-border)]">
          <h3 className="text-[10px] font-bold text-[#888] uppercase flex items-center tracking-[0.08em]">
            <Shield className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
            Exposure Map
          </h3>
          <span className="bb-chip">Risk</span>
        </div>

        <div className="space-y-1">
          {clusters.length === 0 ? (
            <p className="text-[9px] text-[#444] italic">Nil.</p>
          ) : (
            clusters.map((c: Cluster) => (
              <div key={c.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center w-full">
                  <span className="w-16 font-bold text-zinc-300">{c.name}</span>
                  <div className="flex-1 bg-[#0e0e0e] h-1.5 mx-2 border border-[color:var(--bb-border)]">
                    <div 
                      className="h-full bg-[var(--bb-amber)]" 
                      style={{ width: `${Math.min(100, (c.exposure / 1000) * 100)}%` }} 
                    />
                  </div>
                  <span className="font-mono text-[#b5b5b5]">${c.exposure.toFixed(0)}</span>
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
            Stop Density
          </h3>
        </div>

        {stops.length === 0 ? (
          <p className="text-[9px] text-[#444] italic">No active stops.</p>
        ) : (
          <div className="flex items-end justify-between space-x-[1px] h-8 mt-2">
             {stops.slice(0, 15).map((s: StopLevel, i: number) => (
               <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                 <div 
                   className="w-full bg-[#300] hover:bg-[var(--bb-red)] transition-colors"
                   style={{ height: `${Math.min(100, (s.risk / 500) * 100)}%` }}
                 />
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
