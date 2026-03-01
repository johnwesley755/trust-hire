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
}

export const jobService = {
  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/api/jobs/${id}`);
    return response.data;
  },

  getAllJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/api/jobs');
    return response.data;
  }
};
