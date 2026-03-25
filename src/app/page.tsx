import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-full overflow-auto bg-black text-white">
      <section className="relative min-h-full flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,40,0.2),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(35,120,255,0.18),transparent_38%),linear-gradient(180deg,#030303_0%,#090909_45%,#020202_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative z-10 w-full max-w-5xl border border-[#2b2b2b] bg-black/70 backdrop-blur-sm p-8 md:p-12">
          <p className="text-[11px] tracking-[0.22em] uppercase text-zinc-400 font-black">OpenEdge</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black italic tracking-tight leading-[0.95]">
            Open-Source Trading
            <br />
            Research Terminal
          </h1>
          <p className="mt-6 max-w-2xl text-zinc-300 text-sm md:text-base leading-relaxed">
            Build hypotheses, track risk, monitor macro context, and review execution in one terminal-style workspace.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/terminal"
              className="inline-flex items-center justify-center px-5 py-3 bg-[var(--bb-amber)] text-black font-black text-sm uppercase tracking-wide hover:brightness-95 transition"
            >
              Launch App
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center justify-center px-5 py-3 border border-[#3a3a3a] text-zinc-200 font-black text-sm uppercase tracking-wide hover:border-[var(--bb-amber)] hover:text-white transition"
            >
              View Shortcuts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
