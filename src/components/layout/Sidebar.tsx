"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Workflow, LineChart, Settings, DatabaseZap } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Pipelines', href: '/pipelines', icon: Workflow },
    { name: 'Dashboards', href: '/dashboards', icon: LineChart },
    { name: 'Projects', href: '/projects', icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col justify-between hidden md:flex sticky top-0 z-30 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md">
          <DatabaseZap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-sm block">DATA CONTROL</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Mission Room</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Settings (ล่างสุด) */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          href="/settings"
          className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
            pathname === '/settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className={`w-4 h-4 ${pathname === '/settings' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}