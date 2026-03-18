import apiClient from './apiClient';

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
  bio?: string;
  skills?: string;
  experienceYears?: number;
  level?: string;
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
    const response = await apiClient.post<WorkerProfileSummary[]>('/api/worker/profiles/by-user-ids', [id]);
    const worker = response.data[0];

    if (!worker) {
      throw new Error('Worker not found');
    }

    return {
      id: worker.userId,
      userId: worker.userId,
      name: worker.fullName || [worker.firstName, worker.lastName].filter(Boolean).join(' ') || 'Unknown Worker',
      profilePhoto: worker.profileImageUrl || '',
      level: Number((worker.level || 'L1').replace(/\D/g, '')) || 1,
      trustScore: 450,
      skills: worker.skills ? worker.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [],
      experience: worker.experienceYears || 0,
      rating: 4.8,
      distance: 0,
      location: worker.city || worker.address || '',
      address: worker.address,
      city: worker.city,
      bio: worker.bio,
      email: worker.email,
      phoneNumber: worker.phoneNumber,
      availability: 'AVAILABLE' as const,
      salaryRange: '',
      verificationStatus: 'VERIFIED' as const,
    } satisfies Worker;
  },

  getProfilesByUserIds: async (userIds: string[]): Promise<WorkerProfileSummary[]> => {
    const response = await apiClient.post<WorkerProfileSummary[]>('/api/worker/profiles/by-user-ids', userIds);
    return response.data;
  },
};
