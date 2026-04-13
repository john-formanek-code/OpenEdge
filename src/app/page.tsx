'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, Github, Terminal, Shield, Zap, Globe, BarChart3 } from "lucide-react";

export default function HomePage() {
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full overflow-hidden bg-black text-white selection:bg-amber-500/30 font-mono">
      <section className="relative h-full flex items-center justify-center px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,40,0.15),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(35,120,255,0.1),transparent_40%),linear-gradient(180deg,#020202_0%,#080808_50%,#000000_100%)]" />
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Moving scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <div className="w-full h-[2px] bg-white/20 absolute top-0 animate-[scanline_8s_linear_infinite]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl border border-zinc-800/50 bg-black/40 backdrop-blur-3xl p-8 md:p-12 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)]">
          
          {/* Boot Sequence */}
          <div className="mb-12 space-y-1 h-24 overflow-hidden">
            <p className={`text-[10px] ${bootStep >= 1 ? 'text-zinc-500' : 'opacity-0'}`}>[ OK ] INITIALIZING_CORE_KERNELS...</p>
            <p className={`text-[10px] ${bootStep >= 2 ? 'text-zinc-500' : 'opacity-0'}`}>[ OK ] SYNCING_MARKET_TICK_STREAM...</p>
            <p className={`text-[10px] ${bootStep >= 3 ? 'text-zinc-500' : 'opacity-0'}`}>[ OK ] HYPOTHESIS_ENGINE_ONLINE...</p>
            <p className={`text-[10px] ${bootStep >= 4 ? 'text-zinc-500' : 'opacity-0'}`}>[ OK ] ESTABLISHING_SECURE_TUNNEL...</p>
            <p className={`text-[10px] ${bootStep >= 5 ? 'text-amber-500 font-bold' : 'opacity-0'}`}>READY: OPEN_EDGE_V1.0.0_PRODUCTION</p>
          </div>

          <div className={`transition-all duration-1000 ${bootStep >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-amber-500 flex items-center justify-center rounded-sm">
                 <Terminal className="w-4 h-4 text-black stroke-[3]" />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 font-black">OpenEdge Research Station</p>
            </div>

            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-white">
              INSTITUTIONAL
              <br />
              <span className="text-amber-500">TRADING WORKFLOW.</span>
            </h1>
            
            <p className="mt-8 max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed uppercase tracking-tight">
              A high-precision terminal designed for deep research. 
              Track risk clusters, simulate outcomes, and enforce rules 
              within a unified command-line driven interface.
            </p>

            {/* Feature Grid */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
               <div className="flex items-center gap-2 text-zinc-500">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Analytics</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Risk Mgmt</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Low Latency</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Global Macro</span>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/terminal"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-amber-500 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                Launch Terminal <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/help"
                className="inline-flex items-center justify-center px-8 py-5 border border-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-[0.2em] hover:border-amber-500/50 hover:text-white transition-all"
              >
                Help
              </Link>

              <a
                href="https://github.com/john-formanek-code/OpenEdge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-5 border border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-600 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* System Metadata Decor */}
        <div className="absolute top-10 right-10 flex gap-10">
           <div className="text-right">
              <div className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">Network_Status</div>
              <div className="text-[9px] text-zinc-500 font-mono italic">ENCRYPTED_LINK_ESTABLISHED</div>
           </div>
           <div className="text-right">
              <div className="text-[8px] text-zinc-700 uppercase font-black tracking-widest">System_ID</div>
              <div className="text-[9px] text-zinc-500 font-mono italic">OPEN_EDGE_01_PROD</div>
           </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scanline {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
