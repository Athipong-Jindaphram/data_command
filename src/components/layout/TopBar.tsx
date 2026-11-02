"use client";

import { Bell, Search, Command } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Command Palette Button (Mock) */}
      <div className="flex-1 max-w-xl">
        <button 
          className="w-full flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-xl px-4 py-2 transition-all shadow-sm hover:shadow"
          onClick={() => alert("เดี๋ยวเราจะเชื่อม Command Palette เข้ากับปุ่มนี้ครับ!")}
        >
          <div className="flex items-center">
            <Search className="w-4 h-4 mr-2 text-slate-400" />
            <span>Search pipelines, projects, or command...</span>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="bg-slate-100 border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold flex items-center shadow-sm">
              <Command className="w-3 h-3 mr-0.5" /> K
            </kbd>
          </div>
        </button>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center space-x-3">
        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
          M
        </div>
      </div>
    </header>
  );
}