'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function PostEventPlaybook() {
  const [activeTab, setActiveTab] = useState('5m');

  const steps: Record<string, string[]> = {
    '5m': [
      'Initial Reaction: Avoid chasing the first candle.',
      'Check Spreads: Verify if liquidity has returned to normal.',
      'Mark the High/Low: Establish the immediate range.'
    ],
    '15m': [
      'First Retracement: Look for support/resistance at previous levels.',
      'Volume Profile: Is the move being supported by size?',
      'Check Correlations: Are other assets moving in sync?'
    ],
    '60m': [
      'Trend Confirmation: Is the 1H candle closing strong?',
      'Review Invalidation: Move SL to BE if plan allows.',
      'Final Execution: Scale-in if the setup is A+.'
    ]
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mt-8">
      <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
          Post-Event Playbook
        </h3>
        <div className="flex bg-black p-1 rounded-lg border border-zinc-800">
          {['5m', '15m', '60m'].map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${activeTab === t ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {steps[activeTab].map((step, i) => (
          <div key={i} className="flex items-start space-x-3 group">
            <div className="w-5 h-5 rounded border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-600 group-hover:border-blue-500 transition-colors shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-zinc-300 leading-tight">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
