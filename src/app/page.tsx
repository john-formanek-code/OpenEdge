import Link from "next/link";
import { ArrowRight, Github, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="h-full overflow-hidden bg-black text-white selection:bg-amber-500/30">
      <section className="relative h-full flex items-center justify-center px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,40,0.2),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(35,120,255,0.15),transparent_40%),linear-gradient(180deg,#020202_0%,#080808_50%,#000000_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
        
        {/* Moving scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <div className="w-full h-[2px] bg-white/20 absolute top-0 animate-[scanline_8s_linear_infinite]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl border border-zinc-800/50 bg-black/60 backdrop-blur-xl p-8 md:p-16 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center rounded-sm rotate-3">
               <Terminal className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <p className="text-[12px] tracking-[0.3em] uppercase text-zinc-500 font-black">OpenEdge Terminal v1.0</p>
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.85] text-white">
            MASTER YOUR 
            <br />
            <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(242,201,76,0.3)]">TRADING EDGE.</span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-zinc-400 text-lg md:text-xl leading-relaxed font-medium">
            A high-performance research terminal for system traders. 
            Hypothesis tracking, rule enforcement, and institutional-grade analytics 
            in one unified open-source workspace.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/terminal"
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-black font-black text-sm uppercase tracking-widest hover:bg-white transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Terminal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/help"
              className="inline-flex items-center justify-center px-8 py-4 border border-zinc-800 text-zinc-400 font-black text-sm uppercase tracking-widest hover:border-amber-500/50 hover:text-white transition-all active:scale-95"
            >
              Shortcuts & Docs
            </Link>

            <a
              href="https://github.com/john-formanek-code/OpenEdge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-4 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all active:scale-95"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Institutional stats teaser */}
          <div className="mt-20 pt-10 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-8">
             <div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">Real-time</div>
                <div className="text-xl font-black text-zinc-300 font-mono italic">MARKET_TICK</div>
             </div>
             <div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">Analytics</div>
                <div className="text-xl font-black text-zinc-300 font-mono italic">EXPECTANCY+</div>
             </div>
             <div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">Execution</div>
                <div className="text-xl font-black text-zinc-300 font-mono italic">SLIPPAGE_OPT</div>
             </div>
             <div>
                <div className="text-[10px] text-zinc-600 font-bold uppercase mb-1 tracking-widest">License</div>
                <div className="text-xl font-black text-zinc-300 font-mono italic">MIT_FREE</div>
             </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 right-10 text-[10px] font-mono text-zinc-800 uppercase vertical-text tracking-[0.5em] select-none pointer-events-none">
           PROXIMITY_ALERT // SYSTEM_ONLINE
        </div>
      </section>

      <style jsx>{`
        @keyframes scanline {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        .vertical-text {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}
