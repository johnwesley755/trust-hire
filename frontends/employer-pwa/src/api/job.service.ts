import apiClient from './apiClient';

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
  latitude?: number;
  longitude?: number;
  status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export const jobService = {
  createJob: async (job: Partial<Job>): Promise<Job> => {
    const response = await apiClient.post<Job>('/api/jobs', job);
    return response.data;
  },

  getEmployerJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/api/jobs/employer');
    return response.data;
  },
};
