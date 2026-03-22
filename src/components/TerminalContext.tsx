'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TerminalContextType {
  focusedTicker: string | null;
  setFocusedTicker: (ticker: string) => void;
  terminalTheme: 'bloomberg' | 'classic';
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

function TerminalInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [focusedTicker, _setFocusedTicker] = useState<string | null>(null);

  // Sync with URL 'load' param on mount or change
  useEffect(() => {
    const load = searchParams.get('load');
    if (load) _setFocusedTicker(load.toUpperCase());
  }, [searchParams]);

  const setFocusedTicker = useCallback((ticker: string) => {
    const upper = ticker.toUpperCase();
    _setFocusedTicker(upper);
    
    const params = new URLSearchParams(window.location.search);
    params.set('load', upper);
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, []);

  return (
    <TerminalContext.Provider value={{ 
      focusedTicker, 
      setFocusedTicker,
      terminalTheme: 'bloomberg'
    }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <TerminalInner>
        {children}
      </TerminalInner>
    </Suspense>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
