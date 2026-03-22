import React, { useState, useEffect } from 'react';

type IndexData = { symbol: string; name: string; last: number; chg: number; pct: number; ytd: number };
type Region = { name: string; indices: IndexData[] };

export function WorldEquityIndices() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIndices() {
      try {
        const res = await fetch('/api/indices');
        if (res.ok) {
          const data = await res.json();
          if (data.regions) setRegions(data.regions);
        }
      } catch (e) {
        console.error('Failed to fetch indices', e);
      } finally {
        setLoading(false);
      }
    }
    fetchIndices();
    const intervalId = setInterval(fetchIndices, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const getColor = (val: number) => {
    if (val > 1.0) return 'text-[#00ff00] bg-[#00ff00]/10'; // Strong Green
    if (val > 0) return 'text-[var(--bb-green)]';
    if (val < -1.0) return 'text-[#ff0000] bg-[#ff0000]/10'; // Strong Red
    if (val < 0) return 'text-[var(--bb-red)]';
    return 'text-zinc-400';
  };

  if (loading && regions.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Loading Global Markets...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto custom-scrollbar p-2">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase flex justify-between">
        <span>WEI - World Equity Indices</span>
        <span className="text-[9px] text-amber-500/80">LIVE</span>
      </div>
      
      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.name} className="border border-zinc-900 bg-[#050505]">
            <div className="bg-[#111] text-[9px] font-black text-amber-500/80 px-2 py-1 border-b border-zinc-900">
              {region.name}
            </div>
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="text-zinc-600 text-left border-b border-zinc-800/50">
                  <th className="px-2 py-1 font-normal w-[25%]">Ticker</th>
                  <th className="px-2 py-1 font-normal w-[35%]">Name</th>
                  <th className="px-2 py-1 font-normal text-right">Last</th>
                  <th className="px-2 py-1 font-normal text-right">Net Chg</th>
                  <th className="px-2 py-1 font-normal text-right">% Chg</th>
                  <th className="px-2 py-1 font-normal text-right">YTD%</th>
                </tr>
              </thead>
              <tbody>
                {region.indices.map((idx) => (
                  <tr key={idx.symbol} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                    <td className="px-2 py-1.5 font-bold text-amber-400/90">{idx.symbol}</td>
                    <td className="px-2 py-1.5 text-zinc-300 truncate max-w-[120px]">{idx.name}</td>
                    <td className="px-2 py-1.5 text-right text-zinc-100">{idx.last.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`px-2 py-1.5 text-right font-bold ${idx.chg >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                      {idx.chg > 0 ? '+' : ''}{(idx.chg || 0).toFixed(2)}
                    </td>
                    <td className={`px-2 py-1.5 text-right font-bold ${getColor(idx.pct)}`}>
                      {idx.pct > 0 ? '+' : ''}{(idx.pct || 0).toFixed(2)}%
                    </td>
                    <td className={`px-2 py-1.5 text-right ${(idx.ytd || 0) >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                      {(idx.ytd || 0) > 0 ? '+' : ''}{(idx.ytd || 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[9px] text-zinc-600 uppercase">
        * Quotes delayed 15 minutes. Global macro view.
      </div>
    </div>
  );
}
