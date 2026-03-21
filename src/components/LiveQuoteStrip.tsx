import Link from "next/link";
import { getQuotes } from "@/lib/marketData";

type Props = {
  symbols?: string[];
  view?: string;
};

const DEFAULT_SYMBOLS = [
  "SPY", "QQQ", "IWM", "AAPL", "MSFT", "TSLA", "NVDA", "AMD", "META", "GOOGL", "AMZN",
  "BTC-USD", "ETH-USD", "SOL-USD", "PEPE-USD", "SUI-USD", "TAO-USD", "XRP-USD", "ADA-USD"
];

export async function LiveQuoteStrip({ symbols = DEFAULT_SYMBOLS, view }: Props) {
  const quotes = await getQuotes(symbols);

  if (quotes.length === 0) {
    return (
      <div className="live-strip flex items-center justify-center">
        <span className="text-[10px] text-[#666]">Live quotes temporarily unavailable</span>
      </div>
    );
  }

  // Double the content for seamless marquee effect
  const marqueeItems = [...quotes, ...quotes];

  return (
    <div className="live-strip">
      <div className="marquee-content">
        {marqueeItems.map((q, idx) => {
          const pos = q.change >= 0;
          const params = new URLSearchParams();
          if (view) params.set("view", view);
          params.set("load", q.symbol);
          const href = `/?${params.toString()}`;
          return (
            <Link key={`${q.symbol}-${idx}`} className="live-quote hover:border-[var(--bb-amber)]" href={href} prefetch={false}>
              <span className="ticker">{q.symbol}</span>
              <span className="keycode">{q.symbol.includes('-') ? 'CR' : 'EQ'}</span>
              <span className="last">{(q.last ?? 0).toFixed(2)}</span>
              <span className={`chg ${pos ? "text-[var(--bb-green)]" : "text-[var(--bb-red)]"}`}>
                {pos ? "+" : ""}
                {(q.change ?? 0).toFixed(2)} ({(q.changePct ?? 0).toFixed(2)}%)
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
