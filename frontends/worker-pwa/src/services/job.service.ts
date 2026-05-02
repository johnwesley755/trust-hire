import apiClient from '../api/apiClient';

export interface Job {
  id?: string;
  employerId?: string;
  title: string;
  description: string;
  industry: string;
  requiredSkills: string[];
  experienceYearsRequired?: number;
  budget: number;
  location: string;
  address?: string;
  city?: string;
  status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
}

export const jobService = {
  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/api/jobs/${id}`);
    return response.data;
  },

  getJobsByIds: async (ids: string[]): Promise<Job[]> => {
    const response = await apiClient.post<Job[]>('/api/jobs/by-ids', ids);
    return response.data;
  },

  getAllJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/api/jobs');
    return response.data;
  },
  
  getStats: async (): Promise<{ totalJobs: number, jobsToday: number }> => {
    const response = await apiClient.get<{ totalJobs: number, jobsToday: number }>('/api/jobs/stats');
    return response.data;
  },

  getApplicationCounts: async (jobIds: string[]): Promise<Record<string, number>> => {
    const response = await apiClient.post<Record<string, number>>('/api/jobs/applications/counts/by-jobs', jobIds);
    return response.data;
  }
};
