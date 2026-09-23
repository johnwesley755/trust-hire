import apiClient from '../api/apiClient';
import type { SavedJob, SavedWorker } from '../hooks/useSavedStore';

export const savedService = {
  getSavedJobs: async (): Promise<SavedJob[]> => {
    const res = await apiClient.get<any>('/api/saved/jobs');
    return res.data?.data || res.data || [];
  },

  saveJob: async (jobId: string): Promise<any> => {
    const res = await apiClient.post<any>('/api/saved/jobs', { jobId });
    return res.data;
  },

  removeSavedJob: async (jobId: string): Promise<any> => {
    const res = await apiClient.delete<any>(`/api/saved/jobs/${jobId}`);
    return res.data;
  },

  getSavedWorkers: async (): Promise<SavedWorker[]> => {
    const res = await apiClient.get<any>('/api/saved/workers');
    return res.data?.data || res.data || [];
  },

  saveWorker: async (workerId: string): Promise<any> => {
    const res = await apiClient.post<any>('/api/saved/workers', { workerId });
    return res.data;
  },

  removeSavedWorker: async (workerId: string): Promise<any> => {
    const res = await apiClient.delete<any>(`/api/saved/workers/${workerId}`);
    return res.data;
  },
};
