'use client';

import { useState, useMemo } from 'react';
import { Trash, Save, Calculator, AlertTriangle, Droplets } from 'lucide-react';
import { saveTradePlan } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';

export type EntryStep = { price: number; weight: number; type: 'limit' | 'stop' | 'market' };
export type TargetStep = { price: number; weight: number };
export type TradePlan = {
  accountSize: number;
  riskValue: number;
  riskUnit: 'percent' | 'fixed_amount';
  avgDailyVolume: number;
  bidAskSpread: number;
  entries: EntryStep[];
  stopLoss?: { price: number; rationale?: string; type?: string };
  targets: TargetStep[];
  totalRiskAmount?: number;
  avgEntryPrice?: number;
  totalPositionSize?: number;
  symbol?: string;
};

export function PositionBuilder({ hypothesisId, initialPlan, currentExposure = 0 }: { hypothesisId: string, initialPlan?: Partial<TradePlan>, currentExposure?: number }) {
  const [accountSize, setAccountSize] = useState(initialPlan?.accountSize || 10000);
  const [riskValue, setRiskValue] = useState(initialPlan?.riskValue || 1);
  const [riskUnit, setRiskUnit] = useState<'percent' | 'fixed'>(initialPlan?.riskUnit === 'fixed_amount' ? 'fixed' : 'percent');

  // Module 11: Liquidity Inputs
  const [adv, setAdv] = useState(initialPlan?.avgDailyVolume || 1000000); // Average Daily Volume ($)
  const [spread, setSpread] = useState(initialPlan?.bidAskSpread || 0.05); // Spread in %

  const [entries, setEntries] = useState<EntryStep[]>(initialPlan?.entries || [{ price: 0, weight: 100, type: 'limit' }]);
  const [stopPrice, setStopPrice] = useState<number>(initialPlan?.stopLoss?.price || 0);
  const [stopRationale, setStopRationale] = useState(initialPlan?.stopLoss?.rationale || '');
  const [targets, setTargets] = useState<TargetStep[]>(initialPlan?.targets || [{ price: 0, weight: 100 }]);

  const metrics = useMemo(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    entries.forEach(e => {
      weightedSum += (e.price * e.weight);
      totalWeight += e.weight;
    });
    const avgEntry = totalWeight > 0 ? weightedSum / totalWeight : 0;

    const riskAmount = riskUnit === 'percent' ? (accountSize * (riskValue / 100)) : riskValue;
    const distToStop = Math.abs(avgEntry - stopPrice);
    const size = (distToStop > 0 && stopPrice > 0 && avgEntry > 0) ? (riskAmount / distToStop) : 0;

    const lastTarget = targets[targets.length - 1]?.price || 0;
    const distToTarget = Math.abs(lastTarget - avgEntry);
    const maxR = (distToStop > 0 && lastTarget > 0) ? (distToTarget / distToStop) : 0;

    // Module 11.1: Market Impact Estimation (Square Root Model)
    // bps = spread_bps/2 + (order_value / daily_vol) ^ 0.5 * vol_coeff
    const orderValue = size * avgEntry;
    const volCoeff = 50; // Standard assumption for crypto/mid-caps
    const impactBps = (spread * 50) + Math.sqrt(orderValue / adv) * volCoeff;

    return {
      avgEntry,
      totalPositionSize: size,
      riskAmount,
      maxR,
      marketImpactBps: isNaN(impactBps) ? 0 : impactBps
    };
  }, [entries, stopPrice, targets, accountSize, riskValue, riskUnit, adv, spread]);

  const isOverExposed = (currentExposure + metrics.riskAmount) > (accountSize * 0.05);
  const tooLargeForMarket = (metrics.totalPositionSize * metrics.avgEntry) > (adv * 0.01); // Warn if > 1% of daily volume

  async function handleSave() {
    try {
      const plan = {
        accountSize, riskValue, riskUnit: riskUnit === 'fixed' ? 'fixed_amount' : 'percent',
        entries, stopLoss: { price: stopPrice, rationale: stopRationale, type: 'hard' },
        targets, avgEntryPrice: metrics.avgEntry, totalPositionSize: metrics.totalPositionSize,
        totalRiskAmount: metrics.riskAmount, maxR: metrics.maxR,
        avgDailyVolume: adv, bidAskSpread: spread
      };
      await saveTradePlan(hypothesisId, plan);
      toast.success('Position plan saved');
    } catch { toast.error('Failed to save plan'); }
  }

  return (
    <div className="bb-card overflow-hidden shadow-[0_0_0_1px_#0f0f0f]">
      <div className="p-4 border-b border-[color:var(--bb-border)] flex justify-between items-center bg-[#0b0b0b]">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-[var(--bb-amber)]" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.08em] text-white">Position Builder 2.0</h2>
        </div>
        <button onClick={handleSave} className="bb-button h-8 px-4">
          <Save className="w-4 h-4" />
          <span>Save Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[color:var(--bb-border)]">
        
        {/* COL 1: Risk & Liquidity */}
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest flex items-center">
              <Droplets className="w-3 h-3 mr-1 text-[var(--bb-amber)]" />
              1. Risk & Liquidity
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="bb-label">Daily Volume ($)</label>
                <input type="number" value={adv} onChange={e => setAdv(parseFloat(e.target.value))} className="bb-input w-full" />
              </div>
              <div>
                <label className="bb-label">Spread (%)</label>
                <input type="number" step="0.01" value={spread} onChange={e => setSpread(parseFloat(e.target.value))} className="bb-input w-full" />
              </div>
            </div>
            
            <div className="bg-[#0c0c0c] border border-[color:var(--bb-border)] p-3 mb-6">
               <div className="flex justify-between items-center text-[10px] uppercase font-bold text-blue-400 mb-1">
                 <span>Est. Market Impact</span>
                 <span>{metrics.marketImpactBps.toFixed(1)} bps</span>
               </div>
               <div className="w-full bg-[var(--bb-border)] h-1 rounded-full overflow-hidden">
                 <div className="h-full bg-[var(--bb-amber)]" style={{ width: `${Math.min(100, metrics.marketImpactBps)}%` }} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="bb-label">Account</label>
                <input type="number" value={accountSize} onChange={e => setAccountSize(parseFloat(e.target.value))} className="bb-input w-full" />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="bb-label text-[var(--bb-red)]">Risk</label>
                  <input type="number" value={riskValue} onChange={e => setRiskValue(parseFloat(e.target.value))} className="bb-input w-full text-[var(--bb-red)]" />
                </div>
                <div>
                   <label className="bb-label">Unit</label>
                   <select value={riskUnit} onChange={e => setRiskUnit(e.target.value as 'percent' | 'fixed')} className="bb-select h-[38px]">
                     <option value="percent">%</option>
                     <option value="fixed">$</option>
                   </select>
                </div>
              </div>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">2. Entry Ladder</h3>
               <button onClick={() => setEntries([...entries, { price: 0, weight: 0, type: 'limit' }])} className="bb-button ghost px-2 py-1 text-[10px]">+ Step</button>
             </div>
             <div className="space-y-2">
               {entries.map((entry, i) => (
                 <div key={i} className="flex items-center space-x-2">
                   <select value={entry.type} onChange={e => {const n=[...entries]; n[i].type=e.target.value as EntryStep['type']; setEntries(n)}} className="bb-select w-20 text-[10px] font-bold uppercase">
                     <option value="limit">Limit</option>
                     <option value="stop">Stop</option>
                     <option value="market">Mkt</option>
                   </select>
                   <input type="number" placeholder="Price" value={entry.price} onChange={e => {const n=[...entries]; n[i].price=parseFloat(e.target.value); setEntries(n)}} className="bb-input flex-1" />
                   <input type="number" placeholder="%" value={entry.weight} onChange={e => {const n=[...entries]; n[i].weight=parseFloat(e.target.value); setEntries(n)}} className="bb-input w-16 text-center" />
                   <button onClick={() => setEntries(entries.filter((_, idx) => idx !== i))} className="p-1.5 hover:bg-red-900/50 rounded text-zinc-600 hover:text-red-400"><Trash className="w-3 h-3" /></button>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* COL 2: Stop & Guardrails */}
        <div className="p-6 space-y-8 bg-[#050505]">
           <div>
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest flex items-center">
               <AlertTriangle className="w-3 h-3 mr-1 text-[var(--bb-red)]" />
               3. Guardrails
             </h3>
             <div className="space-y-4">
               <div>
                 <label className="bb-label">Stop Price (Hard)</label>
                 <input type="number" value={stopPrice} onChange={e => setStopPrice(parseFloat(e.target.value))} className="bb-input w-full text-lg font-black text-[var(--bb-red)]" />
               </div>
               <div>
                 <label className="bb-label">Rationale</label>
                 <textarea rows={2} value={stopRationale} onChange={e => setStopRationale(e.target.value)} placeholder="Structural logic..." className="bb-textarea w-full text-xs text-zinc-400" />
               </div>
             </div>
           </div>
           
           <div className="bg-[#0c0c0c] border border-[color:var(--bb-border)] p-6 text-center">
             <h4 className="text-[10px] text-[var(--bb-amber)] font-black uppercase mb-2 tracking-widest">Calculated Position Size</h4>
             <div className="text-4xl font-mono font-black text-white mb-1">
               {metrics.totalPositionSize > 0 ? metrics.totalPositionSize.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
             </div>
             <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Units of {initialPlan?.symbol || 'Asset'}</div>
             
             {(isOverExposed || tooLargeForMarket) && (
               <div className="mt-6 p-3 bg-red-900/20 border border-red-900/50 text-[10px] text-red-400 font-bold flex flex-col space-y-2 text-left animate-pulse">
                 {isOverExposed && (
                   <div className="flex items-start">
                     <AlertTriangle className="w-3 h-3 mr-2 shrink-0 mt-0.5" />
                     <span>PORTFOLIO CLUSTER LIMIT EXCEEDED</span>
                   </div>
                 )}
                 {tooLargeForMarket && (
                   <div className="flex items-start text-orange-400">
                     <Droplets className="w-3 h-3 mr-2 shrink-0 mt-0.5" />
                     <span>ORDER &gt; 1% OF DAILY LIQUIDITY</span>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>

        {/* COL 3: Targets */}
        <div className="p-6 space-y-8">
           <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">4. Exit Ladder</h3>
               <button onClick={() => setTargets([...targets, { price: 0, weight: 0 }])} className="bb-button ghost px-2 py-1 text-[10px]">+ TP</button>
             </div>
             <div className="space-y-2">
               {targets.map((target, i) => (
                 <div key={i} className="flex items-center space-x-2">
                   <div className="w-6 text-[10px] font-black text-zinc-600">R{i+1}</div>
                   <input type="number" placeholder="Price" value={target.price} onChange={e => {const n=[...targets]; n[i].price=parseFloat(e.target.value); setTargets(n)}} className="bb-input flex-1 text-[var(--bb-green)]" />
                   <input type="number" placeholder="%" value={target.weight} onChange={e => {const n=[...targets]; n[i].weight=parseFloat(e.target.value); setTargets(n)}} className="bb-input w-12 text-center" />
                   <button onClick={() => setTargets(targets.filter((_, idx) => idx !== i))} className="p-1.5 hover:bg-red-900/50 text-zinc-600 hover:text-red-400"><Trash className="w-3 h-3" /></button>
                 </div>
               ))}
             </div>
             <div className="mt-12 pt-6 border-t border-[color:var(--bb-border)]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Max Risk Reward</span>
                  <span className="text-2xl font-mono font-black text-green-400">{metrics.maxR.toFixed(2)}R</span>
                </div>
                <div className="mt-4 p-3 bg-[#0c0c0c] border border-[color:var(--bb-border)] flex justify-between items-center">
                   <span className="text-[10px] text-zinc-500 font-bold uppercase">Avg Entry</span>
                   <span className="text-sm font-mono font-bold text-white">${metrics.avgEntry.toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
