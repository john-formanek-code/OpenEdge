'use client';

import { useState, useEffect } from 'react';
import { checkStrategyGating, getStrategies } from '@/lib/actions/hypotheses';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

type Strategy = { id: string; name: string; allowedRegimes: string[] };
type GatingResult = { allowed: boolean; currentRegime?: string; allowedRegimes?: string[]; strategyName?: string };

export function StrategyGatingCheck({ onStrategySelect }: { onStrategySelect: (id: string) => void }) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [checkResult, setCheckResult] = useState<GatingResult | null>(null);

  useEffect(() => {
    getStrategies().then(res => setStrategies(res as Strategy[]));
  }, []);

  async function handleSelect(id: string) {
    setSelectedId(id);
    onStrategySelect(id);
    if (!id) {
      setCheckResult(null);
      return;
    }
    const result = await checkStrategyGating(id);
    setCheckResult(result as GatingResult);
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase flex items-center">
        <Shield className="w-3 h-3 mr-1" />
        Strategy Gating
      </label>
      <select 
        className="w-full bg-black border border-zinc-800 rounded-none p-2 focus:outline-none focus:border-amber-500 transition-colors text-[11px] font-mono"
        onChange={(e) => handleSelect(e.target.value)}
        value={selectedId}
      >
        <option value="">-- MANUAL DISCRETION (NO STRATEGY) --</option>
        {strategies.map(s => (
          <option key={s.id} value={s.id}>{s.name.toUpperCase()} ([{(Array.isArray(s.allowedRegimes) ? s.allowedRegimes : []).join(', ').toUpperCase()}])</option>
        ))}
      </select>

      {checkResult && (
        <div className={`text-[10px] p-3 rounded-none border flex items-start space-x-2 font-mono ${
          checkResult.allowed 
            ? 'bg-green-900/10 border-green-900/30 text-green-400' 
            : 'bg-red-900/10 border-red-900/30 text-red-400'
        }`}>
          {checkResult.allowed ? (
            <CheckCircle className="w-3 h-3 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-black uppercase mb-1">
              {checkResult.allowed ? 'Strategy Allowed' : 'Strategy Blocked'}
            </p>
                <p className="opacity-80 uppercase leading-tight">
                  Regime: <strong>{checkResult.currentRegime}</strong>. 
                  Target: [{(checkResult.allowedRegimes as string[]).join(', ')}].
                </p>
            {!checkResult.allowed && (
              <div className="mt-2 text-[9px] font-black border border-red-800 inline-block px-2 py-0.5 bg-red-950/50 uppercase">
                ⚠️ Override Required
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
