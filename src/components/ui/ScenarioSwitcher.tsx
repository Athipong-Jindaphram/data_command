"use client";

import { useScenario } from '@/context/ScenarioContext';
import { DatabaseZap, AlertTriangle } from 'lucide-react';
import { ScenarioType } from '@/types/dataCommand';

export default function ScenarioSwitcher() {
  const { scenario, setScenario } = useScenario();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      <div className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center border border-blue-400/30">
        <DatabaseZap className="w-3 h-3 mr-1.5 animate-pulse" />
        MOCK DATA ACTIVE
      </div>

      <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-2 rounded-xl shadow-2xl flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 ml-1" />
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as ScenarioType)}
          className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer p-1"
        >
          <option value="normal">✅ Scenario: All Normal</option>
          <option value="pipeline_failed">❌ Scenario: Pipeline Failed</option>
          <option value="stale_data">⚠️ Scenario: Stale Data</option>
          <option value="dashboard_error">🚨 Scenario: Dashboard Error</option>
        </select>
      </div>
    </div>
  );
}