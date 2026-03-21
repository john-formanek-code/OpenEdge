'use client';

import { useState, useEffect } from 'react';
import { Lock, Timer } from 'lucide-react';

type ProximityEvent = { id?: string; name: string; impact: string; startTime: Date };

export function EventProximityLock({ events = [] }: { events: ProximityEvent[] }) {
  const [locked, setLocked] = useState(false);
  const [nextEvent, setNextEvent] = useState<ProximityEvent | null>(null);

  useEffect(() => {
    const checkLocks = () => {
      const now = new Date().getTime();
      const upcoming = events.find(e => {
        const diff = e.startTime.getTime() - now;
        return diff > 0 && diff < (30 * 60 * 1000); // 30 min lock
      });
      
      if (upcoming) {
        setLocked(true);
        setNextEvent(upcoming);
      } else {
        setLocked(false);
        setNextEvent(null);
      }
    };

    checkLocks();
    const interval = setInterval(checkLocks, 60000);
    return () => clearInterval(interval);
  }, [events]);

  if (!locked || !nextEvent) return null;

  return (
    <div className="bg-orange-950/20 border border-orange-900/50 p-4 rounded-xl mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="bg-orange-500 p-2 rounded-lg">
          <Lock className="w-5 h-5 text-black" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-orange-400 uppercase tracking-tight">Entry Lock Active</h4>
          <p className="text-xs text-orange-300 opacity-80">
            {nextEvent.name} ({nextEvent.impact.toUpperCase()}) starting soon. Volatility protection engaged.
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-white flex items-center">
            <Timer className="w-3 h-3 mr-1" />
            {( (nextEvent.startTime.getTime() - new Date().getTime()) / 60000 ).toFixed(0)}m
          </div>
          <div className="text-[9px] text-orange-500 uppercase font-bold">To Event</div>
        </div>
        <button className="text-[10px] bg-orange-900/40 hover:bg-orange-900/60 text-orange-200 px-3 py-1 rounded border border-orange-800 transition-colors">
          OVERRIDE
        </button>
      </div>
    </div>
  );
}
