import { NextResponse } from 'next/server';
import { getQuotes } from '@/lib/marketData';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const INDICES = [
  '^DJI', '^SPX', '^NDQ', '^RUT', '^TSX', '^MXX', // AMERICAS
  '^SXXP', '^UKX', '^DAX', '^CAC', '^IBEX', '^FTSEMIB', // EMEA
  '^NKY', '^TPX', '^HSI', '^SHSZ300', '^AXJO', '^KS11' // ASIA
];

const NAME_MAP: Record<string, string> = {
  '^DJI': 'Dow Jones', '^SPX': 'S&P 500', '^NDQ': 'NASDAQ', '^RUT': 'Russell 2000', '^TSX': 'S&P/TSX Comp', '^MXX': 'S&P/BMV IPC',
  '^SXXP': 'Stoxx 600', '^UKX': 'FTSE 100', '^DAX': 'DAX', '^CAC': 'CAC 40', '^IBEX': 'IBEX 35', '^FTSEMIB': 'FTSE MIB',
  '^NKY': 'Nikkei 225', '^TPX': 'TOPIX', '^HSI': 'Hang Seng', '^SHSZ300': 'CSI 300', '^AXJO': 'S&P/ASX 200', '^KS11': 'KOSPI'
};

export async function GET() {
  try {
    const quotes = await getQuotes(INDICES);

    const getRegionData = (symbols: string[]) => {
      return symbols.map(sym => {
        const q = quotes.find((q: any) => q.symbol === sym) || { last: 0, change: 0, changePct: 0 };
        return {
          symbol: sym.replace('^', ''),
          name: NAME_MAP[sym],
          last: q.last,
          chg: q.change,
          pct: q.changePct,
          ytd: 0 // Real YTD not available via simple Stooq API for now
        };
      });
    };

    const regions = [
      { name: 'AMERICAS', indices: getRegionData(['^DJI', '^SPX', '^NDQ', '^RUT', '^TSX', '^MXX']) },
      { name: 'EMEA', indices: getRegionData(['^SXXP', '^UKX', '^DAX', '^CAC', '^IBEX', '^FTSEMIB']) },
      { name: 'ASIA/PACIFIC', indices: getRegionData(['^NKY', '^TPX', '^HSI', '^SHSZ300', '^AXJO', '^KS11']) }
    ];

    return NextResponse.json({ regions });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process indices' }, { status: 500 });
  }
}
