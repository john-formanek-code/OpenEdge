'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTerminal } from './TerminalContext';

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
        let tvSymbol = symbol.toUpperCase();
        
        // Intelligent mapping
        if (!tvSymbol.includes(':')) {
          const cryptoPairs = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'MATIC', 'SUI', 'PEPE', 'TAO'];
          const baseSym = tvSymbol.replace('-USD', '').replace('USDT', '');
          
          if (cryptoPairs.includes(baseSym)) {
            tvSymbol = `BINANCE:${baseSym}USDT`;
          } else if (tvSymbol.startsWith('^')) {
            // Indices from Stooq to TV mapping (rough)
            const indexMap: Record<string, string> = {
              '^SPX': 'S&P:SPX',
              '^DJI': 'DJI:DJI',
              '^NDQ': 'NASDAQ:IXIC',
              '^DAX': 'XETR:DAX',
              '^UKX': 'INDEX:UKX'
            };
            tvSymbol = indexMap[tvSymbol] || tvSymbol;
          } else {
            // Assume US Equity
            tvSymbol = `NASDAQ:${tvSymbol}`;
          }
        }

        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          backgroundColor: '#000000',
          gridColor: '#1a1a1a',
          hide_top_toolbar: false,
          save_image: true,
          details: true,
          hotlist: true,
          calendar: true,
          show_popup_button: true,
          popup_width: "1000",
          popup_height: "650",
          studies: [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies"
          ],
        });
      }
    };
    document.head.appendChild(script);
  }, [symbol, theme]);

  // Unique ID for each widget instance in the grid
  const [chartId] = useState(() => `tv-widget-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className="w-full h-full bg-black">
      <div 
        id={chartId} 
        ref={containerRef} 
        className="w-full h-full"
      />
    </div>
  );
}

const LAYOUTS = [
  { id: '1x1', label: '1x1', type: 'grid', cols: 1, rows: 1 },
  { id: '2x1', label: '2x1', type: 'grid', cols: 2, rows: 1 },
  { id: '1x2', label: '1x2', type: 'grid', cols: 1, rows: 2 },
  { id: '4x1', label: '4x1', type: 'grid', cols: 4, rows: 1 },
  { id: '2x2', label: '2x2', type: 'grid', cols: 2, rows: 2 },
  { 
    id: 'L1-R2', 
    label: 'LARGE L + 2R', 
    type: 'custom', 
    areas: '"a b" "a c"',
    cols: '2fr 1fr',
    rows: '1fr 1fr',
    count: 3 
  },
  { 
    id: 'T2-B1', 
    label: '2T + WIDE B', 
    type: 'custom', 
    areas: '"a b" "c c"',
    cols: '1fr 1fr',
    rows: '1fr 1fr',
    count: 3 
  },
  { id: '3x2', label: '3x2', type: 'grid', cols: 3, rows: 2 },
  { id: '4x4', label: '4x4', type: 'grid', cols: 4, rows: 4 },
];
export function MultiChartGrid({ initialSymbol = 'BTC' }: { initialSymbol?: string }) {
  const { focusedTicker } = useTerminal();
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [symbols, setSymbols] = useState<string[]>(Array(16).fill(initialSymbol));
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    const stored = localStorage.getItem('openedge_chart_layout');
    if (stored) {
      try {
        const { layoutId, savedSymbols } = JSON.parse(stored);
        const l = LAYOUTS.find(x => x.id === layoutId);
        if (l) setLayout(l);
        if (savedSymbols) setSymbols(savedSymbols);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('openedge_chart_layout', JSON.stringify({
        layoutId: layout.id,
        savedSymbols: symbols
      }));
    }
  }, [layout, symbols, isLoaded]);

  // Sync first chart with global focused ticker
  useEffect(() => {
    if (focusedTicker) {
      setSymbols(prev => {
        const next = [...prev];
        next[0] = focusedTicker;
        return next;
      });
    }
  }, [focusedTicker]);

  const renderCharts = () => {
    const count = layout.type === 'grid' ? (layout.cols as number) * (layout.rows as number) : layout.count;
    const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

    return Array.from({ length: count as number }).map((_, i) => (
      <div 
        key={i} 
        className="relative group/chart border border-[#111]"
        style={layout.type === 'custom' ? { gridArea: areas[i] } : {}}
      >
        <TradingViewChart symbol={symbols[i]} />
        <div className="absolute top-1 left-1 opacity-0 group-hover/chart:opacity-100 transition-opacity z-20">
           <input 
             className="bg-black/80 border border-zinc-700 text-[9px] text-amber-500 px-1 w-16 outline-none font-bold"
             placeholder="TICKER..."
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
    ));
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#1a1a1a] bg-[#050505] shrink-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar items-center">
          <div className="flex bg-black border border-zinc-800 h-6 px-2 items-center mr-2">
            <span className="text-[9px] text-zinc-600 mr-2 font-black">SYNC ALL:</span>
            <input 
              className="bg-transparent border-0 outline-none text-amber-500 text-[10px] w-20 uppercase font-black"
              placeholder="SYM..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const sym = (e.target as HTMLInputElement).value.toUpperCase();
                  if (sym) setSymbols(Array(16).fill(sym));
                  (e.target as HTMLInputElement).value = '';
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />
          </div>
          <div className="h-4 w-px bg-zinc-800 mx-1" />
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayout(l)}
              className={`text-[8px] font-black px-1.5 py-0.5 border whitespace-nowrap transition-colors ${
                layout.id === l.id 
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div 
        className="flex-1 grid gap-px bg-[#0a0a0a] overflow-hidden"
        style={layout.type === 'grid' ? {
          gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        } : {
          gridTemplateAreas: layout.areas,
          gridTemplateColumns: layout.cols as string,
          gridTemplateRows: layout.rows as string,
        }}
      >
        {renderCharts()}
      </div>
    </div>
  );
}
