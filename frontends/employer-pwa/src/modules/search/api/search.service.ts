import apiClient from '../../../core/api/apiClient';

export interface WorkerSearch {
  userId: string;
  name: string;
  bio: string;
  skills: string;
  location: string;
  city?: string;
  level: string;
  isVerified: boolean;
  profileImageUrl: string;
  status: string;
}

export const searchWorkers = async (
  query?: string, 
  location?: string, 
  city?: string,
  level?: string, 
  radius?: number, 
  lat?: number,
  lon?: number,
  skills?: string
): Promise<WorkerSearch[]> => {
  const response = await apiClient.get<WorkerSearch[]>('/api/search/workers', {
    params: { query, location, city, level, radius, lat, lon, skills }
  });
  return response.data;
};
