import Link from 'next/link';
import { Home, LayoutDashboard, Inbox, Archive, BarChart3, Settings, FlaskConical, Receipt } from 'lucide-react';

const navItems = [
  { name: 'Today Focus', href: '/terminal?view=today', icon: Home },
  { name: 'Active', href: '/terminal?view=active', icon: LayoutDashboard },
  { name: 'Blotter', href: '/blotter', icon: Receipt },
  { name: 'Parking Lot', href: '/terminal?view=parking', icon: Inbox },
  { name: 'Archive', href: '/terminal?view=archive', icon: Archive },
  { name: 'Signal Lab', href: '/lab', icon: FlaskConical },
  { name: 'Market State', href: '/market', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-black text-zinc-100 h-screen flex flex-col border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800 bg-[#050505]">
        <h1 className="text-xl font-black tracking-widest text-[var(--bb-amber)] uppercase">Trade//OS</h1>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
          >
            <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-[var(--bb-amber)]" />
            <span className="text-[11px] font-bold uppercase tracking-tight">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800 space-y-2 bg-[#050505]">
        <Link
          href="/settings"
          className="flex items-center space-x-3 p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-900 transition-all group"
        >
          <Settings className="w-4 h-4 text-zinc-500 group-hover:text-white" />
          <span className="text-[11px] font-bold uppercase">Settings</span>
        </Link>
        <div className="px-2 pt-2 text-[9px] text-zinc-600 font-mono uppercase font-black">
          Terminal v1.0.0 · Prime
        </div>
      </div>
    </div>
  );
}
