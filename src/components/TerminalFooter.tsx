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
    <footer className="h-6 bg-[#050505] border-t border-[color:var(--bb-border)] flex items-center justify-between px-3 text-[9px] text-[#7a7a7a] uppercase tracking-[0.08em] shrink-0">
      <div className="flex space-x-4 items-center">
        <span>status {status}</span>
        <span>ping {latency !== null ? `${latency}ms` : '—'}</span>
        <span>last {lastBeat}</span>
      </div>
      <div className="flex space-x-3 items-center">
        <span className="text-[var(--bb-amber)] font-black">port</span>
        <span className="bb-chip">2500</span>
      </div>
    </footer>
  );
}
