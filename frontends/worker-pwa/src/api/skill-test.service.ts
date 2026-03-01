import apiClient from './apiClient';

export interface SkillTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  points: number;
  description: string;
}

export interface TestSubmission {
  testId: string;
  clerkId: string;
  answers: any[];
  maxPoints: number;
}

export interface TestResult {
  testId: string;
  score: number;
  passed: boolean;
  pointsEarned: number;
  feedback: string;
}

export const skillTestService = {
  getAvailableTests: async (category?: string): Promise<SkillTest[]> => {
    const response = await apiClient.get<SkillTest[]>('/api/skill-tests/available', {
      params: { category }
    });
    return response.data;
  },

  submitTest: async (submission: TestSubmission): Promise<TestResult> => {
    const response = await apiClient.post<TestResult>('/api/skill-tests/submit', submission);
    return response.data;
  }
};
