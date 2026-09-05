import apiClient from '../api/apiClient';
import type { Rating } from '../types';

export const ratingService = {
  createRating: async (data: { rateeId: string; jobId: string; score: number; comment?: string }): Promise<Rating> => {
    const res = await apiClient.post<Rating>('/api/ratings', data);
    return res.data;
  },
  submitRating: async (data: { rateeId: string; jobId: string; score: number; comment?: string }): Promise<Rating> => {
    const res = await apiClient.post<Rating>('/api/ratings', data);
    return res.data;
  },
  getRatingsForRatee: async (rateeId: string): Promise<Rating[]> => {
    const res = await apiClient.get<Rating[]>(`/api/ratings/ratee/${rateeId}`);
    return res.data;
  },
  getRatingsForJob: async (jobId: string): Promise<Rating[]> => {
    const res = await apiClient.get<Rating[]>(`/api/ratings/job/${jobId}`);
    return res.data;
  },
  getRatingSummary: async (userId: string): Promise<any> => {
    const res = await apiClient.get(`/api/ratings/summary/${userId}`);
    return res.data;
  },
};
