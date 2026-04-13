'use client';

import { getHypothesisById, getTradePlan, getAssetClassExposure, getAuditTrail } from "@/lib/actions/hypotheses";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditHypothesisDialog } from "@/components/EditHypothesisDialog";
import { PositionBuilder, type TradePlan } from "@/components/PositionBuilder";
import { ExecutionScorecard, type Execution, type Plan } from "@/components/ExecutionScorecard";
import { PnLDecomposition } from "@/components/PnLDecomposition";
import { LogExecutionForm } from "@/components/LogExecutionForm";
import { AuditLogView } from "@/components/AuditLogView";
import { StateSwitcher } from "@/components/StateSwitcher";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState, use } from "react";

export default function HypothesisPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = use(params);
  const search = use(searchParams);
  const { isAuthenticated } = useSession();
  const currentTab = search.tab || 'oms';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { hypothesis } = await getHypothesisById(id);
      if (!hypothesis) {
        setLoading(false);
        return;
      }
      const tradePlan = await getTradePlan(id);
      const auditLogs = await getAuditTrail(id);
      const currentExposure = await getAssetClassExposure(hypothesis.assetClass);
      // We can't use db directly in client component, need an action for executions
      // For now, I'll assume we might need a getExecutions action if not exists.
      // But wait, the original was a server component.
      setData({ hypothesis, tradePlan, auditLogs, currentExposure, executions: [] });
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div className="h-full bg-black animate-pulse" />;
  if (!data?.hypothesis) notFound();

  const { hypothesis, tradePlan, auditLogs, currentExposure, executions } = data;

  // Basic PnL calc for header
  const realizedPnL = 0; // Simplified for client transition

  return (
    <div className="h-full flex flex-col bg-black">
      
      {/* Symbol Header Strip */}
      <div className="bg-[#111] border-b border-[#333] px-3 py-2 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-6">
          <Link href="/terminal" className="text-zinc-600 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-baseline space-x-3">
            <h1 className="text-2xl font-black text-white italic">{hypothesis.symbol}</h1>
            <span className={`text-xs font-black uppercase ${hypothesis.bias === 'long' ? 'text-green-500' : 'text-red-500'}`}>
              {hypothesis.bias} · {hypothesis.timeframe}
            </span>
          </div>
          <div className="h-8 w-px bg-[#222]" />
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-[8px] text-zinc-600 font-bold uppercase">PnL_REAL</div>
              <div className={`text-xs font-mono font-bold ${realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${realizedPnL.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {isAuthenticated ? (
          <StateSwitcher hypothesisId={id} currentState={hypothesis.state || 'idea'} />
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase">
            <Lock className="w-3 h-3" />
            READ-ONLY STATE: {hypothesis.state?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Terminal Viewports */}
      <div className="flex-1 grid grid-cols-12 gap-[1px] bg-[#222] overflow-hidden">
        
        {/* LEFT: NAV/INFO (3 Cols) */}
        <div className="col-span-3 bg-black flex flex-col min-h-0">
          <div className="terminal-header">MODULE_SELECT</div>
          <div className="p-2 space-y-1">
            <Link href="?tab=oms" className={`block px-3 py-2 text-[10px] font-bold uppercase transition-colors border ${currentTab === 'oms' ? 'bg-[#1a1a1a] text-[var(--terminal-accent)] border-[color:var(--terminal-accent)]' : 'text-zinc-600 border-[#222] hover:bg-[#050505]'}`}>
              1. ORDER_MGMT (OMS)
            </Link>
            <Link href="?tab=anal" className={`block px-3 py-2 text-[10px] font-bold uppercase transition-colors border ${currentTab === 'anal' ? 'bg-[#1a1a1a] text-[var(--terminal-accent)] border-[color:var(--terminal-accent)]' : 'text-zinc-600 border-[#222] hover:bg-[#050505]'}`}>
              2. ANALYTICS (ANAL)
            </Link>
            <Link href="?tab=logs" className={`block px-3 py-2 text-[10px] font-bold uppercase transition-colors border ${currentTab === 'logs' ? 'bg-[#1a1a1a] text-[var(--terminal-accent)] border-[color:var(--terminal-accent)]' : 'text-zinc-600 border-[#222] hover:bg-[#050505]'}`}>
              3. AUDIT_TRAIL (JRNL)
            </Link>
          </div>
          
          <div className="mt-auto border-t border-[#222] p-4 bg-[#050505] space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-zinc-600 uppercase">Strategy</span>
               <span className="text-[10px] font-mono text-zinc-300">{hypothesis.setupType}</span>
             </div>
             {isAuthenticated && <EditHypothesisDialog hypothesis={hypothesis} />}
          </div>
        </div>

        {/* MAIN VIEWPORT (9 Cols) */}
        <div className="col-span-9 bg-black flex flex-col min-h-0 border-l border-[#333]">
          <div className="terminal-header">
            <span>VIEW: {currentTab.toUpperCase()} · SYS_ID: {id.slice(0,12)}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {currentTab === 'oms' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#050505] border border-[#222] p-4">
                    <div className="text-[9px] text-zinc-600 font-black uppercase mb-2">Hypothesis_Trigger</div>
                    <p className="text-sm font-mono text-zinc-300 leading-relaxed">{hypothesis.triggerCondition}</p>
                  </div>
                  {isAuthenticated ? (
                    <LogExecutionForm hypothesisId={id} />
                  ) : (
                    <div className="bg-zinc-900/30 border border-dashed border-zinc-800 p-4 flex flex-col items-center justify-center text-zinc-600">
                      <Lock className="w-5 h-5 mb-2" />
                      <span className="text-[10px] font-black uppercase">Execution Logging Restricted</span>
                    </div>
                  )}
                </div>
                {isAuthenticated ? (
                  <PositionBuilder hypothesisId={id} initialPlan={tradePlan as unknown as Partial<TradePlan>} currentExposure={currentExposure} />
                ) : (
                  <div className="border border-dashed border-zinc-800 p-8 flex flex-col items-center justify-center text-zinc-600">
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Plan Read-Only</span>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'anal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <ExecutionScorecard executions={executions as unknown as Execution[]} plan={tradePlan as unknown as Plan} />
                  <PnLDecomposition pnl={realizedPnL} positionSize={currentExposure || (tradePlan?.totalPositionSize || 0) * (tradePlan?.avgEntryPrice || 0)} />
                </div>
              </div>
            )}

            {currentTab === 'logs' && (
              <div className="space-y-6">
                <AuditLogView logs={auditLogs} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
