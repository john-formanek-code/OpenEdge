'use client';

import { useState } from 'react';
import { updateHypothesisState } from '@/lib/actions/hypotheses';
import { toast } from 'sonner';
import { ChevronRight, PlayCircle, Lock, Flag, FileCheck } from 'lucide-react';

const states = [
  { id: 'idea', label: 'Idea', icon: PlayCircle, color: 'text-zinc-500' },
  { id: 'planned', label: 'Planned', icon: Lock, color: 'text-blue-400' },
  { id: 'entered', label: 'Entered', icon: ChevronRight, color: 'text-orange-400' },
  { id: 'managed', label: 'Managed', icon: ActivityCircle, iconOverride: true }, // Using Activity icon
  { id: 'exited', label: 'Exited', icon: Flag, color: 'text-red-400' },
  { id: 'reviewed', label: 'Reviewed', icon: FileCheck, color: 'text-green-400' },
];

import { Activity as ActivityCircle } from 'lucide-react';

export function StateSwitcher({ hypothesisId, currentState }: { hypothesisId: string, currentState: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleTransition(newState: string) {
    const reason = window.prompt(`Reason for transition to ${newState.toUpperCase()}:`);
    if (reason === null) return;

    setIsPending(true);
    try {
      await updateHypothesisState(hypothesisId, newState, reason || 'Manual transition');
      toast.success(`State updated to ${newState}`);
    } catch {
      toast.error('Transition failed');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center space-x-1 bg-[#0a0a0a] border border-[color:var(--bb-border)] px-2 py-1">
      {states.map((s, i) => {
        const isActive = currentState === s.id;
        const Icon = s.icon;
        return (
          <div key={s.id} className="flex items-center space-x-1">
            <button
              disabled={isPending}
              onClick={() => handleTransition(s.id)}
              className={`flex items-center space-x-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.06em] border ${
                isActive 
                  ? 'bg-[var(--terminal-accent)] text-black border-[color:var(--terminal-accent)]' 
                  : 'text-zinc-500 border-[color:var(--bb-border)] hover:text-zinc-200 hover:border-[color:var(--terminal-accent)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : s.color}`} />
              <span>{s.label}</span>
            </button>
            {i < states.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-800" />}
          </div>
        );
      })}
    </div>
  );
}
