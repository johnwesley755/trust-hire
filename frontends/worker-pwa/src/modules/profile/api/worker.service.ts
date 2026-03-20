import apiClient from '../../../core/api/apiClient';

export interface Worker {
  id: string;
  name: string;
  profilePhoto: string;
  level: number;
  levelScore: number;
  trustScore: number;
  skills: string[];
  experience: number;
  rating: number;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  verificationStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'VERIFIED';
}

export const workerService = {
  getProfile: async () => {
    const response = await apiClient.get<Worker>('/auth/profile');
    return response.data;
  },

  updateAvailability: async (id: string, availability: string) => {
    const response = await apiClient.put(`/workers/${id}/availability`, { availability });
    return response.data;
  },
};
