"use client";

import { useDataCommand } from '@/hooks/useDataCommand';
import { AlertCircle, CheckCircle2, Clock, Activity, ServerCrash, RefreshCcw, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import { format } from 'date-fns';

export default function OverviewPage() {
  // ดึงข้อมูล Mock จาก Hook ที่ผูกกับ Scenario ไว้แล้ว
  const { pipelines, dashboards } = useDataCommand();

  // 1. คำนวณ Metrics
  const failedPipelines = pipelines.filter(p => p.lastRun.status === 'failed');
  const runningPipelines = pipelines.filter(p => p.lastRun.status === 'running');
  const staleDashboards = dashboards.filter(d => d.checks.some(c => c.type === 'freshness' && c.status !== 'pass'));
  const errorDashboards = dashboards.filter(d => d.refreshStatus === 'fail');

  const totalIssues = failedPipelines.length + staleDashboards.length + errorDashboards.length;

  // 2. คำนวณ Status Bar บนสุด
  let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  let systemMessage = 'All systems operational. Data pipelines and dashboards are healthy.';
  
  if (failedPipelines.length > 0 || errorDashboards.length > 0) {
    systemStatus = 'critical';
    systemMessage = `${totalIssues} Critical Issue(s): Pipeline failures or Dashboard errors detected.`;
  } else if (staleDashboards.length > 0) {
    systemStatus = 'warning';
    systemMessage = `${totalIssues} Warning(s): Stale data detected in some dashboards.`;
  }

  // 3. รวบรวม "Needs Attention" List
  const attentionItems = [
    ...failedPipelines.map(p => ({
      id: p.id, type: 'Pipeline Failed', name: p.name, message: p.lastRun.error || 'Unknown error', time: p.lastRun.startedAt, severity: 'critical'
    })),
    ...errorDashboards.map(d => ({
      id: d.id, type: 'Dashboard Error', name: d.name, message: d.checks.find(c => c.status === 'fail')?.message || 'Refresh failed', time: d.lastRefreshAt, severity: 'critical'
    })),
    ...staleDashboards.map(d => ({
      id: d.id, type: 'Stale Data', name: d.name, message: d.checks.find(c => c.type === 'freshness')?.message || 'Data is outdated', time: d.lastRefreshAt, severity: 'warning'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="space-y-6 relative pb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Control Room</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time monitoring for your data ecosystem.</p>
        </div>
        <button 
          onClick={() => alert("เดี๋ยวเราจะทำ Dialog สำหรับ Trigger Pipeline ตรงนี้ครับ")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center"
        >
          <Play className="w-4 h-4 mr-2" />
          Trigger Pipeline
        </button>
      </div>

      {/* 1. Global Status Bar */}
      <div className={`rounded-xl p-4 flex items-center justify-between border shadow-sm transition-all ${
        systemStatus === 'healthy' ? 'bg-emerald-50 border-emerald-200' :
        systemStatus === 'warning' ? 'bg-amber-50 border-amber-200' :
        'bg-red-50 border-red-200 animate-in slide-in-from-top-2'
      }`}>
        <div className="flex items-center space-x-3">
          {systemStatus === 'healthy' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {systemStatus === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {systemStatus === 'critical' && <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />}
          <div>
            <h3 className={`text-sm font-bold ${
              systemStatus === 'healthy' ? 'text-emerald-900' :
              systemStatus === 'warning' ? 'text-amber-900' : 'text-red-900'
            }`}>
              {systemStatus === 'healthy' ? 'System Healthy' : 'Action Required'}
            </h3>
            <p className={`text-xs font-medium mt-0.5 ${
              systemStatus === 'healthy' ? 'text-emerald-700' :
              systemStatus === 'warning' ? 'text-amber-700' : 'text-red-700'
            }`}>
              {systemMessage}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Failed Runs', value: failedPipelines.length, icon: ServerCrash, danger: failedPipelines.length > 0 },
          { title: 'Running Now', value: runningPipelines.length, icon: Activity, active: runningPipelines.length > 0 },
          { title: 'Stale Dashboards', value: staleDashboards.length, icon: Clock, warning: staleDashboards.length > 0 },
          { title: 'Dashboard Issues', value: errorDashboards.length, icon: AlertTriangle, danger: errorDashboards.length > 0 },
        ].map((metric, idx) => (
          <div key={idx} className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-5 flex items-center justify-between transition-all cursor-pointer hover:shadow-md ${
            metric.danger ? 'border-red-300 shadow-red-500/10 hover:border-red-400' :
            metric.warning ? 'border-amber-300 shadow-amber-500/10 hover:border-amber-400' :
            metric.active ? 'border-blue-300 shadow-blue-500/10 hover:border-blue-400' :
            'border-slate-200/80 hover:border-slate-300'
          }`}>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{metric.title}</p>
              <h3 className={`text-2xl font-bold tracking-tight ${
                metric.danger ? 'text-red-600' :
                metric.warning ? 'text-amber-600' :
                metric.active ? 'text-blue-600' : 'text-slate-900'
              }`}>{metric.value}</h3>
            </div>
            <div className={`p-3 rounded-xl border shadow-sm ${
              metric.danger ? 'bg-red-50/80 border-red-100 text-red-600' :
              metric.warning ? 'bg-amber-50/80 border-amber-100 text-amber-600' :
              metric.active ? 'bg-blue-50/80 border-blue-100 text-blue-600' :
              'bg-slate-50/80 border-slate-100 text-slate-400'
            }`}>
              <metric.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* 3. Needs Attention Panel (กินพื้นที่ 2 คอลัมน์) */}
        <div className="lg:col-span-2 bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4.5 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center px-5 py-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-slate-500" />
              Needs Attention
            </h2>
            <span className="text-xs font-semibold text-slate-500">{attentionItems.length} items</span>
          </div>
          
          <div className="flex-1 divide-y divide-slate-100 p-2">
            {attentionItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mb-3 text-emerald-400 opacity-50" />
                <p className="text-sm font-semibold text-slate-600">ทุกอย่างปกติ (All Clear)</p>
                <p className="text-xs mt-1">No immediate actions required.</p>
              </div>
            ) : (
              attentionItems.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 p-2 rounded-lg border ${
                      item.severity === 'critical' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {item.severity === 'critical' ? <ServerCrash className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mb-1">{item.message}</p>
                      <p className="text-[10px] text-slate-400">{format(new Date(item.time), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm">
                    {item.type.includes('Pipeline') ? 'Retry' : 'View'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Today's Schedule (จำลอง) */}
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4.5 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <RefreshCcw className="w-4 h-4 mr-2 text-slate-500" />
              Upcoming Schedule
            </h2>
          </div>
          
          <div className="p-5 flex-1 space-y-5">
            {pipelines.map(p => (
              <div key={p.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-blue-50"></div>
                <div className="absolute left-0.5 top-4 bottom-[-20px] w-[1px] bg-slate-100 last:hidden"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{p.name}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-[10px] font-medium text-slate-500">{format(new Date(p.nextRunAt), 'h:mm a')}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{p.schedule.label}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center py-2 bg-blue-50/50 rounded-lg transition-colors">
              View All Schedules <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}