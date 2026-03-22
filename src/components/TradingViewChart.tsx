'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewChart({ symbol, theme = 'dark' }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol.includes(':') ? symbol : `BINANCE:${symbol}USDT`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          // Custom styles to match Bloomberg look
          backgroundColor: '#000000',
          gridColor: '#1a1a1a',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if needed, though usually fine to keep
    };
  }, [symbol, theme]);

  // Unique ID for each widget instance in the grid
  const id = useRef(`tv-widget-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className="w-full h-full bg-black">
      <div 
        id={id.current} 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
}

const LAYOUTS = [
  { id: 1, label: '1x1', cols: 1, rows: 1 },
  { id: 2, label: '2x1', cols: 2, rows: 1 },
  { id: 4, label: '2x2', cols: 2, rows: 2 },
  { id: 6, label: '3x2', cols: 3, rows: 2 },
  { id: 8, label: '4x2', cols: 4, rows: 2 },
  { id: 12, label: '4x3', cols: 4, rows: 3 },
  { id: 16, label: '4x4', cols: 4, rows: 4 },
];

export function MultiChartGrid({ initialSymbol = 'BTC' }: { initialSymbol?: string }) {
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [symbols, setSymbols] = useState<string[]>(Array(16).fill(initialSymbol));

  const totalCharts = layout.cols * layout.rows;

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#1a1a1a] bg-[#050505] shrink-0">
        <div className="flex gap-1">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l)}
              className={`text-[9px] font-black px-2 py-0.5 border transition-colors ${
                layout.id === l.id 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
          GRID_MODE: {layout.label} | SYNC: OFF
        </div>
      </div>

      {/* Grid Container */}
      <div 
        className="flex-1 grid gap-px bg-[#111] overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: totalCharts }).map((_, i) => (
          <div key={i} className="relative group/chart">
            <TradingViewChart symbol={symbols[i]} />
            {/* Quick Symbol Overlay on Hover */}
            <div className="absolute top-1 left-1 opacity-0 group-hover/chart:opacity-100 transition-opacity z-20">
               <input 
                 className="bg-black/80 border border-zinc-700 text-[9px] text-amber-500 px-1 w-16 outline-none font-bold"
                 placeholder="CHANGE..."
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const newSymbols = [...symbols];
                     newSymbols[i] = (e.target as HTMLInputElement).value.toUpperCase();
                     setSymbols(newSymbols);
                     (e.target as HTMLInputElement).blur();
                   }
                 }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
