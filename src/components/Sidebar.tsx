import Link from 'next/link';
import { Home, LayoutDashboard, Inbox, Archive, BarChart3, Settings, FlaskConical, Receipt } from 'lucide-react';

const navItems = [
  { name: 'Today Focus', href: '/?view=today', icon: Home },
  { name: 'Active', href: '/?view=active', icon: LayoutDashboard },
  { name: 'Blotter', href: '/blotter', icon: Receipt },
  { name: 'Parking Lot', href: '/?view=parking', icon: Inbox },
  { name: 'Archive', href: '/?view=archive', icon: Archive },
  { name: 'Signal Lab', href: '/lab', icon: FlaskConical },
  { name: 'Market State', href: '/market', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-zinc-900 text-zinc-100 h-screen flex flex-col border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold tracking-tight">TRADE OS</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors group"
          >
            <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/settings"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors group"
        >
          <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100" />
          <span className="font-medium">Settings</span>
        </Link>
        <div className="px-3 pt-2 text-xs text-zinc-500 font-mono">
          v1.0.0 • Admin
        </div>
      </div>
    </div>
  );
}
