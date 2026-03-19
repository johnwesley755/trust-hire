import apiClient from './apiClient';

export interface WorkerProfile {
  id?: string;
  fullName: string;
  location: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  level: string;
  bio: string;
  skills: string;
  experienceYears: number;
  hourlyRate: number;
  isAvailable: boolean;
  profileViews?: number;
}

export const profileService = {
  getProfile: async (): Promise<WorkerProfile> => {
    const response = await apiClient.get<WorkerProfile>('/api/worker/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<WorkerProfile>): Promise<WorkerProfile> => {
    const response = await apiClient.put<WorkerProfile>('/api/worker/profile', updates);
    return response.data;
  },

  incrementProfileView: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/worker/profile/${userId}/view`);
  },

  getGlobalStats: async (): Promise<{ totalWorkers: number }> => {
    const response = await apiClient.get<{ totalWorkers: number }>('/api/worker/stats');
    return response.data;
  }
};
