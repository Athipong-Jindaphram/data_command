"use client";

import { useState } from 'react';
import { Settings, Bell, Shield, Webhook, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [slackChannel, setSlackChannel] = useState('#data-alerts-mission');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 relative pb-10 max-w-4xl">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Control Room Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure notification channels, automation rules, and system preferences.</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-900">Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Alerts & Notifications</h2>
              <p className="text-xs text-slate-500">Choose where critical data failures should be reported.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Slack Webhook Channel</label>
              <div className="flex items-center space-x-2">
                <Webhook className="w-4 h-4 text-slate-400 ml-1" />
                <input 
                  type="text" 
                  value={slackChannel}
                  onChange={(e) => setSlackChannel(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Email Notifications</span>
                <span className="text-xs text-slate-500">Send urgent digests to lead data engineers when pipelines fail.</span>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl text-purple-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Automation & Resilience</h2>
              <p className="text-xs text-slate-500">Set fallback rules and automatic recovery behaviors.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Automatic Pipeline Retry</span>
                <span className="text-xs text-slate-500">Automatically retry failed pipelines up to 3 times on connection timeout.</span>
              </div>
              <input 
                type="checkbox" 
                checked={autoRetry}
                onChange={(e) =>setAutoRetry(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}