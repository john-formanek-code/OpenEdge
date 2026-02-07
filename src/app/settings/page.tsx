import { Shield, Server } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="h-full bg-black flex flex-col">
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 text-[10px] font-bold text-zinc-600">
        SYSTEM_CONFIG // SETTINGS
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
                  <div className="text-[9px] text-zinc-600">Download raw SQLite image</div>
                </div>
                <a href="/api/backup" className="bg-[#111] border border-[#333] hover:border-[color:var(--terminal-accent)] px-3 py-1 text-[10px] font-bold transition-colors">DL_.DB</a>
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
                  Your IP is whitelisted for terminal access. Clear cookies to rotate session.
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
