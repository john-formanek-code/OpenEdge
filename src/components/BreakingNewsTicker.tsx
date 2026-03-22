'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Zap } from 'lucide-react';

type NewsItem = {
  id: string;
  time: string;
  headline: string;
  isBreaking: boolean;
};

export function BreakingNewsTicker() {
  const [latest, setLatest] = useState<NewsItem | null>(null);
  const [visible, setVisible] = useState(false);

  const triggerAlerts = async (news: any) => {
    const config = JSON.parse(localStorage.getItem('trade_os_notif_config') || '{}');
    
    // 1. Browser Notification
    if (config.browserEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 ${news.isBreaking ? 'URGENT' : 'NEWS'}`, {
        body: news.headline,
        icon: '/favicon.ico'
      });
    }

    // 2. Mobile Webhook
    if (config.webhookEnabled && config.webhookUrl) {
      try {
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **${news.isBreaking ? 'URGENT WIRE' : 'NEW HEADLINE'}**\n> ${news.headline}\n*Source: ${news.source} | ${news.time}*`
          })
        });
      } catch (e) { console.error('Webhook push failed', e); }
    }
  };

  useEffect(() => {
    async function checkNews() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          const urgent = data.news?.find((n: any) => n.isBreaking) || data.news?.[0];
          
          if (urgent && urgent.id !== latest?.id) {
            setLatest(urgent);
            setVisible(true);
            
            // Trigger push if it's breaking OR it's the first time we see this piece
            if (urgent.isBreaking) {
              triggerAlerts(urgent);
            }

            if (!urgent.isBreaking) {
              const timer = setTimeout(() => setVisible(false), 15000);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (e) {
        console.error('Ticker fetch error', e);
      }
    }

    checkNews();
    const id = setInterval(checkNews, 30000); // Check every 30s
    return () => clearInterval(id);
  }, [latest]);

  if (!latest || !visible) return null;

  return (
    <div className={`h-8 flex items-center px-4 transition-all duration-500 animate-in slide-in-from-top ${
      latest.isBreaking 
        ? 'bg-red-600 text-white font-black shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
        : 'bg-zinc-900 text-amber-500 border-b border-zinc-800'
    }`}>
      <div className="flex items-center gap-3 w-full max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex items-center gap-1 shrink-0">
          {latest.isBreaking ? <Zap size={14} className="fill-white animate-pulse" /> : <AlertCircle size={14} />}
          <span className="text-[10px] uppercase tracking-tighter">
            {latest.isBreaking ? 'URGENT WIRE' : 'LATEST HEADLINE'}
          </span>
        </div>
        <div className="h-4 w-px bg-current opacity-30 shrink-0" />
        <div className="flex-1 truncate text-xs uppercase tracking-tight font-mono">
          <span className="opacity-70 mr-2">[{latest.time}]</span>
          {latest.headline}
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="ml-4 text-[9px] hover:underline shrink-0 opacity-50 hover:opacity-100"
        >
          DISMISS [ESC]
        </button>
      </div>
    </div>
  );
}
