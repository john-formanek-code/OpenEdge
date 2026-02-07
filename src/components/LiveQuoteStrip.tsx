import Link from "next/link";
import { getQuotes } from "@/lib/marketData";

type Props = {
  symbols?: string[];
  view?: string;
};

export async function LiveQuoteStrip({ symbols = ["SPY", "QQQ", "AAPL", "MSFT", "TSLA", "NVDA"], view }: Props) {
  const quotes = await getQuotes(symbols);

  return (
    <div className="live-strip custom-scrollbar">
      {quotes.length === 0 ? (
        <span className="text-[10px] text-[#666]">Live quotes temporarily unavailable</span>
      ) : (
        quotes.map((q) => {
          const pos = q.change >= 0;
          const params = new URLSearchParams();
          if (view) params.set("view", view);
          params.set("load", q.symbol);
          const href = `/?${params.toString()}`;
          return (
            <Link key={q.symbol} className="live-quote hover:border-[var(--bb-amber)]" href={href} prefetch={false}>
              <span className="ticker">{q.symbol}</span>
              <span className="keycode">{q.symbol.includes('-') ? 'CR' : 'EQ'}</span>
              <span className="last">{q.last.toFixed(2)}</span>
              <span className={`chg ${pos ? "text-[var(--bb-green)]" : "text-[var(--bb-red)]"}`}>
                {pos ? "+" : ""}
                {q.change.toFixed(2)} ({q.changePct.toFixed(2)}%)
              </span>
            </Link>
          );
        })
      )}
    </div>
  );
}
