'use client';

import { useEffect, useMemo, useState } from 'react';

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
  assetClass?: 'equity' | 'crypto';
  source?: 'stooq' | 'coingecko';
};

const DEFAULT_SYMBOLS = [
  'BTC-USD',
  'ETH-USD',
  'BNB-USD',
  'XMR-USD',
  'ZEC-USD',
  'TAO-USD',
  'SOL-USD',
  'LTC-USD',
  'HYPE-USD',
  'AVAX-USD',
  'LINK-USD',
  'XRP-USD',
  'SUI-USD',
  'TRX-USD',
  'ADA-USD',
  'ENA-USD',
  'DOGE-USD',
  'TRUMP-USD',
  'VIRTUAL-USD',
  'WLD-USD',
  'WIF-USD',
  'FARTCOIN-USD',
  'WLFI-USD',
  'MON-USD',
  'PENGU-USD',
  'PUMP-USD',
  'PEPE-USD',
  // Keep a few equities to exercise filtering by asset class
  'AAPL',
  'MSFT',
  'TSLA',
];

export function WatchlistBoard() {
  const [symbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [input, setInput] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [searchText, setSearchText] = useState('');
  const [appliedLabel, setAppliedLabel] = useState('ALL');
  const [pulse, setPulse] = useState(false);

  const fetchQuotes = async (list: string[]) => {
    if (list.length === 0) {
      setQuotes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(list.join(','))}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Quote fetch failed');
      const normalized = (json.quotes || []).map((q: Quote) => {
        const hasAsset = q.assetClass;
        let assetClass = q.assetClass;
        if (!hasAsset) {
          assetClass = q.symbol.includes('-') ? 'crypto' : 'equity';
        }
        return { ...q, assetClass };
      });
      setQuotes(normalized);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes(symbols);
    const id = setInterval(() => fetchQuotes(symbols), 15000);
    return () => clearInterval(id);
  }, [symbols]);

  useEffect(() => {
    if (!selected && quotes.length > 0) {
      setSelected(quotes[0]);
    }
  }, [quotes, selected]);

  const filtered = useMemo(() => {
    let rows = quotes;
    const term = searchText.trim().toUpperCase();
    if (term === '' || term === 'ALL') {
      return rows;
    }
    if (term === 'CRYPTO') {
      rows = rows.filter((q) => q.assetClass === 'crypto');
    } else if (['EQUITY', 'EQUITIES', 'STOCK', 'STOCKS', 'EQ'].includes(term)) {
      rows = rows.filter((q) => q.assetClass === 'equity');
    } else if (term.length > 0) {
      rows = rows.filter((q) => q.symbol.toUpperCase().includes(term));
    }
    return rows;
  }, [searchText, quotes]);

  useEffect(() => {
    if (filtered.length === 0) return;
    const stillVisible = selected && filtered.some((q) => q.symbol === selected.symbol);
    if (!stillVisible) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = input.trim();
    setSearchText(next);
    setAppliedLabel(next === '' ? 'ALL' : next.toUpperCase());
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  const tradingViewLink = (sym: string) => {
    const normalized = sym.replace('-', '');
    return `https://www.tradingview.com/symbols/${normalized}/`;
  };

  return (
    <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-[1px] bg-[var(--bb-border)]">
      <div className="bg-black p-3 flex flex-col">
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-3 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const next = input.trim();
                setSearchText(next);
                setAppliedLabel(next === '' ? 'ALL' : next.toUpperCase());
              }
            }}
            className="bb-input flex-1"
            placeholder=""
          />
        </form>
        <div className="hint-line">
          Active filter:{' '}
          <span className={`text-[var(--bb-amber)] font-bold ${pulse ? 'animate-pulse' : ''}`}>{appliedLabel}</span>{' '}
          · showing {filtered.length}/{quotes.length} ·
          Type CRYPTO, EQUITIES, STOCKS, ALL or a ticker fragment then press Enter (updates in place, no buttons).
        </div>
        {error && <div className="text-[10px] text-[var(--bb-red)] mt-2">{error}</div>}
        {loading && <div className="text-[10px] text-[#888] mt-2">Loading…</div>}
        <div className="flex-1 overflow-auto mt-2">
          <table className="bb-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Last</th>
                <th>Chg</th>
                <th>Chg%</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-[10px] text-[#777] py-4">No instruments match this filter.</td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const pos = q.change >= 0;
                  return (
                    <tr
                      key={q.symbol}
                      className="bb-row cursor-pointer"
                      onClick={() => setSelected(q)}
                    >
                      <td className="font-bold text-[var(--bb-amber)]">{q.symbol}</td>
                      <td className="text-right font-mono">{q.last.toFixed(2)}</td>
                      <td className={`text-right font-mono ${pos ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                        {pos ? '+' : ''}{q.change.toFixed(2)}
                      </td>
                      <td className={`text-right font-mono ${pos ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}`}>
                        {pos ? '+' : ''}{q.changePct.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-black p-4 space-y-3">
        <h3 className="text-[10px] uppercase text-[#888] tracking-[0.08em]">Detail</h3>
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] text-[#666] uppercase tracking-[0.08em]">Instrument</div>
                <div className="text-xl font-black text-white">{selected.symbol}</div>
              </div>
              <a
                href={tradingViewLink(selected.symbol)}
                target="_blank"
                rel="noreferrer"
                className="bb-button h-8 px-3"
              >
                Open Chart
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px] font-mono">
              <div>Last: {selected.last.toFixed(2)}</div>
              <div className={selected.change >= 0 ? 'text-[var(--bb-green)]' : 'text-[var(--bb-red)]'}>
                Δ {selected.change >= 0 ? '+' : ''}{selected.change.toFixed(2)} ({selected.changePct >= 0 ? '+' : ''}{selected.changePct.toFixed(2)}%)
              </div>
              {selected.open !== undefined && <div>Open: {selected.open.toFixed(2)}</div>}
              {selected.high !== undefined && <div>High: {selected.high.toFixed(2)}</div>}
              {selected.low !== undefined && <div>Low: {selected.low.toFixed(2)}</div>}
              {selected.high24h !== undefined && <div>24H High: {selected.high24h.toFixed(2)}</div>}
              {selected.low24h !== undefined && <div>24H Low: {selected.low24h.toFixed(2)}</div>}
              {selected.volume !== undefined && <div>Volume: {selected.volume.toLocaleString()}</div>}
              {selected.marketCap !== undefined && <div>Market Cap: {selected.marketCap.toLocaleString()}</div>}
              {selected.assetClass && <div>Asset Class: {selected.assetClass.toUpperCase()}</div>}
              {selected.source && <div>Source: {selected.source}</div>}
            </div>
            <div className="text-[10px] text-[#888]">
              Tip: numbers update every 15s. Click another row to focus it.
            </div>
          </div>
        ) : (
          <div className="text-[10px] text-[#666]">Select a symbol from the left pane.</div>
        )}
        <div className="bb-divider" />
        <h3 className="text-[10px] uppercase text-[#888] tracking-[0.08em]">Keyboard & Command Tips</h3>
        <ul className="text-[10px] text-[#aaa] space-y-1">
          <li>Type symbols in the header command: <span className="text-[var(--bb-amber)] font-bold">WATCH GO</span></li>
          <li>Filter locally: type CRYPTO / EQUITIES / STOCKS / ALL or a ticker fragment above and hit Enter.</li>
          <li>Supports equities via Stooq (AAPL, MSFT, TSLA…) and crypto via CoinGecko (BTC-USD, ETH-USD, SOL-USD, PEPE-USD…).</li>
        </ul>
      </div>
    </div>
  );
}
