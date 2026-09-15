import apiClient from '../api/apiClient';

export interface Worker {
  id: string;
  name: string;
  profilePhoto: string;
  level: number;
  trustScore: number;
  skills: string[];
  experience: number;
  rating: number;
  distance: number;
  location?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  userId?: string;
  email?: string;
  phoneNumber?: string;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  salaryRange: string;
  verificationStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'VERIFIED';
  isOfferSent?: boolean;
}

export interface WorkerProfileSummary {
  userId: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  skills?: string;
  experienceYears?: number;
  level?: string;
  identityVerified?: boolean;
  trustScore?: number;
  reliabilityScore?: number;
  performanceScore?: number;
  skillScore?: number;
  isAvailable?: boolean;
}

export interface TrustScoreResponse {
  score: number;
  identityVerified: boolean;
  skillsVerifiedCount: number;
  avgRating: number;
  reliabilityRate: number;
  lastUpdated: string;
}

export const workerService = {
  getProfile: () => apiClient.get('/api/worker/me'),
  updateProfile: (data: any) => apiClient.put('/api/worker/profile', data),
  
  searchWorkers: async (params: { 
    latitude?: number; 
    longitude?: number; 
    radius?: number;
    skills?: string;
    minLevel?: number;
  }) => {
    const response = await apiClient.get<any>('/api/search/workers', { params });
    return response.data;
  },

  getWorkerById: async (id: string): Promise<Worker> => {
    try {
      const response = await apiClient.post<any>('/api/worker/profiles/by-user-ids', [id]);
      const worker = response.data?.[0];

      if (!worker) {
        throw new Error('Worker not found');
      }

      return {
        id: worker.user_id || worker.userId || id,
        userId: worker.user_id || worker.userId || id,
        name: worker.full_name || worker.fullName || [worker.first_name || worker.firstName, worker.last_name || worker.lastName].filter(Boolean).join(' ') || 'Specialist Worker',
        profilePhoto: worker.profile_image_url || worker.profileImageUrl || '',
        level: Number((worker.level || 'L1').replace(/\D/g, '')) || 1,
        trustScore: worker.trust_score || worker.trustScore || 30,
        skills: worker.skills ? worker.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : [],
        experience: worker.experience_years || worker.experienceYears || 0,
        rating: worker.rating || 0,
        distance: 0,
        location: worker.city || worker.address || worker.location || '',
        address: worker.address,
        city: worker.city,
        latitude: worker.latitude,
        longitude: worker.longitude,
        bio: worker.bio,
        email: worker.email,
        phoneNumber: worker.phone_number || worker.phoneNumber,
        availability: (worker.is_available || worker.isAvailable) ? 'AVAILABLE' : 'BUSY',
        salaryRange: worker.hourly_rate || worker.hourlyRate ? `₹${worker.hourly_rate || worker.hourlyRate}/hr` : '',
        verificationStatus: (worker.identity_verified || worker.identityVerified) ? 'VERIFIED' : 'PENDING',
      };
    } catch {
      const singleRes = await apiClient.get<any>(`/api/worker/${id}`);
      const worker = singleRes.data;
      return {
        id: worker.user_id || worker.userId || id,
        userId: worker.user_id || worker.userId || id,
        name: worker.full_name || worker.fullName || [worker.first_name || worker.firstName, worker.last_name || worker.lastName].filter(Boolean).join(' ') || 'Specialist Worker',
        profilePhoto: worker.profile_image_url || worker.profileImageUrl || '',
        level: Number((worker.level || 'L1').replace(/\D/g, '')) || 1,
        trustScore: worker.trust_score || worker.trustScore || 30,
        skills: Array.isArray(worker.skills) ? worker.skills : (worker.skills ? worker.skills.split(',') : []),
        experience: worker.experience_years || worker.experienceYears || 0,
        rating: worker.rating || 0,
        distance: 0,
        location: worker.location || '',
        address: worker.address,
        city: worker.city,
        latitude: worker.latitude,
        longitude: worker.longitude,
        bio: worker.bio,
        email: worker.email,
        phoneNumber: worker.phone_number || worker.phoneNumber,
        availability: 'AVAILABLE',
        salaryRange: '',
        verificationStatus: (worker.identity_verified || worker.identityVerified || worker.isVerified) ? 'VERIFIED' : 'PENDING',
      };
    }
  },

  getProfilesByUserIds: async (userIds: string[]): Promise<WorkerProfileSummary[]> => {
    const response = await apiClient.post<any>('/api/worker/profiles/by-user-ids', userIds);
    return (response.data || []).map((worker: any) => ({
      userId: worker.user_id || worker.userId,
      fullName: worker.full_name || worker.fullName,
      firstName: worker.first_name || worker.firstName,
      lastName: worker.last_name || worker.lastName,
      email: worker.email,
      phoneNumber: worker.phone_number || worker.phoneNumber,
      profileImageUrl: worker.profile_image_url || worker.profileImageUrl,
      address: worker.address,
      city: worker.city,
      latitude: worker.latitude,
      longitude: worker.longitude,
      bio: worker.bio,
      skills: worker.skills,
      experienceYears: worker.experience_years || worker.experienceYears,
      level: worker.level,
      identityVerified: worker.identity_verified || worker.identityVerified,
      trustScore: worker.trust_score || worker.trustScore,
      reliabilityScore: worker.reliability_score || worker.reliabilityScore,
      performanceScore: worker.performance_score || worker.performanceScore,
      skillScore: worker.skill_score || worker.skillScore,
      isAvailable: worker.is_available || worker.isAvailable,
    }));
  },

  incrementProfileView: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/worker/profile/${userId}/view`);
  },

  getTrustScore: async (userId: string): Promise<TrustScoreResponse> => {
    const response = await apiClient.get<any>(`/api/worker/trust-score/${userId}`);
    return response.data || {
      score: 85,
      identityVerified: true,
      skillsVerifiedCount: 3,
      avgRating: 4.8,
      reliabilityRate: 95,
      lastUpdated: new Date().toISOString()
    };
  },

  getWorkerRatings: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get<any>(`/api/ratings/user/${userId}`);
    return response.data || [];
  },

  getScoring: (id: string) => apiClient.get(`/api/worker/scoring/${id}`),
  getLevel: (id: string) => apiClient.get(`/api/worker/level/${id}`),
  completeOnboarding: (data: any) => apiClient.post('/api/worker/complete-onboarding', data),
};
