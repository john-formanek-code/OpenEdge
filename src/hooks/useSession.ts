'use client';

import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState<{ user: string } | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    async function checkSession() {
      try {
        // We'll use a new lightweight endpoint or just check cookies/metadata
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setSession(data);
            setStatus('authenticated');
            return;
          }
        }
        setSession(null);
        setStatus('unauthenticated');
      } catch {
        setSession(null);
        setStatus('unauthenticated');
      }
    }
    checkSession();
  }, []);

  return { session, status, isAuthenticated: status === 'authenticated' };
}
