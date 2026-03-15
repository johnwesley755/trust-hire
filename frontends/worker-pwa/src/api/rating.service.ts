import apiClient from './apiClient';

export interface Rating {
  id?: string;
  reviewerId?: string;
  rateeId: string;
  jobId: string;
  score: number;
  comment: string;
  createdAt?: string;
}

export const ratingService = {
  submitRating: async (rating: Rating): Promise<Rating> => {
    const response = await apiClient.post<Rating>('/api/ratings', rating);
    return response.data;
  },

  getUserRatings: async (userId: string): Promise<Rating[]> => {
    const response = await apiClient.get<Rating[]>(`/api/ratings/user/${userId}`);
    return response.data;
  },

  getAverageRating: async (userId: string): Promise<number> => {
    const response = await apiClient.get<number>(`/api/ratings/user/${userId}/average`);
    return response.data;
  }
};
