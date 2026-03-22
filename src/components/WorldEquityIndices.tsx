import React from 'react';

const REGIONS = [
  {
    name: 'AMERICAS',
    indices: [
      { symbol: 'INDU', name: 'Dow Jones', last: 39087.38, chg: 90.99, pct: 0.23, ytd: 3.7 },
      { symbol: 'SPX', name: 'S&P 500', last: 5137.08, chg: 40.81, pct: 0.80, ytd: 7.7 },
      { symbol: 'CCMP', name: 'NASDAQ', last: 16274.94, chg: 183.02, pct: 1.14, ytd: 8.4 },
      { symbol: 'RTY', name: 'Russell 2000', last: 2076.39, chg: 21.55, pct: 1.05, ytd: 2.4 },
      { symbol: 'SPTSX', name: 'S&P/TSX Comp', last: 21552.35, chg: 172.94, pct: 0.81, ytd: 2.8 },
      { symbol: 'MEXBOL', name: 'S&P/BMV IPC', last: 55309.43, chg: -4.01, pct: -0.01, ytd: -3.6 },
    ]
  },
  {
    name: 'EMEA',
    indices: [
      { symbol: 'SXXP', name: 'Stoxx 600', last: 497.58, chg: 4.42, pct: 0.90, ytd: 3.9 },
      { symbol: 'UKX', name: 'FTSE 100', last: 7682.50, chg: 52.48, pct: 0.69, ytd: -0.7 },
      { symbol: 'DAX', name: 'DAX', last: 17735.07, chg: 56.88, pct: 0.32, ytd: 5.9 },
      { symbol: 'CAC', name: 'CAC 40', last: 7934.17, chg: 6.74, pct: 0.09, ytd: 5.2 },
      { symbol: 'IBEX', name: 'IBEX 35', last: 10064.70, chg: 63.80, pct: 0.64, ytd: -0.4 },
      { symbol: 'FTSEMIB', name: 'FTSE MIB', last: 32934.22, chg: 353.48, pct: 1.08, ytd: 8.5 },
    ]
  },
  {
    name: 'ASIA/PACIFIC',
    indices: [
      { symbol: 'NKY', name: 'Nikkei 225', last: 39910.82, chg: 744.67, pct: 1.90, ytd: 19.3 },
      { symbol: 'TPX', name: 'TOPIX', last: 2709.42, chg: 33.69, pct: 1.26, ytd: 14.5 },
      { symbol: 'HSI', name: 'Hang Seng', last: 16589.44, chg: 78.00, pct: 0.47, ytd: -2.7 },
      { symbol: 'SHSZ300', name: 'CSI 300', last: 3537.80, chg: 21.73, pct: 0.62, ytd: 3.1 },
      { symbol: 'AS51', name: 'S&P/ASX 200', last: 7745.60, chg: 46.90, pct: 0.61, ytd: 2.0 },
      { symbol: 'KOSPI', name: 'KOSPI', last: 2642.36, chg: -9.93, pct: -0.37, ytd: -0.5 },
    ]
  }
];

export function WorldEquityIndices() {
  const getColor = (val: number) => {
    if (val > 1.0) return 'text-[#00ff00] bg-[#00ff00]/10'; // Strong Green
    if (val > 0) return 'text-[var(--bb-green)]';
    if (val < -1.0) return 'text-[#ff0000] bg-[#ff0000]/10'; // Strong Red
    if (val < 0) return 'text-[var(--bb-red)]';
    return 'text-zinc-400';
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto custom-scrollbar p-2">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase">
        WEI - World Equity Indices
      </div>
      
      <div className="space-y-4">
        {REGIONS.map((region) => (
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
                      {idx.chg > 0 ? '+' : ''}{idx.chg.toFixed(2)}
                    </td>
                    <td className={`px-2 py-1.5 text-right font-bold ${getColor(idx.pct)}`}>
                      {idx.pct > 0 ? '+' : ''}{idx.pct.toFixed(2)}%
                    </td>
                    <td className={`px-2 py-1.5 text-right ${idx.ytd >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                      {idx.ytd > 0 ? '+' : ''}{idx.ytd.toFixed(1)}%
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
