'use client';

import { Workspace } from '@/components/workspace/Workspace';
import { PanelState } from '@/types/workspace';

const INITIAL_PANELS: PanelState[] = [
  {
    id: 'monitor',
    title: 'Market Monitor',
    x: 20,
    y: 20,
    width: 600,
    height: 400,
    isMaximized: false,
    isClosed: false,
    zIndex: 1,
  },
  {
    id: 'risk',
    title: 'Risk Suite',
    x: 640,
    y: 20,
    width: 400,
    height: 300,
    isMaximized: false,
    isClosed: false,
    zIndex: 2,
  },
  {
    id: 'news',
    title: 'News / Events',
    x: 20,
    y: 440,
    width: 600,
    height: 300,
    isMaximized: false,
    isClosed: false,
    zIndex: 3,
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    x: 640,
    y: 340,
    width: 400,
    height: 400,
    isMaximized: false,
    isClosed: false,
    zIndex: 4,
  },
];

export default function WorkspaceDemoPage() {
  const renderPanelContent = (panel: PanelState) => {
    switch (panel.id) {
      case 'monitor':
        return (
          <div className="p-4 flex flex-col h-full">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['BTC-PERP', 'ETH-PERP', 'SOL-PERP', 'AVAX-PERP'].map(ticker => (
                <div key={ticker} className="bg-zinc-900 border border-zinc-800 p-2 text-center">
                  <div className="text-xs text-zinc-500 font-mono mb-1">{ticker}</div>
                  <div className="text-green-500 font-mono font-bold">+1.24%</div>
                </div>
              ))}
            </div>
            <div className="flex-1 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 font-mono text-sm">
              [ Chart Component Placeholder ]
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="p-4 space-y-4 font-mono">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Gross Exposure</span>
              <span className="text-amber-500">$1,240,500</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Net Exposure</span>
              <span className="text-amber-500">$45,000</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Margin Usage</span>
              <span className="text-red-400">84.2%</span>
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="p-4 flex flex-col gap-2">
            {[
              { time: '14:23:01', source: 'BBG', text: 'FED LEAVES RATES UNCHANGED' },
              { time: '14:21:44', source: 'RTR', text: 'SEC APPROVES NEW SPOT ETF OPTIONS' },
              { time: '14:15:00', source: 'TWT', text: 'Whale alert: 10,000 BTC moved to Binance' }
            ].map((n, i) => (
              <div key={i} className="flex gap-3 text-sm font-mono border-b border-zinc-800 pb-2">
                <span className="text-zinc-600">{n.time}</span>
                <span className="text-amber-600">{n.source}</span>
                <span className="text-zinc-300">{n.text}</span>
              </div>
            ))}
          </div>
        );
      case 'watchlist':
        return (
          <div className="p-4 font-mono text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-600">
                  <th className="pb-2 font-normal">TICKER</th>
                  <th className="pb-2 font-normal text-right">LAST</th>
                  <th className="pb-2 font-normal text-right">CHG</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {[
                  { t: 'AAPL', l: '173.50', c: '+0.5%' },
                  { t: 'MSFT', l: '420.69', c: '-1.2%' },
                  { t: 'NVDA', l: '850.20', c: '+4.5%' },
                  { t: 'TSLA', l: '190.10', c: '-0.1%' },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-zinc-800/50 hover:bg-zinc-900/50">
                    <td className="py-2">{row.t}</td>
                    <td className="py-2 text-right">{row.l}</td>
                    <td className={`py-2 text-right ${row.c.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div className="p-4 text-zinc-500 font-mono">Content for {panel.title}</div>;
    }
  };

  return (
    <div className="h-screen w-full bg-black">
      <Workspace initialPanels={INITIAL_PANELS} renderPanelContent={renderPanelContent} />
    </div>
  );
}
