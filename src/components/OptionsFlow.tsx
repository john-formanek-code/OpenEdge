import React, { useState, useEffect } from 'react';
import { useTerminal } from './TerminalContext';

type FlowPrint = {
  id: string;
  time: string;
  symbol: string;
  type: string;
  contract: string;
  premium: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
};

export function OptionsFlow() {
  const { focusedTicker, setFocusedTicker } = useTerminal();
  const [flows, setFlows] = useState<FlowPrint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlows() {
      try {
        const res = await fetch('/api/options-flow');
        if (res.ok) {
          const data = await res.json();
          if (data.flows) {
            // Append new flows to the top, keep max 50
            setFlows(prev => {
              const merged = [...data.flows, ...prev];
              // De-duplicate by id
              const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
              return unique.slice(0, 50).sort((a, b) => b.id.localeCompare(a.id));
            });
          }
        }
      } catch (e) {
        console.error('Failed to fetch options flow', e);
      } finally {
        setLoading(false);
      }
    }
    fetchFlows();
    const intervalId = setInterval(fetchFlows, 10000); // Poll every 10s for new "prints"
    return () => clearInterval(intervalId);
  }, []);

  const displayFlows = focusedTicker 
    ? flows.filter(f => f.symbol === focusedTicker)
    : flows;

  if (loading && flows.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-amber-500 font-mono text-xs uppercase animate-pulse">Connecting to Dark Pools...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden font-mono">
      <div className="text-[10px] text-zinc-500 font-bold p-2 border-b border-zinc-800 uppercase bg-[#050505] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span>OFLOW - Options & Dark Pool</span>
          {focusedTicker && (
            <span className="bg-zinc-800 px-1 text-white border border-zinc-600">
              FILTER: {focusedTicker}
            </span>
          )}
        </div>
        <div className="flex gap-2 text-[9px]">
          <span className="bg-amber-500/20 text-amber-500 px-1 border border-amber-500/50 animate-pulse">LIVE TAPE</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-[#020202]">
        <table className="w-full text-[10px] text-left border-collapse">
          <thead className="sticky top-0 bg-[#0a0a0a] border-b border-zinc-800 z-10">
            <tr className="text-zinc-500">
              <th className="py-1.5 px-2 font-normal">TIME</th>
              <th className="py-1.5 px-2 font-normal">TICKER</th>
              <th className="py-1.5 px-2 font-normal">TYPE</th>
              <th className="py-1.5 px-2 font-normal">DETAILS</th>
              <th className="py-1.5 px-2 font-normal text-right">PREM</th>
            </tr>
          </thead>
          <tbody>
            {displayFlows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-zinc-600 text-[9px] uppercase">No prints for current filter.</td>
              </tr>
            ) : (
              displayFlows.map((flow) => {
                const isBull = flow.sentiment === 'BULLISH';
                const isBear = flow.sentiment === 'BEARISH';
                return (
                  <tr 
                    key={flow.id} 
                    onClick={() => setFocusedTicker(flow.symbol)}
                    className="border-b border-zinc-900/50 hover:bg-zinc-900/80 cursor-pointer transition-colors"
                  >
                    <td className="py-1.5 px-2 text-zinc-500">{flow.time}</td>
                    <td className="py-1.5 px-2 font-black text-white hover:text-amber-500 transition-colors">
                      {flow.symbol}
                    </td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1 py-0.5 border text-[8px] font-bold ${
                        flow.type === 'SWEEP' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' :
                        flow.type === 'BLOCK' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' :
                        'bg-zinc-800 border-zinc-600 text-zinc-400'
                      }`}>
                        {flow.type}
                      </span>
                    </td>
                    <td className={`py-1.5 px-2 font-bold ${isBull ? 'text-[var(--bb-green)]' : isBear ? 'text-[var(--bb-red)]' : 'text-zinc-400'}`}>
                      {flow.contract}
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold text-amber-500">
                      {flow.premium}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
