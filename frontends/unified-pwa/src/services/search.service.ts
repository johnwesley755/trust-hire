import apiClient from '../api/apiClient';
import type { Job, JobSearch } from '../types';

export type { JobSearch };

export interface SearchParams {
  q?: string;
  query?: string;
  category?: string;
  industry?: string;
  minBudget?: number;
  maxBudget?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  city?: string;
  location?: string;
  skills?: string;
  level?: string;
  lat?: number;
  lon?: number;
}

export interface WorkerSearch {
  userId: string;
  name: string;
  bio: string;
  skills: string;
  location: string;
  city?: string;
  level: string;
  isVerified: boolean;
  profileImageUrl: string;
  status: string;
  trustScore: number;
}

export const searchWorkers = async (
  query?: string,
  location?: string,
  city?: string,
  level?: string,
  radius?: number,
  lat?: number,
  lon?: number,
  skills?: string
): Promise<WorkerSearch[]> => {
  const response = await apiClient.get<WorkerSearch[]>('/api/search/workers', {
    params: { query, location, city, level, radius, lat, lon, skills }
  });
  return response.data;
};

export const searchJobs = async (
  query?: string,
  location?: string,
  city?: string,
  industry?: string,
  minBudget?: number,
  maxBudget?: number,
  radius?: number,
  lat?: number,
  lon?: number
): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>('/api/search/jobs', {
    params: { query, location, city, industry, minBudget, maxBudget, radius, lat, lon }
  });
  return response.data;
};

export const searchService = {
  searchJobs: async (params?: SearchParams): Promise<Job[]> => {
    const res = await apiClient.get<Job[]>('/api/search/jobs', { params });
    return res.data;
  },
  searchWorkers: async (params?: SearchParams): Promise<WorkerSearch[]> => {
    const res = await apiClient.get<WorkerSearch[]>('/api/search/workers', { params });
    return res.data;
  },
  getLocations: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('/api/search/locations');
    return res.data;
  },
  getSkills: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('/api/search/skills');
    return res.data;
  },
};

