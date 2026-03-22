import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout } from '@/lib/utils';

type Quote = {
  symbol: string;
  last: number;
  change: number;
  changePct: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  high24h?: number;
  low24h?: number;
  marketCap?: number;
  assetClass: 'equity' | 'crypto';
  source: 'stooq' | 'coingecko';
};

const COINGECKO_MAP: Record<string, string | string[]> = {
  'BTC-USD': 'bitcoin',
  'ETH-USD': 'ethereum',
  'BNB-USD': 'binancecoin',
  'XMR-USD': 'monero',
  'ZEC-USD': 'zcash',
  'TAO-USD': 'bittensor',
  'SOL-USD': 'solana',
  'LTC-USD': 'litecoin',
  'HYPE-USD': 'hyperliquid',
  'AVAX-USD': 'avalanche-2',
  'LINK-USD': 'chainlink',
  'XRP-USD': 'ripple',
  'SUI-USD': 'sui',
  'TRX-USD': 'tron',
  'ADA-USD': 'cardano',
  'ENA-USD': 'ethena',
  'DOGE-USD': 'dogecoin',
  'TRUMP-USD': 'official-trump',
  'VIRTUAL-USD': 'virtual-protocol',
  'WLD-USD': 'worldcoin-wld',
  'WIF-USD': 'dogwifcoin',
  'FARTCOIN-USD': 'fartcoin',
  'WLFI-USD': 'world-liberty-financial',
  'MON-USD': 'mon-protocol',
  'PENGU-USD': 'pudgy-penguins',
  'PUMP-USD': ['pump-fun', 'pump'],
  'PEPE-USD': 'pepe',
};

const normalizeSymbol = (s: string) => s.trim().toUpperCase().replace('/', '-');

async function fetchYahooFinance(symbol: string): Promise<Quote | null> {
  try {
    let yfSymbol = symbol.toUpperCase();
    // Map common index symbols to Yahoo format
    const mapping: Record<string, string> = {
      '^SPX': '^GSPC',
      '^NDQ': '^IXIC',
      '^DJI': '^DJI',
      '^RUT': '^RTY',
      '^VIX': '^VIX',
      '^DAX': '^GDAXI',
      '^FTSE': '^FTSE',
      'BTC': 'BTC-USD',
      'ETH': 'ETH-USD'
    };
    yfSymbol = mapping[yfSymbol] || yfSymbol;

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yfSymbol}`;
    const res = await fetch(url, { cache: 'no-store', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    
    const data = await res.json();
    const result = data?.quoteResponse?.result?.[0];
    
    if (!result) return null;

    return {
      symbol: symbol.toUpperCase(),
      last: result.regularMarketPrice,
      change: result.regularMarketChange,
      changePct: result.regularMarketChangePercent,
      open: result.regularMarketOpen,
      high: result.regularMarketDayHigh,
      low: result.regularMarketDayLow,
      volume: result.regularMarketVolume,
      marketCap: result.marketCap,
      assetClass: symbol.includes('-') ? 'crypto' : 'equity',
      source: 'stooq', // label as stooq for compatibility with existing UI logic if needed, but actually YF
    };
  } catch (err) {
    console.error(`Yahoo Finance error for ${symbol}:`, err);
    return null;
  }
}

async function fetchEquity(symbol: string): Promise<Quote | null> {
  // Try Stooq first (existing)
  try {
    let formatted = symbol.toLowerCase();
    if (!formatted.startsWith('^') && !formatted.endsWith('.us')) {
      formatted = `${formatted}.us`;
    }
    const url = `https://stooq.pl/q/l/?s=${formatted}&f=sd2t2ohlcv&h&e=json`;
    
    const res = await fetchWithTimeout(url, { cache: 'no-store', timeout: 3000 });
    if (res.ok) {
      const raw = await res.text();
      const json = JSON.parse(raw);
      const first = json?.symbols?.[0];
      if (first && first.close) {
        const change = first.close - first.open;
        return {
          symbol: symbol.toUpperCase(),
          last: Number(first.close),
          change,
          changePct: first.open ? (change / first.open) * 100 : 0,
          open: Number(first.open),
          high: Number(first.high),
          low: Number(first.low),
          volume: Number(first.volume),
          assetClass: 'equity',
          source: 'stooq',
        };
      }
    }
  } catch (e) {
    // Silently fail to fallback
  }

  // Fallback to Yahoo Finance
  return await fetchYahooFinance(symbol);
}

type BatchMap = { symbol: string; ids: string[] };

async function fetchCryptoBatch(batch: BatchMap[]): Promise<Quote[]> {
  const quotes: Quote[] = [];
  // flatten ids (first choice) for batching; if multiple ids provided for a symbol, include them all to maximize hit rate
  const idSet = new Set<string>();
  batch.forEach((b) => b.ids.forEach((id) => idSet.add(id)));
  if (idSet.size === 0) return quotes;

  const idsParam = Array.from(idSet).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&include_24hr_high_low=true`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return quotes;
    const json = await res.json();

    batch.forEach(({ symbol, ids }) => {
      let entry: {
        usd?: number;
        usd_24h_change?: number;
        usd_24h_high?: number;
        usd_24h_low?: number;
        usd_market_cap?: number;
      } | null = null;
      for (const id of ids) {
        if (json[id]) {
          entry = json[id];
          break;
        }
      }
      if (!entry || entry.usd === undefined) return;
      quotes.push({
        symbol: symbol.toUpperCase(),
        last: entry.usd,
        change: ((entry.usd_24h_change ?? 0) / 100) * (entry.usd ?? 0),
        changePct: entry.usd_24h_change ?? 0,
        high24h: entry.usd_24h_high,
        low24h: entry.usd_24h_low,
        marketCap: entry.usd_market_cap,
        assetClass: 'crypto',
        source: 'coingecko',
      });
    });
    return quotes;
  } catch {
    return quotes;
  }
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const symbolsParam = params.get('symbols');
  if (!symbolsParam) {
    return NextResponse.json({ error: 'symbols query required' }, { status: 400 });
  }
  const symbols = Array.from(new Set(symbolsParam.split(',').map((s) => normalizeSymbol(s)).filter(Boolean)));

  const equities: string[] = [];
  const cryptoBatch: BatchMap[] = [];

  symbols.forEach((sym) => {
    const upper = sym.toUpperCase();
    const isCrypto = upper.endsWith('-USD') || COINGECKO_MAP[upper];
    if (isCrypto) {
      const ids = COINGECKO_MAP[upper];
      if (ids) cryptoBatch.push({ symbol: upper, ids: Array.isArray(ids) ? ids : [ids] });
    } else {
      equities.push(upper);
    }
  });

  const [equityQuotesArr, cryptoQuotesArr] = await Promise.all([
    Promise.all(equities.map((e) => fetchEquity(e))).then((qs) => qs.filter((q): q is Quote => Boolean(q))),
    fetchCryptoBatch(cryptoBatch),
  ]);

  const results: Quote[] = [...equityQuotesArr, ...cryptoQuotesArr];
  return NextResponse.json({ quotes: results, fetchedAt: new Date().toISOString() });
}
