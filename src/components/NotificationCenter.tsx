'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Send, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const NOTIF_KEY = 'trade_os_notif_config';

export function NotificationCenter() {
  const [config, setConfig] = useState({
    browserEnabled: false,
    webhookUrl: '',
    webhookEnabled: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(NOTIF_KEY);
    if (stored) setConfig(JSON.parse(stored));
  }, []);

  const saveConfig = (newConfig: typeof config) => {
    setConfig(newConfig);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(newConfig));
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser does not support notifications');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      saveConfig({ ...config, browserEnabled: true });
      new Notification('TRADE//OS', { body: 'System notifications active.' });
    }
  };

  const testWebhook = async () => {
    if (!config.webhookUrl) return;
    try {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '🔔 **TRADE//OS TEST ALERT**: Mobile notifications are correctly configured.'
        })
      });
      if (res.ok) toast.success('Test alert sent to mobile!');
      else toast.error('Webhook failed. Check URL.');
    } catch (e) {
      toast.error('Network error during webhook test.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-black font-mono">
      <div className="text-[10px] text-zinc-500 font-bold p-2 border-b border-zinc-800 uppercase bg-[#050505] flex justify-between items-center shrink-0">
        <span>ALRT - Notification Center</span>
        <div className="flex gap-2 text-[9px]">
          <span className={`px-1 border ${config.browserEnabled || config.webhookEnabled ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50'}`}>
            {config.browserEnabled || config.webhookEnabled ? 'ARMED' : 'DISARMED'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Browser Notifications */}
        <div className="border border-zinc-900 bg-[#050505] p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase flex items-center gap-2">
                <Bell size={14} className="text-amber-500" />
                Browser Alerts
              </h3>
              <p className="text-[9px] text-zinc-500 mt-1 uppercase">Desktop push for breaking news</p>
            </div>
            <button 
              onClick={config.browserEnabled ? () => saveConfig({...config, browserEnabled: false}) : requestPermission}
              className={`h-7 px-3 text-[10px] font-black border transition-colors ${
                config.browserEnabled ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {config.browserEnabled ? 'ENABLED' : 'ACTIVATE'}
            </button>
          </div>
          <div className="text-[8px] text-zinc-600 leading-tight">
            * REQUIRES BROWSER PERMISSION. WORKS WHILE TERMINAL IS OPEN IN BACKGROUND.
          </div>
        </div>

        {/* Mobile Webhooks */}
        <div className="border border-zinc-900 bg-[#050505] p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-white uppercase flex items-center gap-2">
                <Smartphone size={14} className="text-amber-500" />
                Mobile Push (Discord/Slack)
              </h3>
              <p className="text-[9px] text-zinc-500 mt-1 uppercase">Instant alerts to your phone</p>
            </div>
            <button 
              onClick={() => saveConfig({...config, webhookEnabled: !config.webhookEnabled})}
              className={`h-7 px-3 text-[10px] font-black border transition-colors ${
                config.webhookEnabled ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              {config.webhookEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] text-zinc-600 font-bold uppercase">Webhook URL</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={config.webhookUrl}
                  onChange={(e) => saveConfig({...config, webhookUrl: e.target.value})}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 bg-black border border-zinc-800 text-[10px] text-zinc-300 p-1.5 outline-none focus:border-amber-500/50 font-mono"
                />
                <button 
                  onClick={testWebhook}
                  className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-500 hover:text-white transition-colors"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
            <div className="text-[8px] text-zinc-600 leading-tight uppercase">
              How to: Create a Discord channel &gt; Integrations &gt; Webhooks &gt; Copy URL. Install Discord on phone to receive push.
            </div>
          </div>
        </div>

        <div className="p-4 border border-dashed border-zinc-800 text-center">
           <div className="text-[10px] text-zinc-500 font-bold mb-2 uppercase">Trigger Rules</div>
           <div className="text-[9px] text-zinc-600 uppercase">
             Alerts are currently mapped to <span className="text-red-500">Breaking News</span> and <span className="text-amber-500">Position Fill</span> events.
           </div>
        </div>
      </div>
    </div>
  );
}
