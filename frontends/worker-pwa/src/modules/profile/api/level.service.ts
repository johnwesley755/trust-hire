import apiClient from '../../../core/api/apiClient';

export interface LevelDetails {
  workerId: string;
  currentLevel: number;
  levelScore: number;
  components: {
    skillScore: number;
    experienceScore: number;
    performanceScore: number;
    reliabilityScore: number;
  };
  nextLevel?: number;
  pointsToNextLevel?: number;
  salaryRange: string;
  achievements: string[];
}

export interface LevelProgress {
  currentLevel: number;
  levelScore: number;
  nextLevel: number;
  progress: number;
  recommendations: string[];
  estimatedTime: string;
}

export const levelService = {
  getLevelDetails: async (workerId: string): Promise<LevelDetails> => {
    const response = await apiClient.get<LevelDetails>(`/api/levels/worker/${workerId}`);
    return response.data;
  },

  getLevelProgress: async (workerId: string): Promise<LevelProgress> => {
    const response = await apiClient.get<LevelProgress>(`/api/levels/progress/${workerId}`);
    return response.data;
  }
};
