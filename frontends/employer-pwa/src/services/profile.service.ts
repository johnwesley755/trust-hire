import apiClient from '../api/apiClient';

export interface EmployerProfile {
  id?: string;
  userId: string;
  profileImageUrl?: string;
  companyName: string;
  industry: string;
  companyWebsite: string;
  profileBio: string;
  businessTier: string;
  location?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
}

export const profileService = {
  getProfile: async (): Promise<EmployerProfile> => {
    const response = await apiClient.get<any>('/api/employer/profile');
    const data = response.data;
    // Map snake_case from backend to camelCase for frontend
    if (data.profile_image_url) {
      data.profileImageUrl = data.profile_image_url;
    }
    return data;
  },

  updateProfile: async (updates: Partial<EmployerProfile>): Promise<EmployerProfile> => {
    const response = await apiClient.post<any>('/api/employer/profile', updates);
    const data = response.data;
    if (data.profile_image_url) {
      data.profileImageUrl = data.profile_image_url;
    }
    return data;
  }
};
