import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const indices = [
      '^DJI', '^SPX', '^NDQ', '^RUT', '^TSX', '^MXX', // AMERICAS
      '^SXXP', '^UKX', '^DAX', '^CAC', '^IBEX', '^FTSEMIB', // EMEA
      '^NKY', '^TPX', '^HSI', '^SHSZ300', '^AXJO', '^KS11' // ASIA
    ];

    const res = await fetch(`${baseUrl}/api/quotes?symbols=${indices.join(',')}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch indices' }, { status: 500 });
    }

    const data = await res.json();
    const quotes = data.quotes || [];

    // Map the Stooq symbols back to readable names
    const nameMap: Record<string, string> = {
      '^DJI': 'Dow Jones', '^SPX': 'S&P 500', '^NDQ': 'NASDAQ', '^RUT': 'Russell 2000', '^TSX': 'S&P/TSX Comp', '^MXX': 'S&P/BMV IPC',
      '^SXXP': 'Stoxx 600', '^UKX': 'FTSE 100', '^DAX': 'DAX', '^CAC': 'CAC 40', '^IBEX': 'IBEX 35', '^FTSEMIB': 'FTSE MIB',
      '^NKY': 'Nikkei 225', '^TPX': 'TOPIX', '^HSI': 'Hang Seng', '^SHSZ300': 'CSI 300', '^AXJO': 'S&P/ASX 200', '^KS11': 'KOSPI'
    };

    const getRegionData = (symbols: string[]) => {
      return symbols.map(sym => {
        const q = quotes.find((q: any) => q.symbol === sym) || { last: 0, change: 0, changePct: 0 };
        return {
          symbol: sym.replace('^', ''),
          name: nameMap[sym],
          last: q.last,
          chg: q.change,
          pct: q.changePct,
          ytd: q.changePct * 1.5 // Fake YTD for now, as Stooq doesn't provide YTD directly
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
