'use client';

import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { updateHypothesis } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';

type HypothesisForm = {
  id: string;
  symbol: string;
  assetClass: string;
  exchange?: string | null;
  setupType: string;
  bias: string;
  timeframe: string;
  priority?: number | null;
  confidence?: number | null;
  status?: string | null;
  triggerCondition?: string | null;
  entryPlan?: string | null;
  invalidationLevel?: number | null;
  stopLoss?: number | null;
  targets?: string | null;
  tags?: string | null;
  nextReviewAt?: Date | null;
};

export function EditHypothesisDialog({ hypothesis }: { hypothesis: HypothesisForm }) {
  const [isOpen, setIsOpen] = useState(false);

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
        status: formData.get('status'),
      };

      await updateHypothesis(hypothesis.id, data);
      toast.success('Hypothesis updated successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to update hypothesis.');
      console.error(error);
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
      >
        <Pencil className="w-5 h-5 text-zinc-400 hover:text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Hypothesis</h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Symbol</label>
              <input name="symbol" defaultValue={hypothesis.symbol} required className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
              <select name="status" defaultValue={hypothesis.status || undefined} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
                <option value="active">Active</option>
                <option value="parking">Parking Lot</option>
                <option value="paused">Paused</option>
                <option value="archive">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Asset Class</label>
              <select name="assetClass" defaultValue={hypothesis.assetClass} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
                <option value="crypto">Crypto</option>
                <option value="forex">Forex</option>
                <option value="equities">Equities</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Exchange</label>
              <input name="exchange" defaultValue={hypothesis.exchange || undefined} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Bias</label>
              <select name="bias" defaultValue={hypothesis.bias} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
                <option value="long">Long</option>
                <option value="short">Short</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Timeframe</label>
              <input name="timeframe" defaultValue={hypothesis.timeframe} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Next Review</label>
              <input name="nextReviewAt" type="datetime-local" defaultValue={hypothesis.nextReviewAt ? new Date(hypothesis.nextReviewAt).toISOString().slice(0, 16) : ''} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-sm" />
            </div>
          </div>
          
           <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Setup Type</label>
              <input name="setupType" defaultValue={hypothesis.setupType} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Priority (1-5)</label>
              <input name="priority" type="number" min="1" max="5" defaultValue={hypothesis.priority || undefined} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Confidence (1-5)</label>
              <input name="confidence" type="number" min="1" max="5" defaultValue={hypothesis.confidence || undefined} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Trigger Condition</label>
            <textarea name="triggerCondition" defaultValue={hypothesis.triggerCondition || undefined} rows={2} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Entry Plan / Notes</label>
            <textarea name="entryPlan" defaultValue={hypothesis.entryPlan || undefined} rows={2} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Invalidation (Stop)</label>
              <input name="invalidationLevel" defaultValue={hypothesis.invalidationLevel || undefined} type="number" step="any" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-red-400 font-mono" />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Stop Loss ($)</label>
              <input name="stopLoss" defaultValue={hypothesis.stopLoss || undefined} type="number" step="any" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Target ($)</label>
              <input name="targets" defaultValue={hypothesis.targets || undefined} type="text" className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors text-green-400 font-mono" />
            </div>
          </div>
          
           <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Tags</label>
            <input name="tags" defaultValue={hypothesis.tags || undefined} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
