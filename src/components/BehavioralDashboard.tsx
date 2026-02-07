'use client';

import { Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';

type Violation = { type: string; createdAt?: Date | string | null };
type BehavioralStats = {
  latency?: string;
  drift?: string;
  breakRate?: string;
  violations?: Violation[];
};

export function BehavioralDashboard({ stats }: { stats: BehavioralStats }) {
  const behaviorKPIs = [
    { name: 'LATENCY', value: stats.latency || '0m', color: 'text-[var(--bb-green)]', icon: Zap },
    { name: 'DRIFT', value: stats.drift || '0.0', color: 'text-[var(--bb-amber)]', icon: TrendingUp },
    { name: 'BREAKS', value: stats.breakRate || '0%', color: 'text-[#55c8ff]', icon: AlertCircle },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[color:var(--bb-border)]">
        <h3 className="text-[10px] font-black text-[#888] uppercase flex items-center tracking-[0.08em]">
          <Brain className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
          Behavioral Quant
        </h3>
        <span className="bb-chip">Discipline</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {behaviorKPIs.map((kpi) => (
          <div key={kpi.name} className="bb-kpi">
            <div className={`value ${kpi.color}`}>{kpi.value}</div>
            <div className="label">{kpi.name}</div>
          </div>
        ))}
      </div>
      
      <div className="flex-1 space-y-3">
        <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Recent Violations</h4>
        {(!stats.violations || stats.violations.length === 0) ? (
          <p className="text-[9px] text-[#333] italic">No rule violations logged yet.</p>
        ) : (
          stats.violations.map((v, i) => {
            const ts = v.createdAt ? new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';
            return (
              <div key={i} className="flex justify-between items-center text-[10px] border-l border-red-900 pl-2">
                <span className="text-red-500 font-bold uppercase">{v.type}</span>
                <span className="text-zinc-600 text-[9px]">{ts}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[color:var(--bb-border)]">
         <div className="bg-[#0b0b0b] p-2 border border-[color:var(--bb-border)] flex items-center justify-between">
           <span className="text-[9px] text-zinc-500 font-bold">Latency Score:</span>
           <span className="text-[10px] font-mono text-[var(--bb-green)] font-black">9.2 / 10</span>
         </div>
      </div>
    </div>
  );
}
