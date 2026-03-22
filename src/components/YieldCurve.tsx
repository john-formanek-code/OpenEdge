import React, { useState, useEffect } from 'react';

type YieldData = { term: string; us: number; uk: number; de: number; jp: number };

export function YieldCurve() {
  const [yieldData, setYieldData] = useState<YieldData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYields() {
      try {
        const res = await fetch('/api/yields');
        if (res.ok) {
          const data = await res.json();
          if (data.yields) setYieldData(data.yields);
        }
      } catch (e) {
        console.error('Failed to fetch yields', e);
      } finally {
        setLoading(false);
      }
    }
    fetchYields();
    const intervalId = setInterval(fetchYields, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading && yieldData.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Loading Yield Curves...</div>;
  }

  // Find max yield to scale the bar chart
  const maxYield = Math.max(...yieldData.map(d => d.us), 6.0);

  return (
    <div className="h-full flex flex-col bg-black overflow-y-auto custom-scrollbar p-2 font-mono">
      <div className="text-[10px] text-zinc-500 font-bold mb-3 border-b border-zinc-800 pb-1 uppercase flex justify-between">
        <span>CURV - Global Yield Curves</span>
        <span className="text-amber-500">SOVEREIGN DEBT</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        {/* Left: Data Table */}
        <div className="lg:w-1/2 border border-zinc-900 bg-[#050505] p-2">
          <table className="w-full text-[10px]">
            <thead className="border-b border-zinc-800 text-zinc-600">
              <tr>
                <th className="text-left py-1">TERM</th>
                <th className="text-right py-1">USA</th>
                <th className="text-right py-1">UK</th>
                <th className="text-right py-1">GER</th>
                <th className="text-right py-1">JPN</th>
              </tr>
            </thead>
            <tbody>
              {yieldData.map(row => (
                <tr key={row.term} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                  <td className="py-1.5 font-bold text-amber-500">{row.term}</td>
                  <td className="py-1.5 text-right font-bold text-white">{row.us.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-zinc-300">{row.uk.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-zinc-400">{row.de.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-zinc-500">{row.jp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-[8px] text-zinc-600 uppercase">
            Yields are represented in percentages (%)
          </div>
        </div>

        {/* Right: Visual Curve for US */}
        <div className="lg:w-1/2 border border-zinc-900 bg-[#050505] p-4 flex flex-col">
          <div className="text-[9px] font-black text-amber-500/80 mb-6 uppercase text-center">
            US Treasury Yield Curve Shape
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1 pb-4 relative border-b border-zinc-800">
            {/* Y-axis labels */}
            <div className="absolute left-0 bottom-full w-full h-full flex flex-col justify-between text-[8px] text-zinc-700 pointer-events-none">
               <span>{maxYield.toFixed(1)}%</span>
               <span>{(maxYield / 2).toFixed(1)}%</span>
               <span>0.0%</span>
            </div>

            {yieldData.map((d, i) => {
              const heightPct = Math.max(0, (d.us / maxYield) * 100); 
              return (
                <div key={d.term} className="flex flex-col items-center flex-1 relative group">
                  <div 
                    className="w-full bg-amber-500/20 hover:bg-amber-500/50 border-t-2 border-amber-500 transition-all"
                    style={{ height: `${heightPct}%` }}
                  >
                     <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 text-[9px] text-white text-center w-full transition-opacity z-10 bg-black/80 px-1 rounded">
                       {d.us.toFixed(2)}
                     </div>
                  </div>
                  <div className="text-[8px] text-zinc-500 mt-2 font-bold">{d.term}</div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4 text-[9px] text-zinc-500">
            Current shape indicates an <span className="text-amber-500 font-bold">inverted</span> yield curve.
          </div>
        </div>
      </div>
    </div>
  );
}
