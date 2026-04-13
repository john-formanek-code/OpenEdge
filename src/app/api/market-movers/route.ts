import { NextResponse } from 'next/server';
import { getQuotes } from '@/lib/marketData';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

// More comprehensive lists for a real terminal feel
const EQUITY_LEADERS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'BRK-B', 'LLY',
  'JPM', 'UNH', 'XOM', 'V', 'PG', 'MA', 'COST', 'HD', 'JNJ', 'ORCL',
  'ABBV', 'CVX', 'BAC', 'WMT', 'MRK', 'ADBE', 'CRM', 'NFLX', 'PEP', 'AMD',
  'DIS', 'CSCO', 'TMO', 'ABT', 'INTC', 'CMCSA', 'QCOM', 'TXN', 'VZ', 'CAT',
  'GE', 'AMAT', 'IBM', 'BA', 'PFE', 'PM', 'MS', 'ISRG', 'HON', 'GS'
];

const CRYPTO_LEADERS = [
  'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD', 'DOGE-USD', 'LINK-USD', 'DOT-USD'
];

const SECTOR_ETFS = [
  'XLK', 'XLF', 'XLV', 'XLY', 'XLC', 'XLI', 'XLP', 'XLE', 'XLB', 'XLRE', 'XLU'
];

const SECTOR_MAP: Record<string, string> = {
  'XLK': 'Technology',
  'XLF': 'Financials',
  'XLV': 'Healthcare',
  'XLY': 'Consumer Disc',
  'XLC': 'Comm Services',
  'XLI': 'Industrials',
  'XLP': 'Consumer Staples',
  'XLE': 'Energy',
  'XLB': 'Materials',
  'XLRE': 'Real Estate',
  'XLU': 'Utilities'
};

export async function GET() {
  try {
    const allSymbols = [...EQUITY_LEADERS, ...CRYPTO_LEADERS, ...SECTOR_ETFS];
    const quotes = await getQuotes(allSymbols);

    // Process Equities and Crypto for Gainers/Losers
    const movers = quotes.filter(q => EQUITY_LEADERS.includes(q.symbol) || CRYPTO_LEADERS.includes(q.symbol));
    const sorted = [...movers].sort((a, b) => b.changePct - a.changePct);
    
    const gainers = sorted.slice(0, 10).map(q => ({
      symbol: q.symbol,
      last: q.last,
      chg: q.change,
      pct: q.changePct
    }));

    const losers = sorted.slice(-10).reverse().map(q => ({
      symbol: q.symbol,
      last: q.last,
      chg: q.change,
      pct: q.changePct
    }));

    // Process Sectors
    const sectors = quotes
      .filter(q => SECTOR_ETFS.includes(q.symbol))
      .map(q => ({
        name: SECTOR_MAP[q.symbol] || q.symbol,
        pct: q.changePct
      }))
      .sort((a, b) => b.pct - a.pct);

    return NextResponse.json({ gainers, losers, sectors });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process market movers' }, { status: 500 });
  }
}
