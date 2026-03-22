'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTerminal } from './TerminalContext';

export function TerminalHeader() {
  const router = useRouter();
  const { setFocusedTicker } = useTerminal();
  const [command, setCommand] = useState('');
  const [nyTime, setNyTime] = useState('—:—:—');
  const [ldnTime, setLdnTime] = useState('—:—:—');
  const [latency, setLatency] = useState<number | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

    const tick = () => {
      setNyTime(fmt('America/New_York'));
      setLdnTime(fmt('Europe/London'));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Heartbeat for data/connection latency
  useEffect(() => {
    let stopped = false;
    const probe = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/health', { cache: 'no-store' }).catch(() => fetch('/api/heartbeat', { cache: 'no-store' }));
        if (stopped) return;
        const ok = res?.ok ?? false;
        const ms = Math.round(performance.now() - start);
        setConnected(ok);
        setLatency(ms);
      } catch {
        if (!stopped) {
          setConnected(false);
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

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = command.toUpperCase().trim().split(' ');
    const prefix = parts[0];
    const arg = parts[1];

    switch (prefix) {
      case 'DASH': router.push('/'); break;
      case 'OMS':
        if (arg) {
          router.push(`/hypothesis/${arg}?tab=oms`);
        } else {
          router.push('/blotter');
        }
        break;
      case 'RISK': router.push('/?view=risk'); break;
      case 'ANAL': router.push('/lab?tab=performance'); break;
      case 'LAB': router.push('/lab'); break;
      case 'JRNL': router.push('/blotter?view=journal'); break;
      case 'WATCH': router.push('/watch'); break;
      case 'HEAT': router.push('/?search=HEAT'); break; // Logic to trigger panel open via URL or state
      case 'ECO': router.push('/?search=ECO'); break;
      case 'SET': router.push('/settings'); break;
      case 'HELP': router.push('/help'); break;
      default: 
        if (prefix.length > 0) {
          setFocusedTicker(prefix);
          router.push(`/?search=${prefix}`);
        }
    }
    setCommand('');
  };

  // Keyboard shortcuts for HELP and ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        router.push('/help');
      }
      if (e.key === 'Escape') {
        setCommand('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return (
    <header className="terminal-chrome h-12 border-b border-[color:var(--bb-border)] flex items-center px-3 justify-between shrink-0 select-none relative overflow-hidden">
      <div className="flex items-center flex-1 space-x-3 relative z-10">
        <div className="flex items-center px-3 py-1.5 border border-[color:var(--bb-border)] bg-[#0c0c0c] shadow-[inset_0_0_0_1px_#111] rounded-sm">
          <span className="text-[9px] text-[#777] font-black tracking-[0.08em]">TRADE//OS</span>
          <span className="ml-2 text-[var(--bb-amber)] font-black text-xs">GO</span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 text-[10px] uppercase tracking-[0.08em] text-[#9c9c9c]">
          <span className="status-led on" aria-label="data link" />
          <span className="font-bold text-white">LIVE</span>
          <span className="text-[#666]">|</span>
          <span>USER PRIME</span>
          <span>·</span>
          <span>ENV PROD</span>
        </div>

        <form onSubmit={handleCommand} className="flex-1 flex items-center bg-black border border-[color:var(--bb-border)] px-3 py-1.5 shadow-[inset_0_0_0_1px_#0f0f0f] max-w-3xl">
          <span className="text-[var(--bb-amber)] font-black text-sm mr-2">{'>'}</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="w-full bg-transparent text-[var(--bb-amber)] text-xs font-black uppercase focus:outline-none placeholder-[#333]"
            placeholder="Enter mnemonic (e.g., AAPL GO, RISK GO, P2 NEWS GO)"
            autoFocus
          />
        </form>
      </div>

      <div className="flex items-center space-x-4 text-[9px] font-mono text-[#c2c2c2] relative z-10">
        <div className="flex items-center space-x-2 pr-4 border-r border-[color:var(--bb-border)]">
          <span className="bb-chip text-[9px] h-5 border-[color:var(--bb-border)] text-[var(--bb-amber)]">IB LINK</span>
          <span className={`font-bold ${connected === false ? 'text-[var(--bb-red)]' : 'text-[var(--bb-green)]'}`}>
            {connected === false ? 'DOWN' : 'UP'}
          </span>
          <span className="text-[#777]">DATA</span>
          <span className="text-[#9e9e9e]">{latency !== null ? `${latency}ms` : '…'}</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="text-[var(--bb-amber)] font-black blink">{nyTime} NY</span>
          <span className="text-[#9e9e9e]">{ldnTime} LDN</span>
        </div>
      </div>

      <div className="noise-overlay pointer-events-none" aria-hidden />
    </header>
  );
}
