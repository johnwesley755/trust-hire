import apiClient from './apiClient';

export interface TrustScoreDetails {
  score: number;
  identityVerified: boolean;
  skillsVerifiedCount: number;
  avgRating: number;
  reliabilityRate: number; // 0-1
  userId: string;
}

export const trustScoreService = {
  getTrustScore: async (userId: string): Promise<TrustScoreDetails> => {
    // This connects to the worker-service (profile level/status)
    const response = await apiClient.get<TrustScoreDetails>(`/api/worker/trust-score/${userId}`);
    return response.data;
  }
};
