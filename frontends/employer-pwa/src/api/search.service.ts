import apiClient from './apiClient';

export interface WorkerSearch {
  clerkId: string;
  name: string;
  bio: string;
  skills: string;
  location: string;
  level: string;
  isVerified: boolean;
  profileImageUrl: string;
  status: string;
}

export const searchWorkers = async (query?: string, location?: string, level?: string): Promise<WorkerSearch[]> => {
  const response = await apiClient.get<WorkerSearch[]>('/api/search/workers', {
    params: { query, location, level }
  });
  return response.data;
};
