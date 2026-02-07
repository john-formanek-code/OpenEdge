'use client';

import { createBacktest } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

type Strategy = { id: string; name: string };

export function BacktestConfigForm({ strategies }: { strategies: Strategy[] }) {
  async function handleSubmit(formData: FormData) {
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
      toast.success('Backtest queued');
    } catch {
      toast.error('Failed to queue backtest');
    }
  }

  return (
    <form action={handleSubmit} className="bb-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-white uppercase tracking-widest">
          Sim Queue // Backtest
        </h3>
        <span className="bb-chip">LAB</span>
      </div>
      
      <div className="space-y-2">
        <label className="bb-label">Strategy</label>
        <select name="strategyId" className="bb-select w-full">
          {strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="bb-label">Method</label>
        <select name="type" className="bb-select w-full">
          <option value="walk_forward">Walk-Forward Optimization</option>
          <option value="monte_carlo">Monte Carlo Simulation</option>
          <option value="fixed">Fixed Period</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="bb-label">Start Date</label>
          <input name="startDate" type="date" className="bb-input w-full" />
        </div>
        <div>
          <label className="bb-label">End Date</label>
          <input name="endDate" type="date" className="bb-input w-full" />
        </div>
      </div>

      <button className="bb-button w-full h-9">
        <Play className="w-4 h-4 mr-2" /> Start Job
      </button>
    </form>
  );
}
