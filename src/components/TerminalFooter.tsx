'use client';

import { useEffect, useState } from 'react';

export function TerminalFooter() {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<'UP' | 'DOWN' | '...'>('...');
  const [lastBeat, setLastBeat] = useState<string>('---');

  useEffect(() => {
    let stopped = false;
    const probe = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/health', { cache: 'no-store' }).catch(() => fetch('/api/heartbeat', { cache: 'no-store' }));
        if (stopped) return;
        const ok = res?.ok ?? false;
        const ms = Math.round(performance.now() - start);
        setStatus(ok ? 'UP' : 'DOWN');
        setLatency(ms);
        setLastBeat(new Date().toLocaleTimeString());
      } catch {
        if (!stopped) {
          setStatus('DOWN');
          setLatency(null);
        }
      }
    };
    probe();
    const id = setInterval(probe, 15000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, []);

  return (
    <footer className="terminal-chrome h-8 border-t border-[color:var(--bb-border)] flex items-center justify-between px-3 text-[9px] uppercase tracking-[0.08em] shrink-0 relative overflow-hidden">
      <div className="flex space-x-4 items-center text-[#c2c2c2] font-mono">
        <div className="flex items-center space-x-2">
          <span className={`status-led ${status === 'UP' ? 'on' : 'off'}`} aria-label="connection status" />
          <span className="font-bold">IB LINK</span>
          <span className="text-[#777]">/</span>
          <span className="text-[var(--bb-amber)]">DATA</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bb-chip">PING</span>
          <span>{latency !== null ? `${latency}ms` : '—'}</span>
        </div>
        <div className="text-[#8a8a8a]">LAST BEAT {lastBeat}</div>
      </div>
      <div className="flex space-x-3 items-center text-[var(--bb-amber)] font-black">
        <span>PORT 2500</span>
        <span className="text-[#777]">•</span>
        <span className="text-white">FEED STXQ</span>
      </div>
      <div className="noise-overlay pointer-events-none" aria-hidden />
    </footer>
  );
}
