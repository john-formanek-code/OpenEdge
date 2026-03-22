import React, { useState, useEffect } from 'react';

type HeatmapItem = {
  symbol: string;
  name: string;
  pct: number;
  sector: string;
};

export function MarketHeatmap() {
  const [data, setData] = useState<HeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeatmapData() {
      try {
        // We reuse the movers logic but for a larger set of stocks
        const res = await fetch('/api/market-movers');
        if (res.ok) {
          const json = await res.json();
          // Mix gainers and losers to simulate a broader map
          const combined = [...json.gainers, ...json.losers].map(item => ({
            symbol: item.symbol,
            name: item.symbol, // simplified
            pct: item.pct,
            sector: 'Core'
          }));
          setData(combined.sort((a, b) => b.pct - a.pct));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHeatmapData();
  }, []);

  const getBgColor = (pct: number) => {
    if (pct > 3) return 'bg-[#004d00] border-[#00ff00]';
    if (pct > 1) return 'bg-[#006400] border-[#00cc00]';
    if (pct > 0) return 'bg-[#003300] border-[#008000]';
    if (pct < -3) return 'bg-[#4d0000] border-[#ff0000]';
    if (pct < -1) return 'bg-[#640000] border-[#cc0000]';
    if (pct < 0) return 'bg-[#330000] border-[#800000]';
    return 'bg-zinc-900 border-zinc-700';
  };

  if (loading && data.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Generating Market Heatmap...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black p-2 font-mono overflow-hidden">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase flex justify-between">
        <span>HEAT - Market Map</span>
        <span className="text-amber-500/80">S&P LEADERS</span>
      </div>

      <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1 auto-rows-fr overflow-y-auto no-scrollbar">
        {data.map((item) => (
          <div 
            key={item.symbol}
            className={`flex flex-col items-center justify-center border p-2 transition-transform hover:scale-[1.02] hover:z-10 cursor-default ${getBgColor(item.pct)}`}
          >
            <span className="text-[11px] font-black text-white">{item.symbol}</span>
            <span className="text-[9px] font-bold text-white/80">
              {item.pct > 0 ? '+' : ''}{item.pct.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2 text-[8px] text-zinc-600 uppercase">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-600" /> POSITIVE SENTIMENT
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-600" /> NEGATIVE SENTIMENT
        </div>
      </div>
    </div>
  );
}
