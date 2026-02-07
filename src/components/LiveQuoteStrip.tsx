import { getQuotes } from "@/lib/marketData";

type Props = {
  symbols?: string[];
};

export async function LiveQuoteStrip({ symbols = ["SPY", "QQQ", "AAPL", "MSFT", "TSLA", "NVDA"] }: Props) {
  const quotes = await getQuotes(symbols);

  return (
    <div className="h-8 bg-[#0b0b0b] border-b border-[color:var(--bb-border)] flex items-center overflow-x-auto px-2 space-x-3 custom-scrollbar">
      {quotes.length === 0 ? (
        <span className="text-[10px] text-[#666]">Live quotes temporarily unavailable</span>
      ) : (
        quotes.map((q) => {
          const pos = q.change >= 0;
          return (
            <div
              key={q.symbol}
              className="flex items-center space-x-2 px-2 py-1 bg-[#050505] border border-[color:var(--bb-border)]"
            >
              <span className="text-[10px] font-black text-[var(--bb-amber)]">{q.symbol}</span>
              <span className="text-[11px] font-mono text-white">{q.last.toFixed(2)}</span>
              <span className={`text-[10px] font-mono ${pos ? "text-[var(--bb-green)]" : "text-[var(--bb-red)]"}`}>
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
