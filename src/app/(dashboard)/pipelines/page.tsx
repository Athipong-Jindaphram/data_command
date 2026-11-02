"use client";

import { useState } from 'react';
import { useDataCommand } from '@/hooks/useDataCommand';
import { 
  Workflow, Play, PauseCircle, Search, Filter, AlertTriangle, 
  CheckCircle2, Clock, ServerCrash, X, Terminal, Calendar, 
  MoreVertical, RefreshCcw, ArrowRight
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Pipeline } from '@/types/dataCommand';

export default function PipelinesPage() {
  const { pipelines } = useDataCommand();
  const [search, setSearch] = useState('');
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  // States สำหรับ Drawer และ Modal
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState<string | null>(null);

  // ฟังก์ชันจำลองการกด Run
  const handleManualRun = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunModalOpen(false);
    if (selectedPipeline) {
      setRunningPipeline(selectedPipeline.id);
      // จำลองว่ารันเสร็จใน 3 วินาที
      setTimeout(() => setRunningPipeline(null), 3000);
    }
  };

  const filteredPipelines = pipelines.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-10">
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pipelines</h1>
          <p className="text-sm text-slate-500 mt-1">Manage data extraction, transformation, and loading schedules.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsMaintenance(!isMaintenance)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center border ${
              isMaintenance ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <PauseCircle className="w-4 h-4 mr-2" />
            {isMaintenance ? 'Resume All' : 'Pause All Schedules'}
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center">
            <Workflow className="w-4 h-4 mr-2" />
            New Pipeline
          </button>
        </div>
      </div>

      {/* Maintenance Banner */}
      {isMaintenance && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Maintenance Mode Active</h3>
            <p className="text-xs text-amber-700 mt-1">All automated pipeline schedules are currently paused. Manual runs are still permitted.</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pipelines by name..." 
            className="w-full bg-white/80 backdrop-blur-xl border border-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <button className="bg-white/80 backdrop-blur-xl border border-slate-200/80 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center shadow-sm hover:bg-slate-50">
          <Filter className="w-4 h-4 mr-2 text-slate-400" />
          Status: All
        </button>
      </div>

      {/* Pipelines Table */}
      <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Pipeline Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Run</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPipelines.map((pipeline) => {
                const isRunning = runningPipeline === pipeline.id || pipeline.lastRun.status === 'running';
                const status = isRunning ? 'running' : pipeline.lastRun.status;
                
                return (
                  <tr key={pipeline.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${
                          status === 'success' ? 'bg-emerald-50 border-emerald-100' :
                          status === 'failed' ? 'bg-red-50 border-red-100' :
                          'bg-blue-50 border-blue-100 animate-pulse'
                        }`}>
                          <Workflow className={`w-4 h-4 ${
                            status === 'success' ? 'text-emerald-600' :
                            status === 'failed' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{pipeline.name}</span>
                          <span className="text-[10px] text-slate-500">ID: {pipeline.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {status === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {status === 'failed' && <ServerCrash className="w-3 h-3 mr-1" />}
                        {status === 'running' && <RefreshCcw className="w-3 h-3 mr-1 animate-spin" />}
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-slate-700">
                        {formatDistanceToNow(new Date(pipeline.lastRun.startedAt), { addSuffix: true })}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{pipeline.lastRun.durationSec}s • {pipeline.lastRun.rowsProcessed.toLocaleString()} rows</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-700">{pipeline.schedule.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Next: {format(new Date(pipeline.nextRunAt), 'HH:mm')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { setSelectedPipeline(pipeline); setIsRunModalOpen(true); }}
                          disabled={isRunning}
                          className="p-1.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-lg shadow-sm disabled:opacity-50 transition-all hover:border-blue-300"
                          title="Run Pipeline"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setSelectedPipeline(pipeline)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:bg-slate-50 flex items-center"
                        >
                          <span className="text-[10px] font-bold px-1">LOGS</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer (Log Viewer) */}
      {selectedPipeline && !isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedPipeline(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedPipeline.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                  <Terminal className="w-3 h-3 mr-1" /> View Run Logs
                </p>
              </div>
              <button onClick={() => setSelectedPipeline(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Dependency Status */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dependencies</h3>
                {selectedPipeline.dependsOn.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-700 font-medium">Waits for <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-xs ml-1">{selectedPipeline.dependsOn.join(', ')}</code></span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No upstream dependencies. Runs independently.</p>
                )}
              </div>

              {/* Terminal Mockup */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Run Log</h3>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Copy Logs</button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] leading-relaxed text-slate-300 overflow-x-auto shadow-inner">
                  <div className="text-emerald-400">[INFO] {format(new Date(selectedPipeline.lastRun.startedAt), 'yyyy-MM-dd HH:mm:ss')} - Initializing pipeline {selectedPipeline.id}...</div>
                  <div className="text-emerald-400">[INFO] Fetching upstream data... OK</div>
                  <div className="text-blue-400">[RUN] Processing {selectedPipeline.lastRun.rowsProcessed} records...</div>
                  {selectedPipeline.lastRun.status === 'failed' ? (
                    <>
                      <div className="text-red-400 mt-2 font-bold">[ERROR] {selectedPipeline.lastRun.error}</div>
                      <div className="text-red-400">[FATAL] Pipeline execution halted.</div>
                    </>
                  ) : (
                    <div className="text-emerald-400 mt-2 font-bold">[SUCCESS] Pipeline completed in {selectedPipeline.lastRun.durationSec}s.</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={() => setIsRunModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Retry Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Run Modal */}
      {isRunModalOpen && selectedPipeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <Play className="w-4 h-4 mr-2 text-blue-600" />
                Trigger Manual Run
              </h2>
              <button onClick={() => setIsRunModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleManualRun}>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-start space-x-3 mb-4">
                  <Workflow className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-blue-900 block">Target: {selectedPipeline.name}</span>
                    <span className="text-[10px] text-blue-700 mt-0.5 block">This will start execution outside of the normal schedule.</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Range (Parameters)</label>
                  <select className="w-full text-sm text-slate-900 bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Custom (Full Load)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsRunModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20">
                  Confirm Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}