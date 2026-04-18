import apiClient from '../../../core/api/apiClient';

export interface SkillTest {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  points: number;
  description: string;
  questions?: SkillTestQuestion[];
}

export interface SkillTestQuestion {
  id: string;
  questionText: string;
  options: string[];
  points: number;
}

export interface TestSubmission {
  testId: string;
  answers: number[];
}

export interface TestResult {
  testId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  feedback: string;
}

export const skillTestService = {
  getAvailableTests: async (category?: string): Promise<SkillTest[]> => {
    const response = await apiClient.get<SkillTest[]>('/api/skill-tests/available', {
      params: { category }
    });
    return response.data;
  },

  getTestById: async (id: string): Promise<SkillTest> => {
    const response = await apiClient.get<SkillTest>(`/api/skill-tests/${id}`);
    return response.data;
  },

  submitTest: async (submission: TestSubmission): Promise<TestResult> => {
    const response = await apiClient.post<TestResult>('/api/skill-tests/submit', submission);
    return response.data;
  }
};
