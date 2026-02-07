import { getQuotes } from "@/lib/marketData";

type Props = {
  symbols?: string[];
};

export async function LiveQuoteStrip({ symbols = ["SPY", "QQQ", "AAPL", "MSFT", "TSLA", "NVDA"] }: Props) {
  const quotes = await getQuotes(symbols);

  return (
    <div className="live-strip custom-scrollbar">
      {quotes.length === 0 ? (
        <span className="text-[10px] text-[#666]">Live quotes temporarily unavailable</span>
      ) : (
        quotes.map((q) => {
          const pos = q.change >= 0;
          return (
            <div key={q.symbol} className="live-quote">
              <span className="ticker">{q.symbol}</span>
              <span className="keycode">{q.symbol.includes('-') ? 'CR' : 'EQ'}</span>
              <span className="last">{q.last.toFixed(2)}</span>
              <span className={`chg ${pos ? "text-[var(--bb-green)]" : "text-[var(--bb-red)]"}`}>
                {pos ? "+" : ""}
                {q.change.toFixed(2)} ({q.changePct.toFixed(2)}%)
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
