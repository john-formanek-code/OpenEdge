import React, { useState, useEffect } from 'react';

type Mover = { symbol: string; last: number; chg: number; pct: number };
type Sector = { name: string; pct: number };

export function MarketMovers() {
  const [gainers, setGainers] = useState<Mover[]>([]);
  const [losers, setLosers] = useState<Mover[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovers() {
      try {
        const res = await fetch('/api/market-movers');
        if (res.ok) {
          const data = await res.json();
          if (data.gainers) setGainers(data.gainers);
          if (data.losers) setLosers(data.losers);
          if (data.sectors) setSectors(data.sectors);
        }
      } catch (e) {
        console.error('Failed to fetch market movers', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMovers();
    const intervalId = setInterval(fetchMovers, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && gainers.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Scanning Market...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto custom-scrollbar p-2 font-mono">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase flex justify-between">
        <span>TOP - Market Movers & Sectors</span>
        <span className="text-[9px] text-amber-500/80">LIVE</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Sectors Heatmap-ish */}
        <div className="border border-zinc-900 bg-[#050505] p-2">
          <div className="text-[9px] font-black text-amber-500/80 mb-2 uppercase">Sector Performance (SPDR ETFs)</div>
          <div className="grid grid-cols-2 gap-2">
            {sectors.map(s => (
              <div key={s.name} className="flex items-center justify-between bg-zinc-900/50 p-1.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-400">{s.name}</span>
                <span className={`text-[10px] font-bold ${s.pct >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                  {s.pct > 0 ? '+' : ''}{s.pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div className="border border-zinc-900 bg-[#050505]">
          <div className="bg-green-900/20 text-[9px] font-black text-green-500 px-2 py-1 border-b border-zinc-900 uppercase">
            Top Gainers
          </div>
          <table className="w-full text-[10px]">
            <tbody>
              {gainers.map(g => (
                <tr key={g.symbol} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="p-2 font-bold text-amber-400">{g.symbol}</td>
                  <td className="p-2 text-right text-zinc-300">{g.last.toFixed(2)}</td>
                  <td className="p-2 text-right text-green-500 font-bold">+{g.pct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Losers */}
        <div className="border border-zinc-900 bg-[#050505]">
          <div className="bg-red-900/20 text-[9px] font-black text-red-500 px-2 py-1 border-b border-zinc-900 uppercase">
            Top Losers
          </div>
          <table className="w-full text-[10px]">
            <tbody>
              {losers.map(l => (
                <tr key={l.symbol} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="p-2 font-bold text-amber-400">{l.symbol}</td>
                  <td className="p-2 text-right text-zinc-300">{l.last.toFixed(2)}</td>
                  <td className="p-2 text-right text-red-500 font-bold">{l.pct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
