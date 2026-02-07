import Link from "next/link";

const shortcuts = [
  { combo: "Alt + M", desc: "Toggle function menu" },
  { combo: "Ctrl + Shift + ] / [", desc: "Cycle panels forward / backward" },
  { combo: "F1", desc: "Dashboard" },
  { combo: "F2", desc: "Risk Suite" },
  { combo: "F3", desc: "Signal Lab" },
  { combo: "F4", desc: "Execution / Blotter" },
  { combo: "F5", desc: "Watchlist" },
  { combo: "F7", desc: "Help" },
];

const mnemonics = [
  { cmd: "AAPL GO", desc: "Load AAPL into active panel" },
  { cmd: "P2 RISK GO", desc: "Switch panel 2 to Risk Suite" },
  { cmd: "NEWS GO", desc: "Show macro calendar in active panel" },
  { cmd: "JRNL", desc: "Open Execution Journal" },
  { cmd: "SET", desc: "Open System Settings" },
];

export default function HelpPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="function-strip sticky top-0 z-20">
        <Link href="/?view=dash" className="function-key">
          <span className="keycode">Esc</span>
          <span className="hidden sm:inline">Exit Help</span>
        </Link>
        <Link href="/" className="function-key">
          <span className="keycode">F1</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

      <div className="panel-grid p-4 overflow-auto">
        <div className="panel-shell panel-active">
          <div className="panel-toolbar">
            <div className="flex items-center space-x-2">
              <span className="bb-chip">REF</span>
              <span className="toolbar-title">Key Bindings</span>
            </div>
            <span className="toolbar-security text-[#8a8a8a]">CLIENT: LOCAL</span>
          </div>
          <div className="panel-body">
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Shortcut</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map((row) => (
                  <tr key={row.combo} className="bb-row">
                    <td className="font-bold text-[var(--bb-amber)]">{row.combo}</td>
                    <td className="text-white">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-shell">
          <div className="panel-toolbar">
            <div className="flex items-center space-x-2">
              <span className="bb-chip">GO</span>
              <span className="toolbar-title">Mnemonics</span>
            </div>
            <span className="toolbar-security text-[#8a8a8a]">PROMPT &gt;</span>
          </div>
          <div className="panel-body">
            <div className="space-y-2">
              {mnemonics.map((row) => (
                <div key={row.cmd} className="flex items-center justify-between bb-row px-2 py-2 border border-[color:var(--bb-border)] bg-[#050505]">
                  <span className="text-[var(--bb-amber)] font-black">{row.cmd}</span>
                  <span className="text-[#c2c2c2] text-[11px]">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-shell">
          <div className="panel-toolbar">
            <div className="flex items-center space-x-2">
              <span className="bb-chip">TIPS</span>
              <span className="toolbar-title">Bloomberg Look</span>
            </div>
            <span className="toolbar-security text-[#8a8a8a]">STYLE GUIDE</span>
          </div>
          <div className="panel-body space-y-2 text-[#c2c2c2] text-[11px] leading-5">
            <p>Use mnemonics in the command bar, press GO (Enter) to navigate or load tickers. Panels are linked; switching functions preserves security context.</p>
            <p>Alt+M reveals the function menu overlay. Ctrl+Shift+]/[ cycles active panel focus. The live strip shows EQ/CR badges; click tickers to load (coming soon).</p>
            <p>For mobile / narrow viewports the function key labels collapse; the command bar remains primary navigation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
