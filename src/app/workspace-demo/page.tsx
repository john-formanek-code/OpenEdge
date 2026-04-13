'use client';

import { Workspace } from '@/components/workspace/Workspace';
import { TradingViewChart } from '@/components/TradingViewChart';
import { WatchlistBoard } from '@/components/WatchlistBoard';
import { NewsTerminal } from '@/components/NewsTerminal';
import { PortfolioRiskPanel } from '@/components/PortfolioRiskPanel';
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
          <div className="h-full bg-black overflow-hidden relative">
            <TradingViewChart symbol="BTC-USD" />
          </div>
        );
      case 'risk':
        return (
          <div className="p-4 h-full bg-black">
            <PortfolioRiskPanel 
              data={{ 
                clusters: [
                  { name: 'Tech/AI', exposure: 850000, rCount: 5 },
                  { name: 'Energy', exposure: 240000, rCount: 2 },
                  { name: 'Crypto', exposure: 150000, rCount: 3 }
                ],
                stops: [
                  { price: 170.5, risk: 450, hypothesisId: '1' },
                  { price: 165.2, risk: 320, hypothesisId: '2' },
                  { price: 162.0, risk: 280, hypothesisId: '3' },
                  { price: 158.5, risk: 120, hypothesisId: '4' }
                ]
              }} 
            />
          </div>
        );
      case 'news':
        return <NewsTerminal />;
      case 'watchlist':
        return <WatchlistBoard />;
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

