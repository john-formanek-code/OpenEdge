import React from 'react';

const GAINERS = [
  { symbol: 'NVDA', last: 822.79, chg: 42.10, pct: 5.4 },
  { symbol: 'AMD', last: 202.64, chg: 9.15, pct: 4.7 },
  { symbol: 'SMCI', last: 1140.01, chg: 45.20, pct: 4.1 },
  { symbol: 'MRVL', last: 83.42, chg: 2.80, pct: 3.5 },
  { symbol: 'AVGO', last: 1401.30, chg: 38.50, pct: 2.8 },
];

const LOSERS = [
  { symbol: 'TSLA', last: 175.34, chg: -8.20, pct: -4.5 },
  { symbol: 'AAPL', last: 169.12, chg: -3.40, pct: -2.0 },
  { symbol: 'NFLX', last: 590.10, chg: -10.50, pct: -1.7 },
  { symbol: 'GOOGL', last: 142.30, chg: -1.80, pct: -1.2 },
  { symbol: 'AMZN', last: 174.45, chg: -1.20, pct: -0.7 },
];

const SECTORS = [
  { name: 'Technology', pct: 2.4 },
  { name: 'Energy', pct: 1.8 },
  { name: 'Financials', pct: 0.5 },
  { name: 'Healthcare', pct: -0.2 },
  { name: 'Consumer Disc', pct: -1.4 },
  { name: 'Utilities', pct: -2.1 },
];

export function MarketMovers() {
  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto custom-scrollbar p-2 font-mono">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase">
        TOP - Market Movers & Sectors
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Sectors Heatmap-ish */}
        <div className="border border-zinc-900 bg-[#050505] p-2">
          <div className="text-[9px] font-black text-amber-500/80 mb-2 uppercase">Sector Performance</div>
          <div className="grid grid-cols-2 gap-2">
            {SECTORS.map(s => (
              <div key={s.name} className="flex items-center justify-between bg-zinc-900/50 p-1.5 border border-zinc-800">
                <span className="text-[10px] text-zinc-400">{s.name}</span>
                <span className={`text-[10px] font-bold ${s.pct >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                  {s.pct > 0 ? '+' : ''}{s.pct}%
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
              {GAINERS.map(g => (
                <tr key={g.symbol} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="p-2 font-bold text-amber-400">{g.symbol}</td>
                  <td className="p-2 text-right text-zinc-300">{g.last.toFixed(2)}</td>
                  <td className="p-2 text-right text-green-500 font-bold">+{g.pct}%</td>
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
              {LOSERS.map(l => (
                <tr key={l.symbol} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="p-2 font-bold text-amber-400">{l.symbol}</td>
                  <td className="p-2 text-right text-zinc-300">{l.last.toFixed(2)}</td>
                  <td className="p-2 text-right text-red-500 font-bold">{l.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
