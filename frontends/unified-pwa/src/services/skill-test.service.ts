import apiClient from '../api/apiClient';
import type { SkillTest, SkillTestResult, SkillTestQuestion } from '../types';

export type { SkillTest, SkillTestResult, SkillTestQuestion };
export type TestResult = SkillTestResult;

export const skillTestService = {
  getAllTests: async (category?: string): Promise<SkillTest[]> => {
    const res = await apiClient.get<SkillTest[]>('/api/skill-tests', { params: { category } });
    return res.data;
  },
  getAvailableTests: async (category?: string): Promise<SkillTest[]> => {
    const res = await apiClient.get<SkillTest[]>('/api/skill-tests', { params: { category } });
    return res.data;
  },
  getTestById: async (id: string): Promise<SkillTest> => {
    const res = await apiClient.get<SkillTest>(`/api/skill-tests/${id}`);
    return res.data;
  },
  submitTest: async (id: string, answers: Record<string, number> | number[]): Promise<SkillTestResult> => {
    const answersPayload = Array.isArray(answers) 
      ? answers.reduce((acc, ans, idx) => ({ ...acc, [idx.toString()]: ans }), {})
      : answers;
    const res = await apiClient.post<SkillTestResult>(`/api/skill-tests/${id}/submit`, { answers: answersPayload });
    return res.data;
  },
  getResultsByWorker: async (workerId: string): Promise<SkillTestResult[]> => {
    const res = await apiClient.get<SkillTestResult[]>(`/api/skill-tests/results/worker/${workerId}`);
    return res.data;
  },
};
