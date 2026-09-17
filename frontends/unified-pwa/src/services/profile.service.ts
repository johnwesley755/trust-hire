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
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  phoneNumber?: string;
  email?: string;
  contactPerson?: string;
  gstin?: string;
}

export interface WorkerProfile {
  id?: string;
  userId?: string;
  profileImageUrl?: string;
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
  trustScore?: number;
}

export const profileService = {
  getProfile: async (): Promise<any> => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      user = null;
    }

    const role = user?.role;
    if (role === 'EMPLOYER') {
      const empRes = await apiClient.get<any>('/api/employer/profile');
      const data = empRes.data;
      if (data?.profile_image_url) data.profileImageUrl = data.profile_image_url;
      return data;
    } else if (role === 'WORKER') {
      const workerRes = await apiClient.get<any>('/api/worker/profile');
      const data = workerRes.data;
      return {
        ...data,
        fullName: data?.fullName || '',
        bio: data?.bio || '',
        skills: data?.skills || '',
        location: data?.location || '',
        city: data?.city || '',
        address: data?.address || '',
        level: data?.level || '1',
        experienceYears: data?.experienceYears || 0,
        hourlyRate: data?.hourlyRate || 0,
        trustScore: data?.trustScore || 0
      };
    } else {
      const response = await apiClient.get<any>('/api/auth/me');
      const fetchedUser = response.data;
      if (fetchedUser?.role === 'EMPLOYER') {
        const empRes = await apiClient.get<any>('/api/employer/profile');
        const data = empRes.data;
        if (data?.profile_image_url) data.profileImageUrl = data.profile_image_url;
        return data;
      } else {
        const workerRes = await apiClient.get<any>('/api/worker/profile');
        const data = workerRes.data;
        return {
          ...data,
          fullName: data?.fullName || '',
          bio: data?.bio || '',
          skills: data?.skills || '',
          location: data?.location || '',
          city: data?.city || '',
          address: data?.address || '',
          level: data?.level || '1',
          experienceYears: data?.experienceYears || 0,
          hourlyRate: data?.hourlyRate || 0,
          trustScore: data?.trustScore || 0
        };
      }
    }
  },

  updateProfile: async (updates: any): Promise<any> => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.role === 'EMPLOYER') {
      const response = await apiClient.post<any>('/api/employer/profile', updates);
      return response.data;
    } else {
      const response = await apiClient.put<any>('/api/worker/profile', updates);
      return response.data;
    }
  },

  getEmployerProfile: async (): Promise<EmployerProfile | null> => {
    const response = await apiClient.get<any>('/api/employer/profile');
    const data = response.data;
    if (!data) return null;
    if (data.profile_image_url) data.profileImageUrl = data.profile_image_url;
    return data;
  },

  updateEmployerProfile: async (updates: Partial<EmployerProfile>): Promise<EmployerProfile> => {
    const response = await apiClient.post<any>('/api/employer/profile', updates);
    return response.data;
  },

  getWorkerProfile: async (): Promise<WorkerProfile | null> => {
    const response = await apiClient.get<any>('/api/worker/profile');
    const data = response.data;
    if (!data) return null;
    return {
      ...data,
      fullName: data.fullName || '',
      bio: data.bio || '',
      skills: data.skills || '',
      location: data.location || '',
      city: data.city || '',
      address: data.address || '',
      level: data.level || '1',
      experienceYears: data.experienceYears || 0,
      hourlyRate: data.hourlyRate || 0,
      trustScore: data.trustScore || 0
    };
  },

  updateWorkerProfile: async (updates: Partial<WorkerProfile>): Promise<WorkerProfile> => {
    const response = await apiClient.put<any>('/api/worker/profile', updates);
    return response.data;
  },

  incrementProfileView: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/worker/profile/${userId}/view`);
  },

  getGlobalStats: async (): Promise<{ totalWorkers: number }> => {
    const response = await apiClient.get<any>('/api/worker/stats');
    return response.data.data;
  }
};
