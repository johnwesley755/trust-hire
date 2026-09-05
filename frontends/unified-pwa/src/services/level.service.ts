import apiClient from '../api/apiClient';

export const levelService = {
  getProgression: async (workerId?: string): Promise<any> => {
    const url = workerId ? `/api/levels/worker/${workerId}` : '/api/levels/progression';
    const res = await apiClient.get(url);
    return res.data;
  },
  getLevelProgress: async (workerId?: string): Promise<any> => {
    const url = workerId ? `/api/levels/worker/${workerId}` : '/api/levels/progression';
    const res = await apiClient.get(url);
    return res.data;
  },
  getLevelDetails: async (workerId?: string): Promise<any> => {
    const url = workerId ? `/api/levels/worker/${workerId}` : '/api/levels/progression';
    const res = await apiClient.get(url);
    return res.data;
  },
  getWorkerLevel: async (workerId: string): Promise<any> => {
    const res = await apiClient.get(`/api/levels/worker/${workerId}`);
    return res.data;
  },
  getRequirements: async (): Promise<any> => {
    const res = await apiClient.get('/api/levels/requirements');
    return res.data;
  },
};
