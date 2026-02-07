import { db } from "@/db";
import { marketStates } from "@/db/schema";
import { desc } from "drizzle-orm";
import { UpdateMarketStateDialog } from "./UpdateMarketStateDialog";

export async function MarketState() {
  const latest = await db.select().from(marketStates).orderBy(desc(marketStates.createdAt)).limit(1);
  const state = latest[0] || { regime: 'Unknown', vixProxy: 0, biasSummary: 'N/A' };

  return (
    <div className="text-[10px]">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[#888]">REGIME</div>
        <div className="font-bold text-[var(--bb-amber)] uppercase">{state.regime}</div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-[#888]">VIX</div>
        <div className="font-bold text-white">{state.vixProxy}</div>
      </div>
      <div className="border-t border-[#333] pt-2 mt-2">
        <div className="text-[#888] mb-1">NARRATIVE</div>
        <div className="text-white leading-tight h-12 overflow-hidden text-ellipsis">
          {state.biasSummary}
        </div>
      </div>
      <div className="mt-4 text-center">
        <UpdateMarketStateDialog />
      </div>
    </div>
  );
}