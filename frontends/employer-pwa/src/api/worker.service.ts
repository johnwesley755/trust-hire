import apiClient from './apiClient';

export interface Worker {
  id: string;
  name: string;
  profilePhoto: string;
  level: number;
  trustScore: number;
  skills: string[];
  experience: number;
  rating: number;
  distance: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  salaryRange: string;
  verificationStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'VERIFIED';
}

export const workerService = {
  searchWorkers: async (params: { 
    latitude: number; 
    longitude: number; 
    radius: number;
    skills?: string;
    minLevel?: number;
  }) => {
    const response = await apiClient.get<{ workers: Worker[]; total: number }>('/workers/search', { params });
    return response.data;
  },

  getWorkerById: async (id: string) => {
    const response = await apiClient.get<Worker>(`/workers/${id}`);
    return response.data;
  },
};
