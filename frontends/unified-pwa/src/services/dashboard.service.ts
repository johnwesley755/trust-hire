import apiClient from '../api/apiClient';
import type { EmployerStats, WorkerStats } from '../types';

export const dashboardService = {
  getEmployerStats: async (): Promise<EmployerStats> => {
    const res = await apiClient.get<EmployerStats>('/api/dashboard/employer/stats');
    return res.data;
  },
  getWorkerStats: async (): Promise<WorkerStats> => {
    const res = await apiClient.get<WorkerStats>('/api/dashboard/worker/stats');
    return res.data;
  },
  getEmployerDashboard: async (): Promise<EmployerStats> => {
    const res = await apiClient.get<EmployerStats>('/api/dashboard/employer/stats');
    return res.data;
  },
  getWorkerDashboard: async (): Promise<WorkerStats> => {
    const res = await apiClient.get<WorkerStats>('/api/dashboard/worker/stats');
    return res.data;
  },
  getMetrics: async (): Promise<any> => {
    const res = await apiClient.get('/api/dashboard/metrics');
    return res.data;
  },
};

export const settingsService = {
  getSettings: () => apiClient.get('/api/settings'),
  updateSettings: (data: any) => apiClient.put('/api/settings', data),
};

export const miscService = {
  submitEarlyAccess: (email: string, source: string) => 
    apiClient.post('/api/early-access', { email, source }),
  submitSupportTicket: (data: { subject: string; message: string; priority?: string }) => 
    apiClient.post('/api/support/ticket', data),
};
