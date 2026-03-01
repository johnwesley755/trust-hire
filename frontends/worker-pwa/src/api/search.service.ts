import apiClient from './apiClient';

export interface JobSearch {
  jobId: string;
  employerClerkId: string;
  title: string;
  description: string;
  industry: string;
  location: string;
  latitude: number;
  longitude: number;
  budget: number;
  status: string;
}

export const searchJobs = async (
  query?: string, 
  category?: string, 
  location?: string,
  lat?: number,
  lon?: number,
  radius?: number
): Promise<JobSearch[]> => {
  const response = await apiClient.get<JobSearch[]>('/api/search/jobs', {
    params: { query, category, location, lat, lon, radius }
  });
  return response.data;
};
