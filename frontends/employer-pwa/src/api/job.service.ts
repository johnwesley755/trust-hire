import apiClient from './apiClient';

export interface Job {
  id?: string;
  title: string;
  description: string;
  skills: string[];
  minLevel: number;
  salary: number;
  duration: string;
  latitude: number;
  longitude: number;
  schedule: string;
  urgent: boolean;
  status?: 'OPEN' | 'FILLED' | 'CANCELLED';
  postedBy?: string;
  createdAt?: string;
}

export const jobService = {
  createJob: async (jobData: Job) => {
    const response = await apiClient.post<{ job: Job }>('/jobs', jobData);
    return response.data;
  },

  getEmployerJobs: async () => {
    // Note: Assuming an endpoint exists or filtering by user on backend
    const response = await apiClient.get<{ jobs: Job[] }>('/jobs/employer');
    return response.data;
  },
};
