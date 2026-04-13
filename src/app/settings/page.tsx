'use client';

import { Shield, Server, Lock, ArrowLeft } from "lucide-react";
import { getDatabaseUrl, isFileDatabaseUrl } from "@/lib/env";
import { useSession } from "@/hooks/useSession";
import Link from "next/link";

export default function SettingsPage() {
  const { isAuthenticated, status } = useSession();
  const isLocalSqlite = false; // Simplified for client transition

  if (status === 'loading') return <div className="h-full bg-black animate-pulse" />;

  if (!isAuthenticated) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center p-10 text-center">
        <div className="max-w-md space-y-6">
          <div className="inline-flex p-6 bg-zinc-900/50 border border-zinc-800 rounded-full mb-4 text-zinc-600">
            <Lock className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-black italic text-white tracking-tight">PROTECTED CONFIGURATION</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            System settings, data exports, and security policies are restricted to authorized personnel. Please enter your terminal credentials to manage this workstation.
          </p>
          <div className="flex gap-4 pt-4 justify-center">
            <Link href="/terminal" className="px-5 py-2.5 bg-zinc-800 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-700 transition">
              Back to Terminal
            </Link>
            <Link href="/login" className="px-5 py-2.5 bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:brightness-110 transition">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col">
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 text-[10px] font-bold text-zinc-600 flex justify-between">
        <span>SYSTEM_CONFIG // SETTINGS</span>
        <span className="text-green-500 font-black">ADMIN_AUTHORIZED</span>
      </div>
      
      <div className="flex-1 p-6 space-y-8 max-w-4xl custom-scrollbar overflow-y-auto">
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-[#1a1a1a] p-4 border border-[#333]">
            <Server className="w-8 h-8 text-[var(--terminal-accent)]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">TERMINAL_SETTINGS</h1>
            <p className="text-[10px] text-zinc-500 font-mono">NODE_ENV: PRODUCTION // ID: OS-ALPHA-01</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Data Management */}
          <div className="border border-[#333] bg-[#050505] flex flex-col">
            <div className="terminal-header">DATA_PERSISTENCE</div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">DB_BACKUP</div>
                  <div className="text-[9px] text-zinc-600">
                    {isLocalSqlite ? "Download raw SQLite image" : "Unavailable for managed/libSQL deployments"}
                  </div>
                </div>
                {isLocalSqlite ? (
                  <a href="/api/backup" className="bg-[#111] border border-[#333] hover:border-[color:var(--terminal-accent)] px-3 py-1 text-[10px] font-bold transition-colors">DL_.DB</a>
                ) : (
                  <button className="bg-[#111] border border-[#333] px-3 py-1 text-[10px] font-bold cursor-not-allowed opacity-50">N/A</button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">JSON_DUMP</div>
                  <div className="text-[9px] text-zinc-600">Export structured research log</div>
                </div>
                <a href="/api/export" className="bg-[#111] border border-[#333] hover:border-[color:var(--terminal-accent)] px-3 py-1 text-[10px] font-bold transition-colors">DL_.JSON</a>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="border border-[#333] bg-[#050505] flex flex-col">
            <div className="terminal-header">SECURITY_POLICIES</div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center opacity-50">
                <div>
                  <div className="text-xs font-bold text-white">PASSWORD_PROTECT</div>
                  <div className="text-[9px] text-zinc-600">Change terminal access key</div>
                </div>
                <button className="bg-[#111] border border-[#333] px-3 py-1 text-[10px] font-bold cursor-not-allowed font-mono">LOCKED</button>
              </div>
              <div className="bg-[#111] p-3 border border-[#333] rounded">
                <div className="text-[9px] text-green-500 font-black mb-1 flex items-center">
                  <Shield className="w-2.5 h-2.5 mr-1" /> SESSION_ACTIVE
                </div>
                <div className="text-[8px] text-zinc-600 leading-tight">
                  Your session is authenticated. Administrative actions are enabled.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#333] p-4 bg-[#0a0a0a]">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4">Core Modules Status</h4>
          <div className="grid grid-cols-4 gap-4 text-center">
            {['OMS', 'RISK', 'ANAL', 'LAB'].map(m => (
              <div key={m} className="border border-[#222] p-2">
                <div className="text-green-500 text-[10px] font-black">{m}</div>
                <div className="text-[8px] text-zinc-700 font-mono">v2.0.4</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
