"use client";

import { Suspense } from 'react';
import { useDataCommand } from '@/hooks/useDataCommand';
import { 
  LineChart, Clock, CheckCircle2, RefreshCw, ExternalLink, 
  Hash, Percent, Copy, Scale, Activity, Database, ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { HealthCheckType } from '@/types/dataCommand';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const getCheckIcon = (type: HealthCheckType) => {
  switch (type) {
    case 'freshness': return Clock;
    case 'rowCount': return Hash;
    case 'nullRate': return Percent;
    case 'duplicateKey': return Copy;
    case 'reconciliation': return Scale;
    case 'anomaly': return Activity;
    case 'refresh': return RefreshCw;
    default: return LineChart;
  }
};

function DashboardDetailContent() {
  const params = useParams();
  const { dashboards } = useDataCommand();
  
  const dashboard = dashboards.find(d => d.id === params.id) || dashboards[0];

  if (!dashboard) return <div className="p-8">Loading dashboard telemetry...</div>;

  return (
    <div className="space-y-6 relative pb-16 max-w-7xl mx-auto">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <Link href="/dashboards" className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                dashboard.refreshStatus === 'fail' ? 'bg-red-50 text-red-700 border-red-200' :
                dashboard.refreshStatus === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {dashboard.refreshStatus === 'fail' ? 'Error' : dashboard.refreshStatus === 'warn' ? 'Warning' : 'Healthy'}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {dashboard.id}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{dashboard.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center">
              <Database className="w-3.5 h-3.5 mr-1" />
              Last Data Refresh: {format(new Date(dashboard.lastRefreshAt), 'PPpp')} ({formatDistanceToNow(new Date(dashboard.lastRefreshAt), { addSuffix: true })})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a href="#" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-600/20 transition-all flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" /> Open Full Power BI
          </a>
        </div>
      </div>

      {/* 1. Main Embedded Power BI Viewer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <LineChart className="w-4 h-4 mr-2 text-blue-600" /> Executive BI Report Canvas (Power BI Embedded)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time telemetry and business metrics synchronized from data warehouse.</p>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" /> Live Connection
          </span>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 text-white space-y-6 relative overflow-hidden shadow-inner border border-slate-800">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Total Revenue (Q4)</p>
              <h4 className="text-3xl font-extrabold tracking-tight text-emerald-400 mt-1">฿ 12,450,800</h4>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded mt-2 inline-block">↑ +12.4% vs last month</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Active Stores / Users</p>
              <h4 className="text-3xl font-extrabold tracking-tight text-white mt-1">1,420 stores</h4>
              <span className="text-xs font-medium text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded mt-2 inline-block">98.2% operational</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Sync Error Rate</p>
              <h4 className={`text-3xl font-extrabold tracking-tight mt-1 ${dashboard.refreshStatus === 'fail' ? 'text-red-400' : 'text-emerald-400'}`}>
                {dashboard.refreshStatus === 'fail' ? '14.2%' : '0.02%'}
              </h4>
              <span className="text-xs font-medium text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded mt-2 inline-block">Threshold &lt; 0.5%</span>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Sales Performance Trend Analysis (Daily Breakdown)</span>
              <span className="text-blue-400 font-mono">Dataset: Fact_Sales_Q4</span>
            </div>
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 border-b border-slate-800">
              {[40, 65, 45, 80, 95, 70, 85, 60, 75, 90, 100, 85, 92, 78, 88].map((h, i) => (
                <div key={i} className="w-full bg-blue-600/50 hover:bg-blue-500 rounded-t transition-all relative group cursor-pointer" style={{ height: `${h}%` }}>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow border border-slate-700">
                    Day {i+1}: ฿{(h*125000).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Data Quality Checks & Telemetry */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Data Quality Checks & Telemetry Logs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated validation rules executed prior to report publishing.</p>
          </div>
          <button onClick={() => alert("Re-running quality checks...")} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Re-run Checks
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Metric Type</th>
                <th className="px-5 py-3.5">Current Value</th>
                <th className="px-5 py-3.5">Allowed Threshold</th>
                <th className="px-5 py-3.5">Diagnostic Message</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboard.checks.map((check) => {
                const Icon = getCheckIcon(check.type);
                return (
                  <tr key={check.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 flex items-center">
                      <div className={`mr-3 p-2 rounded-lg ${
                        check.status === 'pass' ? 'bg-emerald-50 text-emerald-600' :
                        check.status === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800 capitalize">{check.type.replace(/([A-Z])/g, ' $1')}</span>
                    </td>
                    <td className={`px-5 py-4 font-mono text-sm font-bold ${
                      check.status === 'pass' ? 'text-slate-900' : check.status === 'warn' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {check.after}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 font-mono">{check.threshold}</td>
                    <td className="px-5 py-4 text-xs text-slate-600 font-medium">{check.message}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        check.status === 'pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        check.status === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {check.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Before / After Pipeline Load Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
          <Scale className="w-4 h-4 mr-2 text-purple-600" /> Before / After Pipeline Load Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center bg-slate-50/80 border border-slate-200/80 p-5 rounded-xl">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Rows Processed</p>
            <div className="flex items-end justify-center space-x-2">
              <span className="text-sm text-slate-400 line-through">45,120</span>
              <span className="text-2xl font-extrabold text-slate-900">45,265</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block border border-emerald-100">+145 (0.3% growth)</span>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Null Revenue Rate</p>
            <div className="flex items-end justify-center space-x-2">
              <span className="text-sm text-slate-400 line-through">1.2%</span>
              <span className="text-2xl font-extrabold text-slate-900">1.1%</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block border border-emerald-100">-0.1% quality improved</span>
          </div>
          <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Key Violations</p>
            <div className="flex items-end justify-center space-x-2">
              <span className="text-xs text-slate-400">0</span>
              <span className={`text-2xl font-extrabold ${
                dashboard.checks.some(c => c.type === 'duplicateKey' && c.status === 'fail') ? 'text-red-600' : 'text-slate-900'
              }`}>
                {dashboard.checks.find(c => c.type === 'duplicateKey')?.after || '0'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded mt-1.5 inline-block">Target: 0 errors</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading dashboard view...</div>}>
      <DashboardDetailContent />
    </Suspense>
  );
}