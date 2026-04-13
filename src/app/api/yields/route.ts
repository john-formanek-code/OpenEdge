import { NextResponse } from 'next/server';
import { getQuotes } from '@/lib/marketData';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache for 5 minutes

const MAPPING: Record<string, string[]> = {
  US: ['3MSY.B', '1YSY.B', '2USY.B', '5USY.B', '10USY.B', '30USY.B'],
  UK: ['10GBY.B'],
  DE: ['10DEY.B'],
  JP: ['10JPY.B']
};

const TERMS = ['3M', '1Y', '2Y', '5Y', '10Y', '30Y'];

export async function GET() {
  try {
    const allSymbols = Object.values(MAPPING).flat();
    const quotes = await getQuotes(allSymbols);
    
    const findLast = (sym: string) => quotes.find(q => q.symbol === sym)?.last ?? 0;

    const YIELD_CURVE_DATA = TERMS.map((term, i) => {
      const usSym = MAPPING.US[i];
      const usYield = usSym ? findLast(usSym) : 0;
      
      // For other countries we only have 10Y easily on Stooq in this batch
      // So we'll fill with 0 or estimate if not 10Y, but better just show what we have
      return {
        term,
        us: usYield,
        uk: term === '10Y' ? findLast('10GBY.B') : 0,
        de: term === '10Y' ? findLast('10DEY.B') : 0,
        jp: term === '10Y' ? findLast('10JPY.B') : 0,
      };
    });

    return NextResponse.json({ yields: YIELD_CURVE_DATA });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process yields' }, { status: 500 });
  }
}
