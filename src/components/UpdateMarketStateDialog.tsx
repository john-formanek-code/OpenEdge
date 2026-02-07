'use client';

import { useMemo, useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { updateMarketState } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { classifyRegime } from '@/lib/quant';

export function UpdateMarketStateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Quant Inputs
  const [adx, setAdx] = useState(20);
  const [vix, setVix] = useState(15);
  const [slope, setSlope] = useState<'up' | 'down' | 'flat'>('flat');
  const suggestedRegime = useMemo(() => classifyRegime({ adx, vix, ma200Slope: slope }), [adx, vix, slope]);

  async function handleSubmit(formData: FormData) {
    try {
      const data = {
        regime: formData.get('regime') as string,
        vixProxy: parseFloat(formData.get('vixProxy') as string) || null,
        biasSummary: formData.get('biasSummary') as string,
        // We could store the raw factors too in a JSON field if we updated the schema,
        // but for now we map them to the Regime text.
      };

      await updateMarketState(data);
      toast.success('Market state updated');
      setIsOpen(false);
  } catch {
    toast.error('Failed to update market state');
  }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        Update State
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Market State</h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-6">
          
          {/* Quant Calculator Section */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center text-xs text-blue-400 font-bold uppercase mb-2">
              <Calculator className="w-3 h-3 mr-1" />
              Regime Classifier
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">ADX (14)</label>
                <input type="number" value={adx} onChange={e => setAdx(parseFloat(e.target.value))} className="w-full bg-black border border-zinc-800 rounded p-1.5 text-xs text-center" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">VIX / Vol</label>
                <input type="number" value={vix} onChange={e => setVix(parseFloat(e.target.value))} className="w-full bg-black border border-zinc-800 rounded p-1.5 text-xs text-center" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">MA200</label>
                <select value={slope} onChange={e => setSlope(e.target.value as 'up' | 'down' | 'flat')} className="w-full bg-black border border-zinc-800 rounded p-1.5 text-xs">
                  <option value="up">Up</option>
                  <option value="flat">Flat</option>
                  <option value="down">Down</option>
                </select>
              </div>
            </div>
            
            <div className="text-center pt-2">
              <span className="text-[10px] text-zinc-500">Suggested Regime: </span>
              <span className="text-xs font-bold text-white uppercase">{suggestedRegime}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Selected Regime</label>
            <select name="regime" defaultValue={suggestedRegime} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors">
              <option value="risk-on">Risk On / Strong Trend</option>
              <option value="risk-off">Risk Off / High Vol</option>
              <option value="neutral">Neutral / Range</option>
              <option value="strong-trend-up">Strong Trend Up</option>
              <option value="strong-trend-down">Strong Trend Down</option>
              <option value="volatile">Volatile</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">VIX Proxy</label>
            <input name="vixProxy" type="number" step="0.01" value={vix} onChange={e => setVix(parseFloat(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Bias Summary</label>
            <textarea name="biasSummary" rows={3} placeholder="Current market narrative..." className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:border-white transition-colors" />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-white text-black px-8 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors">Save State</button>
          </div>
        </form>
      </div>
    </div>
  );
}
