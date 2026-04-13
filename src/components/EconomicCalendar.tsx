import React, { useState, useEffect } from 'react';

type EcoEvent = {
  date: string;
  time: string;
  country: string;
  indicator: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  revised?: string;
};

export function EconomicCalendar() {
  const [filter, setFilter] = useState<'ALL' | 'HIGH'>('ALL');
  const [calendarData, setCalendarData] = useState<EcoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
          const data = await res.json();
          if (data.events) setCalendarData(data.events);
        }
      } catch (e) {
        console.error('Failed to fetch calendar', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
    const intervalId = setInterval(fetchCalendar, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  const filteredData = calendarData.filter((e) => filter === 'ALL' || e.impact === 'HIGH');

  const nextHighImpact = React.useMemo(() => {
    return calendarData
      .filter(e => e.impact === 'HIGH' && new Date(e.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [calendarData, now]);

  const getTimeLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return 'DUE';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  if (loading && calendarData.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Loading Macro Data...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden p-2">
      <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase">
          ECO - Economic Calendar
        </div>
        {nextHighImpact && (
          <div className="flex items-center gap-2 px-2 bg-red-950/20 border border-red-900/50">
             <span className="text-[8px] text-red-500 font-black blink">NEXT HIGH:</span>
             <span className="text-[9px] text-zinc-300 font-mono max-w-[100px] truncate">{nextHighImpact.indicator}</span>
             <span className="text-[10px] text-white font-black font-mono ml-2">{getTimeLeft(nextHighImpact.date)}</span>
          </div>
        )}
        <div className="flex gap-2 text-[9px] font-mono">
          <button 
            className={`px-2 py-0.5 border ${filter === 'ALL' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'border-zinc-800 text-zinc-500'}`}
            onClick={() => setFilter('ALL')}
          >
            ALL
          </button>
          <button 
            className={`px-2 py-0.5 border ${filter === 'HIGH' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'border-zinc-800 text-zinc-500'}`}
            onClick={() => setFilter('HIGH')}
          >
            HIGH IMPACT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-[10px] font-mono border-collapse">
          <thead className="sticky top-0 bg-[#050505] z-10 shadow-[0_1px_0_#222]">
            <tr className="text-zinc-600 text-left">
              <th className="px-2 py-1.5 font-normal w-[10%]">Time</th>
              <th className="px-2 py-1.5 font-normal w-[5%] text-center">Imp</th>
              <th className="px-2 py-1.5 font-normal w-[45%]">Event</th>
              <th className="px-2 py-1.5 font-normal text-right">Actual</th>
              <th className="px-2 py-1.5 font-normal text-right">Forecast</th>
              <th className="px-2 py-1.5 font-normal text-right">Prior</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((e, i) => (
              <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                <td className="px-2 py-2 text-zinc-400">{e.time}</td>
                <td className="px-2 py-2 text-center">
                  <div className={`w-2 h-2 rounded-full mx-auto ${
                    e.impact === 'HIGH' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 
                    e.impact === 'MED' ? 'bg-amber-500' : 'bg-zinc-600'
                  }`} title={e.impact} />
                </td>
                <td className="px-2 py-2 text-zinc-200">
                  <span className="font-black text-zinc-600 mr-2">{e.country}</span>
                  {e.indicator}
                </td>
                <td className={`px-2 py-2 text-right font-bold ${e.actual ? 'text-white bg-zinc-800/30' : 'text-zinc-600'}`}>
                  {e.actual || '--'}
                </td>
                <td className="px-2 py-2 text-right text-zinc-400">
                  {e.forecast || '--'}
                </td>
                <td className="px-2 py-2 text-right text-zinc-500">
                  {e.previous || '--'}
                  {e.revised && <span className="text-amber-500/50 ml-1 text-[8px]">({e.revised})</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-[9px] text-zinc-600 uppercase pt-2 border-t border-zinc-900">
        Source: Bloomberg / Census Bureau / BLS
      </div>
    </div>
  );
}
