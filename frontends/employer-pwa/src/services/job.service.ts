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
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
  /** ISO date string (YYYY-MM-DD) set by the employer at posting time */
  expiresAt?: string;
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
