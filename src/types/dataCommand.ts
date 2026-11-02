export type HealthCheckType = 'freshness' | 'rowCount' | 'nullRate' | 'duplicateKey' | 'reconciliation' | 'refresh' | 'anomaly';
export type StatusLevel = 'pass' | 'warn' | 'fail';
export type PipelineStatus = 'success' | 'failed' | 'running' | 'warning' | 'queued';
export type ScenarioType = 'normal' | 'pipeline_failed' | 'stale_data' | 'dashboard_error';

export interface PipelineRun { id: string; pipelineId: string; status: PipelineStatus; startedAt: string; durationSec: number; rowsProcessed: number; error?: string; }
export interface Pipeline { id: string; name: string; schedule: { cron: string; label: string }; enabled: boolean; nextRunAt: string; lastRun: PipelineRun; dependsOn: string[]; }
export interface HealthCheck { id: string; type: HealthCheckType; status: StatusLevel; before: string | number; after: string | number; threshold: string | number; message: string; }
export interface DashboardHealth { id: string; name: string; checks: HealthCheck[]; lastRefreshAt: string; refreshStatus: StatusLevel; }
export interface Project { id: string; name: string; status: 'planning' | 'active' | 'blocked' | 'done'; progress: number; nextAction: string; blocker?: string; updatedAt: string; pipelineIds: string[]; dashboardIds: string[]; links: { label: string; url: string; type: 'powerbi' | 'github' | 'db' }[]; }