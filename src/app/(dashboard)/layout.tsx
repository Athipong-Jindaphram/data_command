import { Suspense } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ScenarioProvider } from '@/context/ScenarioContext'; 
import ScenarioSwitcher from '@/components/ui/ScenarioSwitcher'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScenarioProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        {/* ห่อหุ้ม Sidebar ด้วย Suspense เพื่อแก้ปัญหา usePathname() */}
        <Suspense fallback={<div className="w-64 bg-white border-r border-slate-200 h-screen" />}>
          <Sidebar />
        </Suspense>
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <TopBar />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>

        <ScenarioSwitcher />
      </div>
    </ScenarioProvider>
  );
}