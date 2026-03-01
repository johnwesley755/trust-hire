import apiClient from './apiClient';

export interface TrustScoreDetails {
  score: number;
  identityVerified: boolean;
  skillsVerifiedCount: number;
  avgRating: number;
  reliabilityRate: number; // 0-1
  lastUpdated: string;
}

export const trustScoreService = {
  getTrustScore: async (clerkId: string): Promise<TrustScoreDetails> => {
    // This connects to the worker-service (profile level/status)
    const response = await apiClient.get<TrustScoreDetails>(`/api/worker/trust-score/${clerkId}`);
    return response.data;
  }
};
