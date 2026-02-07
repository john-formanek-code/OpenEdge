import { getBlotter, getEquitySummary, getBehavioralStats } from "@/lib/actions/hypotheses";
import { BehavioralDashboard } from "@/components/BehavioralDashboard";

export default async function BlotterPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const isJournal = params.view === 'journal';
  const data = await getBlotter();
  const equity = await getEquitySummary();
  const behavior = await getBehavioralStats();

  return (
    <div className="h-full flex flex-col bg-black">
      
      {/* Module Header */}
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 flex items-center justify-between text-[10px] font-bold">
        <div className="flex space-x-4">
          <span className={!isJournal ? 'text-[var(--terminal-accent)]' : 'text-zinc-600'}>1. EXEC_BLOTTER</span>
          <span className={isJournal ? 'text-[var(--terminal-accent)]' : 'text-zinc-600'}>2. BEHAVIOR_JRNL</span>
        </div>
        <div className="text-zinc-500 font-mono">ACCOUNT_BAL: ${equity.balance.toLocaleString()}</div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-[1px] bg-[#222] overflow-hidden p-[1px]">
        
        {/* Main Log Area */}
        <div className={`${isJournal ? 'col-span-8' : 'col-span-12'} bg-black flex flex-col min-h-0`}>
          <div className="terminal-header">
            <span>{isJournal ? 'SYSTEM_JOURNAL' : 'TRANSACTION_LOG'} • N={data.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead className="bg-[#050505] text-zinc-600 sticky top-0 border-b border-[#222]">
                <tr>
                  <th className="text-left p-2">TIMESTAMP</th>
                  <th className="text-left p-2">TICKER</th>
                  <th className="text-left p-2">SIDE</th>
                  <th className="text-left p-2">PRICE</th>
                  <th className="text-left p-2">SIZE</th>
                  <th className="text-left p-2">FEE</th>
                  <th className="text-right p-2 pr-4">ID</th>
                </tr>
              </thead>
              <tbody>
                {data.map((exec) => (
                  <tr key={exec.id} className="border-b border-[#111] hover:bg-[#0a0a0a] transition-colors group">
                    <td className="p-2 text-zinc-500 italic">{exec.executedAt?.toLocaleString()}</td>
                    <td className="p-2 font-bold text-white uppercase">{exec.hypothesisId.slice(0,4)}...</td>
                    <td className={`p-2 font-black ${exec.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {exec.side.toUpperCase()}
                    </td>
                    <td className="p-2 text-[#e5e5e5]">${exec.price.toLocaleString()}</td>
                    <td className="p-2 text-zinc-400">{exec.size}</td>
                    <td className="p-2 text-zinc-600">${exec.fee?.toFixed(2)}</td>
                    <td className="p-2 pr-4 text-right">
                      <a href={`/hypothesis/${exec.hypothesisId}`} className="text-[#333] group-hover:text-[var(--terminal-accent)]">VUE</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Behavioral Sidebar (Only in JRNL view) */}
        {isJournal && (
          <div className="col-span-4 bg-black flex flex-col min-h-0 border-l border-[#333]">
            <div className="terminal-header">
              <span>BEHAVIORAL_METRICS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <BehavioralDashboard stats={behavior} />
              
              <div className="border border-[#222] p-4 bg-[#050505]">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-2">Rule Violation Log</h4>
                <div className="space-y-2">
                  <div className="text-[9px] flex justify-between">
                    <span className="text-red-500 font-bold">FOMO_ENTRY</span>
                    <span className="text-zinc-600">14:02 BTC</span>
                  </div>
                  <div className="text-[9px] flex justify-between">
                    <span className="text-orange-500 font-bold">HESITATION</span>
                    <span className="text-zinc-600">09:15 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
