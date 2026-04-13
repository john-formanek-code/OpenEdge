'use client';

import React, { useState, useEffect } from 'react';
import { useTerminal } from './TerminalContext';

type OrderEntry = [string, string]; // [price, quantity]
type OrderBookData = {
  lastUpdateId: number;
  bids: OrderEntry[];
  asks: OrderEntry[];
};

export function LevelTwoBook({ symbol }: { symbol?: string }) {
  const { focusedTicker } = useTerminal();
  const activeSymbol = (symbol || focusedTicker || 'BTCUSDT').replace('-', '').toUpperCase();
  
  // Fallback to BTCUSDT if the ticker isn't crypto-like or valid for Binance
  const binanceSymbol = activeSymbol.endsWith('USDT') || activeSymbol.endsWith('USD') 
    ? activeSymbol.replace('USD', 'USDT') // basic normalization for Binance
    : 'BTCUSDT';

  const [data, setData] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    async function fetchBook() {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${binanceSymbol}&limit=20`);
        if (!res.ok) throw new Error('Failed to fetch L2');
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (e) {
        setError('L2 Data Unavailable for this instrument.');
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
    intervalId = setInterval(fetchBook, 2000); // 2s refresh for L2
    return () => clearInterval(intervalId);
  }, [binanceSymbol]);

  if (loading && !data) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Initializing L2 Order Book...</div>;
  }

  if (error || !data) {
    return <div className="h-full flex items-center justify-center bg-black text-red-500 font-mono text-xs uppercase">{error || 'Data feed offline'}</div>;
  }

  // Calculate cumulative sizes and max depths
  let cumAsk = 0;
  const asksWithCum = [...data.asks].reverse().map(ask => {
    const size = parseFloat(ask[1]);
    cumAsk += size;
    return { price: parseFloat(ask[0]), size, cum: cumAsk };
  });

  let cumBid = 0;
  const bidsWithCum = data.bids.map(bid => {
    const size = parseFloat(bid[1]);
    cumBid += size;
    return { price: parseFloat(bid[0]), size, cum: cumBid };
  });

  const maxAskSize = Math.max(...asksWithCum.map(a => a.size), 0.01);
  const maxBidSize = Math.max(...bidsWithCum.map(b => b.size), 0.01);

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden font-mono text-[10px] select-none">
      <div className="text-[10px] text-zinc-500 font-bold p-2 border-b border-zinc-800 uppercase bg-[#050505] flex justify-between items-center shrink-0">
        <div className="flex gap-2 items-center">
          <span className="text-[var(--bb-amber)]">L2</span>
          <span className="text-white">ORDER BOOK</span>
          <span className="px-1 bg-zinc-900 border border-zinc-800 text-zinc-400">{binanceSymbol}</span>
        </div>
        <div className="flex gap-2">
           <span className="text-green-500">BIDS: {bidsWithCum.length}</span>
           <span className="text-red-500">ASKS: {asksWithCum.length}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="grid grid-cols-3 border-b border-zinc-800 bg-[#0a0a0a] text-zinc-500 py-1 px-2 sticky top-0 z-10">
          <div className="text-left font-bold uppercase">Size</div>
          <div className="text-center font-bold uppercase">Price</div>
          <div className="text-right font-bold uppercase">Cum. Size</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* ASKS (Sellers) - Rendered bottom-up by visually stacking or just letting them flow. We reversed them above. */}
          <div className="flex flex-col justify-end">
            {asksWithCum.map((ask, i) => (
              <div key={`ask-${i}`} className="grid grid-cols-3 py-0.5 px-2 hover:bg-[#111] relative group border-b border-transparent hover:border-zinc-800 cursor-crosshair">
                <div className="absolute top-0 right-0 bottom-0 bg-red-900/20 pointer-events-none" style={{ width: `${(ask.size / maxAskSize) * 100}%` }} />
                <div className="text-left text-zinc-300 z-10">{ask.size.toFixed(4)}</div>
                <div className="text-center text-red-500 font-bold z-10">{ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-right text-zinc-500 z-10">{ask.cum.toFixed(4)}</div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between py-1 px-4 border-y border-zinc-800 bg-[#050505]">
             <span className="text-[9px] text-zinc-600 uppercase font-black">Spread</span>
             <span className="text-white font-bold font-mono text-[11px]">
               {Math.abs(asksWithCum[asksWithCum.length-1].price - bidsWithCum[0].price).toFixed(2)}
             </span>
          </div>

          {/* BIDS (Buyers) */}
          <div className="flex flex-col">
            {bidsWithCum.map((bid, i) => (
              <div key={`bid-${i}`} className="grid grid-cols-3 py-0.5 px-2 hover:bg-[#111] relative group border-t border-transparent hover:border-zinc-800 cursor-crosshair">
                <div className="absolute top-0 left-0 bottom-0 bg-green-900/20 pointer-events-none" style={{ width: `${(bid.size / maxBidSize) * 100}%` }} />
                <div className="text-left text-zinc-300 z-10">{bid.size.toFixed(4)}</div>
                <div className="text-center text-green-500 font-bold z-10">{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                <div className="text-right text-zinc-500 z-10">{bid.cum.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}