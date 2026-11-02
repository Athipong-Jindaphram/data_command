"use client";

import { useState, useEffect } from 'react';
import { useScenario } from '@/context/ScenarioContext';
import { Pipeline, DashboardHealth, Project } from '@/types/dataCommand';

interface DataCommandReturn {
  pipelines: Pipeline[];
  dashboards: DashboardHealth[];
  projects: Project[];
  isLoading: boolean;
}

export const useDataCommand = (): DataCommandReturn => {
  const { scenario } = useScenario();
  
  // 1. สร้าง State ไว้เช็คว่าโหลดบน Browser (Client) หรือยัง
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. ถ้าระบบยัง Render อยู่บน Server ให้ส่งคืนค่าว่างไปก่อนเพื่อไม่ให้เกิด Error
  if (!isMounted) {
    return {
      pipelines: [],
      dashboards: [],
      projects: [],
      isLoading: true, // บอก UI ว่ากำลังโหลดข้อมูล
    };
  }

  // --- ส่วนโค้ดเดิมด้านล่างนี้จะทำงานเฉพาะบน Browser เท่านั้น ทำให้ใช้ new Date() ได้ปลอดภัย ---
  const now = new Date();
  const subHours = (d: Date, h: number) => new Date(d.getTime() - h * 60 * 60 * 1000);
  const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 60 * 60 * 1000);

  const getPipelines = (): Pipeline[] => {
    const base: Pipeline[] = [
      {
        id: 'p-1', name: 'ERP Sales Sync', enabled: true,
        schedule: { cron: '0 * * * *', label: 'Hourly' },
        nextRunAt: addHours(now, 1).toISOString(),
        dependsOn: [],
        lastRun: { id: 'r-1', pipelineId: 'p-1', status: 'success', startedAt: subHours(now, 1).toISOString(), durationSec: 120, rowsProcessed: 15000 }
      },
      {
        id: 'p-2', name: 'Customer RFM Model', enabled: true,
        schedule: { cron: '0 0 * * *', label: 'Daily Midnight' },
        nextRunAt: addHours(now, 12).toISOString(),
        dependsOn: ['p-1'],
        lastRun: { id: 'r-2', pipelineId: 'p-2', status: 'success', startedAt: subHours(now, 24).toISOString(), durationSec: 340, rowsProcessed: 50000 }
      }
    ];

    if (scenario === 'pipeline_failed') {
      base[0].lastRun.status = 'failed';
      base[0].lastRun.error = 'Connection timeout to ERP Replica DB';
    }
    return base;
  };

  const getDashboards = (): DashboardHealth[] => {
    const base: DashboardHealth[] = [
      {
        id: 'd-1', name: 'Executive Sales Performance', lastRefreshAt: subHours(now, 1).toISOString(), refreshStatus: 'pass',
        checks: [
          { id: 'c-1', type: 'freshness', status: 'pass', before: '2h', after: '1h', threshold: '3h', message: 'Data is up to date' },
          { id: 'c-2', type: 'nullRate', status: 'pass', before: '1.2%', after: '1.1%', threshold: '5%', message: 'Null rate in acceptable range' }
        ]
      }
    ];

    if (scenario === 'stale_data') {
      base[0].lastRefreshAt = subHours(now, 5).toISOString();
      base[0].refreshStatus = 'warn';
      base[0].checks[0] = { ...base[0].checks[0], status: 'fail', after: '5h', message: 'Data is stale. Expected refresh 2 hours ago.' };
    }
    if (scenario === 'dashboard_error') {
      base[0].refreshStatus = 'fail';
      base[0].checks.push({ id: 'c-3', type: 'duplicateKey', status: 'fail', before: 0, after: 145, threshold: 0, message: 'Primary key violation in Fact_Sales' });
    }
    return base;
  };

  const getProjects = (): Project[] => {
    const pipelines = getPipelines();
    const dashboards = getDashboards();
    
    const isErpFailing = pipelines.find(p => p.id === 'p-1')?.lastRun.status === 'failed';
    const isDashFailing = dashboards.find(d => d.id === 'd-1')?.refreshStatus === 'fail';

    return [
      {
        id: 'proj-1', name: 'Q4 Revenue Optimization', status: (isErpFailing || isDashFailing) ? 'blocked' : 'active',
        progress: 75, nextAction: 'Review A/B test results for pricing model',
        blocker: isErpFailing ? 'ERP Sales Sync Pipeline is failing' : undefined,
        updatedAt: subHours(now, 2).toISOString(),
        pipelineIds: ['p-1'], dashboardIds: ['d-1'],
        links: [{ label: 'Power BI', url: '#', type: 'powerbi' }]
      }
    ];
  };

  return {
    pipelines: getPipelines(),
    dashboards: getDashboards(),
    projects: getProjects(),
    isLoading: false, 
  };
};