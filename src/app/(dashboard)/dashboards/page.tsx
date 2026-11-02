"use client";

import { useState } from 'react';
import { useDataCommand } from '@/hooks/useDataCommand';
import { 
  LineChart, LayoutDashboard, Clock, AlertTriangle, CheckCircle2, 
  ExternalLink, Search, Filter, AlertCircle, ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function DashboardsPage() {
  const { dashboards } = useDataCommand();
  const [search, setSearch] = useState('');

  const filteredDashboards = dashboards.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboards Health</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor data quality and refresh status across all your BI reports.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            Filter Status
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative pt-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 mt-1" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dashboards by name..." 
          className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Dashboards Grid (คลิกแล้วพาไปหน้าแยกเต็มจอ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDashboards.map((dash) => {
          const passCount = dash.checks.filter(c => c.status === 'pass').length;
          const warnCount = dash.checks.filter(c => c.status === 'warn').length;
          const failCount = dash.checks.filter(c => c.status === 'fail').length;
          
          return (
            <Link 
              key={dash.id} 
              href={`/dashboards/${dash.id}`}
              className={`bg-white/85 backdrop-blur-xl border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 group block ${
                dash.refreshStatus === 'fail' || failCount > 0 ? 'border-red-300 hover:border-red-400' :
                dash.refreshStatus === 'warn' || warnCount > 0 ? 'border-amber-300 hover:border-amber-400' :
                'border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border shadow-sm ${
                  dash.refreshStatus === 'fail' ? 'bg-red-50 border-red-100' :
                  dash.refreshStatus === 'warn' ? 'bg-amber-50 border-amber-100' :
                  'bg-blue-50 border-blue-100'
                }`}>
                  <LineChart className={`w-5 h-5 ${
                    dash.refreshStatus === 'fail' ? 'text-red-600' :
                    dash.refreshStatus === 'warn' ? 'text-amber-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                  dash.refreshStatus === 'fail' ? 'bg-red-50 text-red-700 border-red-200' :
                  dash.refreshStatus === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {dash.refreshStatus === 'fail' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {dash.refreshStatus === 'warn' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {dash.refreshStatus === 'pass' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {dash.refreshStatus === 'fail' ? 'Error' : dash.refreshStatus === 'warn' ? 'Warning' : 'Healthy'}
                </span>
              </div>
              
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{dash.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Refreshed {formatDistanceToNow(new Date(dash.lastRefreshAt), { addSuffix: true })}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> {passCount}
                  </div>
                  {warnCount > 0 && (
                    <div className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                      <AlertTriangle className="w-3 h-3 mr-1" /> {warnCount}
                    </div>
                  )}
                  {failCount > 0 && (
                    <div className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                      <AlertCircle className="w-3 h-3 mr-1" /> {failCount}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center">
                  Open Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}