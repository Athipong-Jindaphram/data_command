"use client";

import { useState } from 'react';
import { useDataCommand } from '@/hooks/useDataCommand';
import { 
  Briefcase, CheckCircle2, Clock, ExternalLink, 
  Workflow, LineChart, ShieldAlert, X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Project } from '@/types/dataCommand';

export default function ProjectsPage() {
  const { projects, pipelines, dashboards } = useDataCommand();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6 relative pb-10">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects & Integration</h1>
          <p className="text-sm text-slate-500 mt-1">Track data projects, linked pipelines, dashboards, and operational resources.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {projects.map((proj) => {
          const isBlocked = proj.status === 'blocked';
          
          return (
            <div 
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`bg-white/85 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md group ${
                isBlocked ? 'border-red-300 hover:border-red-400' : 'border-slate-200/80 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border shadow-sm ${
                    isBlocked ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{proj.name}</h3>
                    <p className="text-[10px] text-slate-500">Updated {formatDistanceToNow(new Date(proj.updatedAt), { addSuffix: true })}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                  proj.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  proj.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' :
                  proj.status === 'done' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {proj.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 my-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-900">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isBlocked ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              {/* Next Action & Blocker */}
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start text-slate-700">
                  <span className="font-bold mr-2 text-slate-400">Next:</span>
                  <span className="font-medium">{proj.nextAction}</span>
                </div>
                {proj.blocker && (
                  <div className="flex items-start text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl">
                    <ShieldAlert className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Blocker Detected</span>
                      <span>{proj.blocker}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer: Project Details */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProject(null)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedProject.status} Project</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedProject.name}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Links */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Links</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-sm">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Connected Pipelines */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Linked Pipelines</h3>
                <div className="space-y-2">
                  {selectedProject.pipelineIds.map(pId => {
                    const p = pipelines.find(item => item.id === pId);
                    if (!p) return null;
                    return (
                      <div key={p.id} className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                          <Workflow className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-slate-800">{p.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          p.lastRun.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {p.lastRun.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connected Dashboards */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Linked Dashboards</h3>
                <div className="space-y-2">
                  {selectedProject.dashboardIds.map(dId => {
                    const d = dashboards.find(item => item.id === dId);
                    if (!d) return null;
                    return (
                      <div key={d.id} className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                          <LineChart className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-bold text-slate-800">{d.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          d.refreshStatus === 'pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {d.refreshStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}