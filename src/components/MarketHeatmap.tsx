import React, { useState, useEffect } from 'react';

type HeatmapItem = {
  symbol: string;
  name: string;
  pct: number;
  sector: string;
};

const SECTOR_MAP: Record<string, string> = {
  AAPL: 'TECH', MSFT: 'TECH', NVDA: 'TECH', AVGO: 'TECH', ADBE: 'TECH', CRM: 'TECH', AMD: 'TECH', 
  CSCO: 'TECH', INTC: 'TECH', QCOM: 'TECH', TXN: 'TECH', AMAT: 'TECH', IBM: 'TECH', ISRG: 'TECH',
  AMZN: 'DISC', TSLA: 'DISC', HD: 'DISC', NFLX: 'DISC',
  'BRK-B': 'FIN', JPM: 'FIN', V: 'FIN', MA: 'FIN', BAC: 'FIN', MS: 'FIN', GS: 'FIN',
  LLY: 'HLTH', UNH: 'HLTH', JNJ: 'HLTH', ABBV: 'HLTH', MRK: 'HLTH', TMO: 'HLTH', ABT: 'HLTH', PFE: 'HLTH',
  XOM: 'ENER', CVX: 'ENER',
  PG: 'STPL', COST: 'STPL', WMT: 'STPL', PEP: 'STPL', PM: 'STPL',
  CAT: 'IND', GE: 'IND', BA: 'IND', HON: 'IND',
  GOOGL: 'COMM', META: 'COMM', DIS: 'COMM', CMCSA: 'COMM', VZ: 'COMM'
};

export function MarketHeatmap() {
  const [data, setData] = useState<HeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeatmapData() {
      try {
        const res = await fetch('/api/market-movers');
        if (res.ok) {
          const json = await res.json();
          const combined = [...json.gainers, ...json.losers].map(item => ({
            symbol: item.symbol,
            name: item.symbol,
            pct: item.pct,
            sector: SECTOR_MAP[item.symbol] || 'CORE'
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
    if (pct > 3) return 'bg-[#004d00] border-[#00ff00]/30 text-white';
    if (pct > 1) return 'bg-[#006400] border-[#00cc00]/30 text-white';
    if (pct > 0) return 'bg-[#003300] border-[#008000]/30 text-white';
    if (pct < -3) return 'bg-[#4d0000] border-[#ff0000]/30 text-white';
    if (pct < -1) return 'bg-[#640000] border-[#cc0000]/30 text-white';
    if (pct < 0) return 'bg-[#330000] border-[#800000]/30 text-white';
    return 'bg-zinc-900 border-zinc-700 text-zinc-500';
  };

  if (loading && data.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Generating Market Heatmap...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black p-2 font-mono overflow-hidden">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase flex justify-between shrink-0">
        <span>HEAT - Market Map</span>
        <span className="text-amber-500/80">S&P 100 LEADERS</span>
      </div>

      <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-0.5 auto-rows-fr overflow-y-auto no-scrollbar">
        {data.map((item) => (
          <div 
            key={item.symbol}
            className={`flex flex-col items-center justify-center border transition-all hover:scale-[1.05] hover:z-20 cursor-default group relative ${getBgColor(item.pct)}`}
          >
            <span className="text-[10px] font-black">{item.symbol}</span>
            <span className="text-[8px] font-bold opacity-80">
              {item.pct > 0 ? '+' : ''}{item.pct.toFixed(1)}%
            </span>
            <span className="absolute top-0 right-0 p-0.5 text-[6px] opacity-30 group-hover:opacity-100 font-black">{item.sector}</span>
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
