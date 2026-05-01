import apiClient from '../../../core/api/apiClient';

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
  searchWorkers: async (params: { 
    latitude: number; 
    longitude: number; 
    radius: number;
    skills?: string;
    minLevel?: number;
  }) => {
    const response = await apiClient.get<{ workers: Worker[]; total: number }>('/workers/search', { params });
    return response.data;
  },

  getWorkerById: async (id: string) => {
    const response = await apiClient.post<any>('/api/worker/profiles/by-user-ids', [id]);
    const worker = response.data.data[0];

    if (!worker) {
      throw new Error('Worker not found');
    }

    return {
      id: worker.userId,
      userId: worker.userId,
      name: worker.fullName || [worker.firstName, worker.lastName].filter(Boolean).join(' ') || 'Unknown Worker',
      profilePhoto: worker.profileImageUrl || '',
      level: Number((worker.level || 'L1').replace(/\D/g, '')) || 1,
      trustScore: worker.trustScore || 30,
      skills: worker.skills ? worker.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [],
      experience: worker.experienceYears || 0,
      rating: 4.8,
      distance: 0,
      location: worker.city || worker.address || '',
      address: worker.address,
      city: worker.city,
      latitude: worker.latitude,
      longitude: worker.longitude,
      bio: worker.bio,
      email: worker.email,
      phoneNumber: worker.phoneNumber,
      availability: worker.isAvailable ? 'AVAILABLE' as const : 'BUSY' as const,
      salaryRange: '',
      verificationStatus: worker.identityVerified ? 'VERIFIED' as const : 'PENDING' as const,
    } satisfies Worker;
  },

  getProfilesByUserIds: async (userIds: string[]): Promise<WorkerProfileSummary[]> => {
    const response = await apiClient.post<any>('/api/worker/profiles/by-user-ids', userIds);
    return response.data.data;
  },

  incrementProfileView: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/worker/profile/${userId}/view`);
  },

  getTrustScore: async (userId: string): Promise<TrustScoreResponse> => {
    const response = await apiClient.get<any>(`/api/worker/trust-score/${userId}`);
    return response.data.data;
  },

  getWorkerRatings: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get<any>(`/api/ratings/user/${userId}`);
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  }
};
