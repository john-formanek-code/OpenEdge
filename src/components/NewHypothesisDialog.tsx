'use client';

import React, { useState } from 'react';
import { Plus, X, Target, Zap } from 'lucide-react';
import { createHypothesis } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';

export function NewHypothesisDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormatData] = useState({
    symbol: '',
    bias: 'neutral',
    timeframe: '1D',
    priority: 3,
    triggerCondition: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createHypothesis({
        ...formData,
        status: 'active',
        state: 'idea',
        assetClass: formData.symbol.includes('-') ? 'crypto' : 'equity',
      });
      toast.success(`Hypothesis for ${formData.symbol} created.`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('Failed to create hypothesis.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="h-7 px-3 bg-amber-500 text-black text-[10px] font-black hover:bg-amber-400 transition-colors uppercase flex items-center gap-1"
      >
        <Plus size={12} /> New Hypothesis
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-zinc-800 w-full max-w-md shadow-2xl overflow-hidden font-mono">
        <div className="bg-[#111] border-b border-zinc-800 px-4 py-2 flex justify-between items-center">
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <Target size={14} /> Create_New_Hypothesis
          </span>
          <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Instrument</label>
              <input 
                required
                value={formData.symbol}
                onChange={e => setFormatData({...formData, symbol: e.target.value.toUpperCase()})}
                placeholder="AAPL / BTC-USD"
                className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Bias</label>
              <select 
                value={formData.bias}
                onChange={e => setFormatData({...formData, bias: e.target.value as any})}
                className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none focus:border-amber-500/50"
              >
                <option value="long">LONG</option>
                <option value="short">SHORT</option>
                <option value="neutral">NEUTRAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Timeframe</label>
              <select 
                value={formData.timeframe}
                onChange={e => setFormatData({...formData, timeframe: e.target.value})}
                className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none focus:border-amber-500/50"
              >
                <option value="5M">5M</option>
                <option value="1H">1H</option>
                <option value="4H">4H</option>
                <option value="1D">1D</option>
                <option value="1W">1W</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Priority (1-5)</label>
              <input 
                type="number" min="1" max="5"
                value={formData.priority}
                onChange={e => setFormatData({...formData, priority: parseInt(e.target.value)})}
                className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Trigger Condition</label>
            <textarea 
              required
              rows={3}
              value={formData.triggerCondition}
              onChange={e => setFormatData({...formData, triggerCondition: e.target.value})}
              placeholder="e.g. Breakout above 185.50 with volume..."
              className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-black py-3 text-xs uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Processing...' : <><Zap size={14} /> Commit Hypothesis</>}
          </button>
        </form>
      </div>
    </div>
  );
}
