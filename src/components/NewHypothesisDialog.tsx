'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createHypothesis } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { StrategyGatingCheck } from './StrategyGatingCheck';

export function NewHypothesisDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [strategyId, setStrategyId] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      const data = {
        symbol: formData.get('symbol'),
        assetClass: formData.get('assetClass'),
        exchange: formData.get('exchange'),
        setupType: formData.get('setupType'),
        bias: formData.get('bias'),
        timeframe: formData.get('timeframe'),
        priority: parseInt(formData.get('priority') as string),
        confidence: parseInt(formData.get('confidence') as string),
        triggerCondition: formData.get('triggerCondition'),
        entryPlan: formData.get('entryPlan'),
        invalidationLevel: parseFloat(formData.get('invalidationLevel') as string) || null,
        stopLoss: parseFloat(formData.get('stopLoss') as string) || null,
        targets: formData.get('targets'),
        tags: formData.get('tags'),
        nextReviewAt: formData.get('nextReviewAt') ? new Date(formData.get('nextReviewAt') as string) : null,
        status: 'active',
        // In a real app we'd save strategyId too, but it's not in the hypothesis schema yet.
        // For Module 5.2, the "Gate" happens *before* submission (via the UI check).
      };

      await createHypothesis(data);
      toast.success('Hypothesis created successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to create hypothesis. Check your inputs.');
      console.error(error);
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-zinc-200 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">New Hypothesis</span>
        <span className="text-xs opacity-50 ml-2 border border-black/20 px-1 rounded">N</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">New Hypothesis</h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Symbol</label>
              <input name="symbol" required placeholder="BTC/USDT" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Exchange</label>
              <input name="exchange" placeholder="Binance, Bybit, etc." className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Asset Class</label>
              <select name="assetClass" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
                <option value="crypto">Crypto</option>
                <option value="forex">Forex</option>
                <option value="equities">Equities</option>
              </select>
            </div>
            <div className="space-y-2">
              <StrategyGatingCheck onStrategySelect={setStrategyId} />
              <input type="hidden" name="strategyId" value={strategyId || ''} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Bias</label>
              <select name="bias" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
                <option value="long">Long</option>
                <option value="short">Short</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Timeframe</label>
              <input name="timeframe" placeholder="4H" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Next Review</label>
              <input name="nextReviewAt" type="datetime-local" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Priority (1-5)</label>
              <input name="priority" type="number" min="1" max="5" defaultValue="3" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Confidence (1-5)</label>
              <input name="confidence" type="number" min="1" max="5" defaultValue="3" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Trigger Condition</label>
            <textarea name="triggerCondition" rows={2} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Entry Plan / Notes</label>
            <textarea name="entryPlan" rows={2} placeholder="How will you enter? (Limit, Market, Scale-in)" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Invalidation (Stop)</label>
              <input name="invalidationLevel" type="number" step="any" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-red-400 font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Stop Loss ($)</label>
              <input name="stopLoss" type="number" step="any" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Target ($)</label>
              <input name="targets" type="text" placeholder="e.g. 45000, 48000" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-green-400 font-mono" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Tags</label>
            <input name="tags" placeholder="scalp, news, earnings (comma separated)" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors">Create Hypothesis</button>
          </div>
        </form>
      </div>
    </div>
  );
}