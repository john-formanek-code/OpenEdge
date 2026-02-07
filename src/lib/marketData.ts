type StooqQuote = {
  symbol: string;
  date: string;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Quote = {
  symbol: string;
  last: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePct: number;
  updatedAt: string;
};

function toQuote(stooq: StooqQuote): Quote {
  const change = stooq.close - stooq.open;
  const changePct = stooq.open ? (change / stooq.open) * 100 : 0;
  return {
    symbol: stooq.symbol.replace('.US', '').toUpperCase(),
    last: stooq.close,
    open: stooq.open,
    high: stooq.high,
    low: stooq.low,
    volume: stooq.volume,
    change,
    changePct,
    updatedAt: `${stooq.date} ${stooq.time}`,
  };
}

async function fetchStooq(symbol: string): Promise<Quote | null> {
  const formatted = symbol.toLowerCase().endsWith('.us') ? symbol.toLowerCase() : `${symbol.toLowerCase()}.us`;
  const url = `https://stooq.pl/q/l/?s=${formatted}&f=sd2t2ohlcv&h&e=json`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { symbols?: StooqQuote[] };
  const first = json.symbols?.[0];
  if (!first || first.close === 0 || Number.isNaN(first.close)) return null;
  return toQuote(first);
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  const results = await Promise.all(symbols.map(fetchStooq));
  return results.filter((q): q is Quote => Boolean(q));
}
