import { LiveQuoteStrip } from "@/components/LiveQuoteStrip";
import { WatchlistBoard } from "@/components/WatchlistBoard";

export const revalidate = 0;

export default async function WatchPage() {
  return (
    <div className="h-full flex flex-col bg-black">
      <div className="bg-[#0b0b0b] border-b border-[color:var(--bb-border)] px-3 py-1 text-[10px] font-bold flex items-center justify-between">
        <span>WATCHLIST // LIVE QUOTES</span>
        <span className="text-[var(--bb-amber)]">TYPE: SYMBOLS → GO</span>
      </div>
      <LiveQuoteStrip />
      <div className="flex-1 overflow-hidden">
        <WatchlistBoard />
      </div>
    </div>
  );
}
