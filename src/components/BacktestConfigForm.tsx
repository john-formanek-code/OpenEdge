'use client';

import React, { useState } from 'react';
import { createBacktest } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

type Strategy = { id: string; name: string };

export function BacktestConfigForm({ strategies }: { strategies: Strategy[] }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await createBacktest({
        strategyId: formData.get('strategyId'),
        type: formData.get('type'),
        config: {
          startDate: formData.get('startDate'),
          endDate: formData.get('endDate'),
          initialCapital: 10000
        }
      });
      toast.success('Backtest job dispatched to sim engine');
    } catch {
      toast.error('Failed to queue backtest');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="bb-card space-y-4 border border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center">
          <Play className="w-3 h-3 mr-2 text-amber-500 fill-amber-500" />
          Sim Queue // Dispatch
        </h3>
        <span className="text-[9px] font-mono text-zinc-600">ID: SIM-ENG-04</span>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[8px] text-zinc-600 font-bold uppercase">Target Playbook</label>
          <select name="strategyId" className="w-full bg-black border border-zinc-800 text-[11px] text-zinc-200 p-1.5 outline-none focus:border-amber-500 font-mono uppercase">
            {strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[8px] text-zinc-600 font-bold uppercase">Evaluation Method</label>
          <select name="type" className="w-full bg-black border border-zinc-800 text-[11px] text-zinc-200 p-1.5 outline-none focus:border-amber-500 font-mono uppercase">
            <option value="walk_forward">Walk-Forward Opt</option>
            <option value="monte_carlo">Monte Carlo Sim</option>
            <option value="fixed">Fixed Period BT</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[8px] text-zinc-600 font-bold uppercase">Backtest Start</label>
            <input name="startDate" type="date" className="w-full bg-black border border-zinc-800 text-[10px] text-zinc-200 p-1 outline-none focus:border-amber-500 font-mono" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] text-zinc-600 font-bold uppercase">Backtest End</label>
            <input name="endDate" type="date" className="w-full bg-black border border-zinc-800 text-[10px] text-zinc-200 p-1 outline-none focus:border-amber-500 font-mono" />
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        className="w-full h-8 bg-amber-500/10 border border-amber-500/50 text-amber-500 text-[10px] font-black hover:bg-amber-500/20 transition-colors uppercase disabled:opacity-50"
      >
        {loading ? 'DISPATCHING...' : 'Start Simulation Job'}
      </button>
    </form>
  );
}
