'use client';

import { useState, useMemo, useEffect } from 'react';
import { Trash, Save, Calculator, AlertTriangle, Droplets, RefreshCw } from 'lucide-react';
import { saveTradePlan, getEquitySummary } from '@/lib/actions/hypotheses';
import { useTerminal } from './TerminalContext';
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
  const { focusedTicker } = useTerminal();
  const [accountSize, setAccountSize] = useState(initialPlan?.accountSize || 10000);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [riskValue, setRiskValue] = useState(initialPlan?.riskValue || 1);
  const [riskUnit, setRiskUnit] = useState<'percent' | 'fixed'>(initialPlan?.riskUnit === 'fixed_amount' ? 'fixed' : 'percent');

  // Module 11: Liquidity Inputs
  const [adv, setAdv] = useState(initialPlan?.avgDailyVolume || 1000000); // Average Daily Volume ($)
  const [spread, setSpread] = useState(initialPlan?.bidAskSpread || 0.05); // Spread in %

  const [entries, setEntries] = useState<EntryStep[]>(initialPlan?.entries || [{ price: 0, weight: 100, type: 'limit' }]);
  const [stopPrice, setStopPrice] = useState<number>(initialPlan?.stopLoss?.price || 0);
  const [stopRationale, setStopRationale] = useState(initialPlan?.stopLoss?.rationale || '');
  const [targets, setTargets] = useState<TargetStep[]>(initialPlan?.targets || [{ price: 0, weight: 100 }]);

  // Sync with live data and global ticker
  useEffect(() => {
    async function syncContext() {
      // 1. Get real equity
      const eq = await getEquitySummary();
      if (eq.balance) setAccountSize(eq.balance);

      // 2. Get live price if ticker focused
      const ticker = focusedTicker || initialPlan?.symbol;
      if (ticker) {
        try {
          const res = await fetch(`/api/quotes?symbols=${ticker}`);
          if (res.ok) {
            const data = await res.json();
            const quote = data.quotes?.[0];
            if (quote?.last) {
              setLivePrice(quote.last);
              // Auto-fill entry if empty
              setEntries(prev => prev.map(e => e.price === 0 ? { ...e, price: quote.last } : e));
            }
          }
        } catch (e) { console.error(e); }
      }
    }
    syncContext();
  }, [focusedTicker, initialPlan?.symbol]);

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
    <div className="bb-card overflow-hidden shadow-[0_0_0_1px_#0f0f0f] h-full flex flex-col bg-black">
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-[#050505] shrink-0">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-amber-500" />
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white">
            POSB - Position Builder {focusedTicker ? `[${focusedTicker}]` : ''}
          </h2>
        </div>
        <div className="flex gap-2">
          {livePrice && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-bold text-zinc-400">
              <RefreshCw className="w-2 h-2 animate-spin text-amber-500" />
              LIVE: ${livePrice.toLocaleString()}
            </div>
          )}
          <button onClick={handleSave} className="h-6 px-3 bg-amber-500/10 border border-amber-500/50 text-amber-500 text-[9px] font-bold hover:bg-amber-500/20 transition-colors uppercase">
            Save Plan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 divide-y divide-zinc-800">
          
          {/* Section 1: Risk Parameters */}
          <div className="p-4 space-y-4">
            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center">
              <Droplets className="w-3 h-3 mr-1 text-amber-500" />
              1. Account & Risk
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] text-zinc-600 font-bold uppercase">Equity ($)</label>
                <input type="number" value={accountSize} onChange={e => setAccountSize(parseFloat(e.target.value))} className="w-full bg-[#0a0a0a] border border-zinc-800 text-[11px] text-zinc-200 p-1.5 outline-none focus:border-amber-500/50" />
              </div>
              <div className="flex gap-1">
                <div className="flex-1 space-y-1">
                  <label className="text-[8px] text-red-500 font-bold uppercase">Risk</label>
                  <input type="number" value={riskValue} onChange={e => setRiskValue(parseFloat(e.target.value))} className="w-full bg-[#0a0a0a] border border-zinc-800 text-[11px] text-red-400 p-1.5 outline-none focus:border-red-500/50" />
                </div>
                <div className="w-12 space-y-1">
                   <label className="text-[8px] text-zinc-600 font-bold uppercase">Unit</label>
                   <select value={riskUnit} onChange={e => setRiskUnit(e.target.value as 'percent' | 'fixed')} className="w-full bg-[#0a0a0a] border border-zinc-800 text-[11px] text-zinc-200 h-[31px] px-1 outline-none">
                     <option value="percent">%</option>
                     <option value="fixed">$</option>
                   </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Execution Ladder */}
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">2. Entry Points</h3>
               <button onClick={() => setEntries([...entries, { price: livePrice || 0, weight: 0, type: 'limit' }])} className="text-[8px] font-black text-amber-500 uppercase hover:text-amber-400">+ Add Step</button>
             </div>
             <div className="space-y-2">
               {entries.map((entry, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <select value={entry.type} onChange={e => {const n=[...entries]; n[i].type=e.target.value as EntryStep['type']; setEntries(n)}} className="bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 h-7 px-1 outline-none uppercase font-bold">
                     <option value="limit">LMT</option>
                     <option value="stop">STP</option>
                     <option value="market">MKT</option>
                   </select>
                   <input type="number" placeholder="Price" value={entry.price} onChange={e => {const n=[...entries]; n[i].price=parseFloat(e.target.value); setEntries(n)}} className="flex-1 bg-[#0a0a0a] border border-zinc-800 text-[11px] text-zinc-200 h-7 px-2 outline-none" />
                   <input type="number" placeholder="%" value={entry.weight} onChange={e => {const n=[...entries]; n[i].weight=parseFloat(e.target.value); setEntries(n)}} className="w-12 bg-[#0a0a0a] border border-zinc-800 text-[11px] text-zinc-400 h-7 text-center outline-none" />
                   <button onClick={() => setEntries(entries.filter((_, idx) => idx !== i))} className="text-zinc-700 hover:text-red-500"><Trash size={12} /></button>
                 </div>
               ))}
             </div>
          </div>

          {/* Section 3: Stop & Size */}
          <div className="p-4 space-y-4 bg-[#050505]">
             <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center">
               <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
               3. Exit Guardrails
             </h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[8px] text-zinc-600 font-bold uppercase">Stop Loss Price</label>
                 <input type="number" value={stopPrice} onChange={e => setStopPrice(parseFloat(e.target.value))} className="w-full bg-black border border-red-900/30 text-[14px] font-black text-red-500 p-2 outline-none focus:border-red-500" />
               </div>
               <div className="bg-zinc-950 border border-zinc-900 p-2 flex flex-col justify-center">
                 <div className="text-[8px] text-amber-500 font-black uppercase mb-1">Position Size</div>
                 <div className="text-xl font-black text-white font-mono leading-none">
                   {metrics.totalPositionSize > 0 ? metrics.totalPositionSize.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                 </div>
                 <div className="text-[7px] text-zinc-600 uppercase font-bold mt-1">Total Units</div>
               </div>
             </div>
          </div>

          {/* Section 4: Targets */}
          <div className="p-4 space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">4. Profit Targets</h3>
               <button onClick={() => setTargets([...targets, { price: 0, weight: 0 }])} className="text-[8px] font-black text-green-500 uppercase hover:text-green-400">+ Add TP</button>
             </div>
             <div className="space-y-2">
               {targets.map((target, i) => (
                 <div key={i} className="flex items-center gap-2">
                   <div className="text-[8px] font-black text-zinc-700 w-4">T{i+1}</div>
                   <input type="number" placeholder="Target Price" value={target.price} onChange={e => {const n=[...targets]; n[i].price=parseFloat(e.target.value); setTargets(n)}} className="flex-1 bg-[#0a0a0a] border border-zinc-800 text-[11px] text-green-500 h-7 px-2 outline-none" />
                   <input type="number" placeholder="%" value={target.weight} onChange={e => {const n=[...targets]; n[i].weight=parseFloat(e.target.value); setTargets(n)}} className="w-12 bg-[#0a0a0a] border border-zinc-800 text-[11px] text-zinc-400 h-7 text-center outline-none" />
                   <button onClick={() => setTargets(targets.filter((_, idx) => idx !== i))} className="text-zinc-700 hover:text-red-500"><Trash size={12} /></button>
                 </div>
               ))}
             </div>
             
             <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-4">
                <div className="text-center flex-1">
                  <div className="text-[8px] text-zinc-600 font-bold uppercase">R/R Ratio</div>
                  <div className="text-lg font-black text-green-400">{metrics.maxR.toFixed(2)}R</div>
                </div>
                <div className="w-px h-8 bg-zinc-900 mx-4" />
                <div className="text-center flex-1">
                  <div className="text-[8px] text-zinc-600 font-bold uppercase">Avg Entry</div>
                  <div className="text-lg font-black text-zinc-200">${metrics.avgEntry.toFixed(2)}</div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
