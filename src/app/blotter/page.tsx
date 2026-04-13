import { getBlotter, getEquitySummary } from "@/lib/actions/hypotheses";

export default async function BlotterPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const data = await getBlotter();
  const equity = await getEquitySummary();

  return (
    <div className="h-full flex flex-col bg-black">
      
      {/* Module Header */}
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 flex items-center justify-between text-[10px] font-bold">
        <div className="flex space-x-4">
          <span className="text-[var(--terminal-accent)]">EXEC_BLOTTER</span>
        </div>
        <div className="text-zinc-500 font-mono">ACCOUNT_BAL: ${equity.balance.toLocaleString()}</div>
      </div>

      <div className="flex-1 bg-[#222] overflow-hidden p-[1px]">
        
        {/* Main Log Area */}
        <div className="h-full bg-black flex flex-col min-h-0">
          <div className="terminal-header flex justify-between items-center">
            <span>TRANSACTION_LOG • N={data.length}</span>
            <a href="/api/blotter/export" className="bg-[#111] hover:bg-[#1a1a1a] border border-[#333] hover:border-[var(--terminal-accent)] px-2 py-0.5 text-[9px] font-bold text-zinc-300 transition-colors cursor-pointer uppercase">
              EXPORT_CSV
            </a>
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
                    <td className="p-2 font-bold text-white uppercase">{exec.symbol}</td>
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
      </div>
    </div>
  );
}
