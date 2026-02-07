'use client';

import { History, ShieldCheck } from 'lucide-react';

type AuditLog = {
  id: string;
  createdAt?: Date | string | null;
  changeType: string;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
};

export function AuditLogView({ logs = [] }: { logs: AuditLog[] }) {
  return (
    <div className="bb-card overflow-hidden shadow-[0_0_0_1px_#0f0f0f]">
      <div className="p-4 border-b border-[color:var(--bb-border)] flex items-center justify-between bg-[#0b0b0b]">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.08em] flex items-center">
          <History className="w-4 h-4 mr-2 text-[var(--bb-amber)]" />
          Immutable Audit Trail
        </h3>
        <div className="flex items-center text-[10px] text-zinc-500 bg-black px-2 py-0.5 border border-[color:var(--bb-border)]">
          <ShieldCheck className="w-3 h-3 mr-1 text-[var(--bb-green)]" />
          Tamper-Evident
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 italic text-sm">No audited changes yet.</div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-black/40 text-zinc-500 font-mono uppercase text-[9px] sticky top-0">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Type</th>
                <th className="p-3">Event</th>
                <th className="p-3">Reason / Context</th>
              </tr>
            </thead>
              <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-[color:var(--bb-border)] hover:bg-white/5 transition-colors">
                  <td className="p-3 text-zinc-500 font-mono">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : '--'}
                  </td>
                  <td className="p-3">
                    <span className="bb-chip bg-[#0f0f0f] text-[var(--bb-amber)] border-[color:var(--bb-border)]">
                      {log.changeType.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2 text-zinc-300">
                      <span className="line-through opacity-40">{log.oldValue}</span>
                      <span className="text-zinc-500">→</span>
                      <span className="font-bold text-white">{log.newValue}</span>
                    </div>
                  </td>
                  <td className="p-3 text-zinc-400 italic">
                    {log.reason || 'No reason provided'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
