'use client';

import { AppWindow, Github, Activity, Globe } from "lucide-react";

export default function HubPage() {
  const apps = [
    {
      id: "world-monitor",
      name: "World Monitor",
      description: "Real-time global intelligence dashboard with live news, markets, military tracking, and OSINT.",
      url: "https://www.worldmonitor.app/",
      icon: Globe,
      color: "text-blue-500",
      status: "STABLE",
      width: 1400,
      height: 900
    },
    {
      id: "github",
      name: "GitHub",
      description: "Source code repository and developer workflows.",
      url: "https://github.com/john-formanek-code/OpenEdge",
      icon: Github,
      color: "text-zinc-300",
      status: "CONNECTED",
      width: 1200,
      height: 800
    },
    {
      id: "tradingview",
      name: "TradingView",
      description: "Advanced charting and market screening.",
      url: "https://www.tradingview.com/chart",
      icon: Activity,
      color: "text-[var(--bb-amber)]",
      status: "STABLE",
      width: 1600,
      height: 1000
    }
  ];

  const launchApp = (app: typeof apps[0]) => {
    // Generate window features string
    const top = (Intl ? window.screen.height / 2 - app.height / 2 : 0);
    const left = (Intl ? window.screen.width / 2 - app.width / 2 : 0);
    const features = `width=${app.width},height=${app.height},top=${top},left=${left},popup=yes,menubar=no,toolbar=no,location=no,status=no`;

    window.open(app.url, app.id, features);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      {/* Module Header */}
      <div className="bg-[#111] border-b border-[#333] px-3 py-1 flex items-center justify-between text-[10px] font-bold">
        <div className="flex space-x-4 items-center">
          <AppWindow className="w-3 h-3 text-[var(--terminal-accent)]" />
          <span className="text-[var(--terminal-accent)]">APP_HUB</span>
          <span className="text-zinc-600">EXTERNAL_INTEGRATIONS</span>
        </div>
        <div className="text-zinc-500 font-mono">STATUS: ONLINE</div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black italic tracking-tighter text-white mb-2 uppercase">External Integration Hub</h1>
            <p className="text-zinc-400 text-xs max-w-2xl">
              Launch dedicated popup environments for tightly secured 3rd-party intelligence and development platforms. 
              These windows operate outside the core Terminal DOM to bypass iframe constraints while feeling like native windows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <div 
                key={app.id}
                onClick={() => launchApp(app)}
                className="group relative border border-[#333] hover:border-[var(--bb-amber)] bg-black p-5 cursor-pointer transition-all hover:bg-[#0a0a0a]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 border border-[#222] bg-[#111] group-hover:border-[var(--bb-amber)] transition-colors">
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-[#666] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {app.status}
                  </div>
                </div>
                
                <h3 className="text-sm font-black text-zinc-200 mb-1 tracking-tight group-hover:text-white">{app.name}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4 min-h-[40px]">{app.description}</p>
                
                <div className="flex items-center text-[9px] font-bold text-zinc-600 group-hover:text-[var(--bb-amber)] uppercase tracking-wide">
                  <span>Launch Instance</span>
                  <Activity className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#555] group-hover:border-[var(--bb-amber)]" />
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-[#555] group-hover:border-[var(--bb-amber)]" />
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-[#555] group-hover:border-[var(--bb-amber)]" />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[#555] group-hover:border-[var(--bb-amber)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
