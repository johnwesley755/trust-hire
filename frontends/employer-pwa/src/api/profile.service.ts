import apiClient from './apiClient';

export interface EmployerProfile {
  id?: string;
  userId: string;
  companyName: string;
  industry: string;
  companyWebsite: string;
  profileBio: string;
  businessTier: string;
  isVerified: boolean;
}

export const profileService = {
  getProfile: async (): Promise<EmployerProfile> => {
    const response = await apiClient.get<EmployerProfile>('/api/employer/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<EmployerProfile>): Promise<EmployerProfile> => {
    const response = await apiClient.post<EmployerProfile>('/api/employer/profile', updates);
    return response.data;
  }
};
