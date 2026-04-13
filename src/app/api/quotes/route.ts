import { NextRequest, NextResponse } from 'next/server';
import { getQuotes } from '@/lib/marketData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const symbolsParam = params.get('symbols');
  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols query required' }, { status: 400 });
  }
  
  const symbols = symbolsParam.split(',');
  const results = await getQuotes(symbols);

  return NextResponse.json({ quotes: results, fetchedAt: new Date().toISOString() });
}