import React, { useState } from 'react';

type EcoEvent = {
  time: string;
  country: string;
  indicator: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  revised?: string;
};

const CALENDAR_DATA: EcoEvent[] = [
  { time: '04:00', country: 'EU', indicator: 'ECB President Lagarde Speaks', impact: 'HIGH', actual: '', forecast: '', previous: '' },
  { time: '08:30', country: 'US', indicator: 'Core PCE Price Index (MoM) (Feb)', impact: 'HIGH', actual: '0.3%', forecast: '0.3%', previous: '0.4%', revised: '0.5%' },
  { time: '08:30', country: 'US', indicator: 'PCE Price Index (YoY) (Feb)', impact: 'HIGH', actual: '2.5%', forecast: '2.5%', previous: '2.4%' },
  { time: '08:30', country: 'US', indicator: 'Personal Income (MoM) (Feb)', impact: 'MED', actual: '0.3%', forecast: '0.4%', previous: '1.0%' },
  { time: '08:30', country: 'US', indicator: 'Personal Spending (MoM) (Feb)', impact: 'MED', actual: '0.8%', forecast: '0.5%', previous: '0.2%' },
  { time: '08:30', country: 'US', indicator: 'Initial Jobless Claims', impact: 'HIGH', actual: '210K', forecast: '212K', previous: '210K' },
  { time: '09:45', country: 'US', indicator: 'Chicago PMI (Mar)', impact: 'MED', actual: '41.4', forecast: '46.0', previous: '44.0' },
  { time: '10:00', country: 'US', indicator: 'Pending Home Sales (MoM) (Feb)', impact: 'MED', actual: '1.6%', forecast: '1.5%', previous: '-4.9%' },
  { time: '10:00', country: 'US', indicator: 'UoM Consumer Sentiment (Mar)', impact: 'HIGH', actual: '79.4', forecast: '76.5', previous: '76.9' },
  { time: '13:00', country: 'US', indicator: 'Baker Hughes Rig Count', impact: 'LOW', actual: '620', forecast: '', previous: '624' },
];

export function EconomicCalendar() {
  const [filter, setFilter] = useState<'ALL' | 'HIGH'>('ALL');

  const filteredData = CALENDAR_DATA.filter((e) => filter === 'ALL' || e.impact === 'HIGH');

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden p-2">
      <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-1">
        <div className="text-[10px] text-zinc-500 font-bold uppercase">
          ECO - Economic Calendar
        </div>
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
