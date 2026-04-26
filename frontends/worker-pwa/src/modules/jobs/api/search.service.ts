import apiClient from '../../../core/api/apiClient';

export interface JobSearch {
  jobId: string;
  employerId: string;
  employerName?: string;
  title: string;
  description: string;
  industry: string;
  location: string;
  city?: string;
  latitude: number;
  longitude: number;
  budget: number;
  status: string;
}

export const searchJobs = async (
  query?: string, 
  category?: string, 
  location?: string,
  city?: string,
  lat?: number,
  lon?: number,
  radius?: number
): Promise<JobSearch[]> => {
  const response = await apiClient.get<JobSearch[]>('/api/search/jobs', {
    params: { 
      query, 
      category, 
      location,
      city,
      lat, 
      lon, 
      radius 
    }
  });
  return response.data;
};
