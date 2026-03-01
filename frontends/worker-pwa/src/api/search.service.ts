import apiClient from './apiClient';

export interface JobSearch {
  jobId: string;
  employerClerkId: string;
  title: string;
  description: string;
  industry: string;
  location: string;
  budget: number;
  status: string;
}

export const searchJobs = async (query?: string, category?: string, location?: string): Promise<JobSearch[]> => {
  const response = await apiClient.get<JobSearch[]>('/api/search/jobs', {
    params: { query, category, location }
  });
  return response.data;
};
