import apiClient from './apiClient';

export interface Job {
  id?: string;
  employerClerkId?: string;
  title: string;
  description: string;
  industry: string;
  requiredSkills: string[];
  experienceYearsRequired?: number;
  budget: number;
  location: string;
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
