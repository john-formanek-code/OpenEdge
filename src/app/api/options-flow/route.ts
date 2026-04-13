import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Dynamic

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'SUIUSDT'];
const MIN_USD_VALUE = 50000; // Large trades only

async function fetchLargeTrades(symbol: string) {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=20`);
    if (!res.ok) return [];
    const trades = await res.json();
    
    return trades.map((t: any) => {
      const price = parseFloat(t.p);
      const qty = parseFloat(t.q);
      const usdValue = price * qty;
      const isBuyerMaker = t.m; // True if seller is maker, so it's a sell-side market trade? Wait, m means "was the buyer the market maker?". If true, it's a sell.
      
      return {
        id: `binance-${t.a}`,
        time: new Date(t.T).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: t.T,
        symbol: symbol.replace('USDT', ''),
        type: usdValue > 250000 ? 'WHALE' : 'BLOCK',
        contract: `${isBuyerMaker ? 'SELL' : 'BUY'} @ ${price.toLocaleString()}`,
        premium: usdValue > 1000000 ? `$${(usdValue / 1000000).toFixed(1)}M` : `$${(usdValue / 1000).toFixed(0)}K`,
        sentiment: isBuyerMaker ? 'BEARISH' : 'BULLISH',
        usdValue
      };
    }).filter((t: any) => t.usdValue >= MIN_USD_VALUE);
  } catch (e) {
    return [];
  }
}

export async function GET() {
  try {
    // Fetch from a few pairs to get a diverse tape
    const results = await Promise.all(PAIRS.slice(0, 5).map(fetchLargeTrades));
    const flows = results.flat().sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);
    
    return NextResponse.json({ flows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process trades' }, { status: 500 });
  }
}
