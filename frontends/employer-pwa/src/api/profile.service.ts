import apiClient from './apiClient';

export interface EmployerProfile {
  id?: string;
  clerkId: string;
  companyName: string;
  industry: string;
  companyWebsite: string;
  profileBio: string;
  businessTier: string;
  isVerified: boolean;
}

export const profileService = {
  getProfile: async (): Promise<EmployerProfile> => {
    const response = await apiClient.get<EmployerProfile>('/api/identity/profile/employer');
    return response.data;
  },

  updateProfile: async (updates: Partial<EmployerProfile>): Promise<EmployerProfile> => {
    const response = await apiClient.put<EmployerProfile>('/api/identity/profile/employer', updates);
    return response.data;
  }
};
