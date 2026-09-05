import apiClient from '../api/apiClient';
import type { JobApplication } from '../types';

export type { JobApplication };

export const applicationService = {
  applyForJob: async (jobIdOrPayload: string | { jobId: string; coverLetter?: string }, coverLetter?: string): Promise<JobApplication> => {
    let payload = typeof jobIdOrPayload === 'string'
      ? { jobId: jobIdOrPayload, coverLetter }
      : jobIdOrPayload;
    const res = await apiClient.post<JobApplication>('/api/jobs/applications', payload);
    return res.data;
  },
  getMyApplications: async (): Promise<JobApplication[]> => {
    const res = await apiClient.get<JobApplication[]>('/api/jobs/applications/my');
    return res.data;
  },
  getJobApplications: async (jobId: string): Promise<JobApplication[]> => {
    const res = await apiClient.get<JobApplication[]>(`/api/jobs/applications/job/${jobId}`);
    return res.data;
  },
  getApplicationsByJobs: async (jobIds: string[]): Promise<JobApplication[]> => {
    const res = await apiClient.post<JobApplication[]>('/api/jobs/applications/by-jobs', { jobIds });
    return res.data;
  },
  getApplicationsForEmployerJobs: async (jobIds: string[]): Promise<JobApplication[]> => {
    const res = await apiClient.post<JobApplication[]>('/api/jobs/applications/by-jobs', { jobIds });
    return res.data;
  },
  updateApplicationStatus: async (applicationId: string, status: string): Promise<any> => {
    const res = await apiClient.patch(`/api/jobs/applications/${applicationId}/status`, { status });
    return res.data;
  },
  updateStatus: async (applicationId: string, status: string): Promise<any> => {
    const res = await apiClient.patch(`/api/jobs/applications/${applicationId}/status`, { status });
    return res.data;
  },
};
