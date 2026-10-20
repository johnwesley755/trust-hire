import apiClient from '../api/apiClient';

export interface EmployerProfile {
  id?: string;
  userId: string;
  profileImageUrl?: string;
  profile_image_url?: string;
  profilePhoto?: string;
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
  profile_image_url?: string;
  profilePhoto?: string;
  fullName: string;
  location: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  level: string;
  bio: string;
  skills: string | string[];
  experienceYears: number;
  hourlyRate: number;
  isAvailable: boolean;
  profileViews?: number;
  trustScore?: number;
  dob?: string | null;
  gender?: string | null;
  whatsappOptIn?: boolean;
  area?: string | null;
  willingToRelocate?: boolean;
  preferredCities?: string[];
  highestEducation?: string | null;
  isPursuingEducation?: boolean;
  collegeName?: string | null;
  degree?: string | null;
  specialization?: string | null;
  schoolMedium?: string | null;
  englishProficiency?: string | null;
  languagesKnown?: string[];
  preferredRoles?: string[];
  resumeUrl?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  isVerified?: boolean;
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
      fullName: data.fullName || data.full_name || '',
      bio: data.bio || '',
      skills: data.skills || '',
      location: data.location || '',
      city: data.city || '',
      address: data.address || '',
      level: data.level || '1',
      experienceYears: data.experienceYears ?? data.experience_years ?? 0,
      hourlyRate: data.hourlyRate ?? data.hourly_rate ?? 0,
      trustScore: data.trustScore ?? data.trust_score ?? 0,
      dob: data.dob || null,
      gender: data.gender || null,
      whatsappOptIn: data.whatsapp_opt_in ?? data.whatsappOptIn ?? true,
      area: data.area || null,
      willingToRelocate: data.willing_to_relocate ?? data.willingToRelocate ?? false,
      preferredCities: data.preferred_cities || data.preferredCities || [],
      highestEducation: data.highest_education || data.highestEducation || null,
      isPursuingEducation: data.is_pursuing_education ?? data.isPursuingEducation ?? false,
      collegeName: data.college_name || data.collegeName || null,
      degree: data.degree || null,
      specialization: data.specialization || null,
      schoolMedium: data.school_medium || data.schoolMedium || null,
      englishProficiency: data.english_proficiency || data.englishProficiency || 'BASIC',
      languagesKnown: data.languages_known || data.languagesKnown || [],
      preferredRoles: data.preferred_roles || data.preferredRoles || [],
      resumeUrl: data.resume_url || data.resumeUrl || null,
      phoneNumber: data.phoneNumber || data.phone_number || null,
      email: data.email || null,
      isVerified: Boolean(data.is_verified || data.isVerified),
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
