import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(req: Request) {
  try {
    // Determine the base URL for the internal API call
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Symbols to track for movers
    const moverSymbols = [
      'NVDA', 'AMD', 'SMCI', 'MRVL', 'AVGO', 'TSLA', 'AAPL', 'NFLX', 'GOOGL', 'AMZN', 'MSFT', 'META',
      'COIN', 'MSTR', 'PLTR', 'ARM', 'INTC', 'BTC-USD', 'ETH-USD', 'SOL-USD'
    ];
    
    // Symbols for sectors
    const sectorSymbols = [
      'XLK', // Tech
      'XLE', // Energy
      'XLF', // Financials
      'XLV', // Healthcare
      'XLY', // Consumer Disc
      'XLU'  // Utilities
    ];

    const allSymbols = [...moverSymbols, ...sectorSymbols].join(',');
    
    const res = await fetch(`${baseUrl}/api/quotes?symbols=${allSymbols}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch quotes for movers' }, { status: 500 });
    }

    const data = await res.json();
    const quotes: any[] = data.quotes || [];

    // Process Movers
    const movers = quotes.filter(q => moverSymbols.includes(q.symbol));
    const sortedMovers = [...movers].sort((a, b) => b.changePct - a.changePct);
    
    const gainers = sortedMovers.slice(0, 5).map(q => ({
      symbol: q.symbol,
      last: q.last,
      chg: q.change,
      pct: q.changePct
    }));

    const losers = sortedMovers.slice(-5).reverse().map(q => ({
      symbol: q.symbol,
      last: q.last,
      chg: q.change,
      pct: q.changePct
    }));

    // Process Sectors
    const sectorMap: Record<string, string> = {
      'XLK': 'Technology',
      'XLE': 'Energy',
      'XLF': 'Financials',
      'XLV': 'Healthcare',
      'XLY': 'Consumer Disc',
      'XLU': 'Utilities'
    };

    const sectors = quotes
      .filter(q => sectorSymbols.includes(q.symbol))
      .map(q => ({
        name: sectorMap[q.symbol] || q.symbol,
        pct: q.changePct
      }))
      .sort((a, b) => b.pct - a.pct); // Sort sectors from best to worst

    return NextResponse.json({ gainers, losers, sectors });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process market movers' }, { status: 500 });
  }
}
