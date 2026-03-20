import apiClient from '../../../core/api/apiClient';

export interface JobApplication {
  id?: string;
  jobId: string;
  workerId: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  appliedAt: string;
  coverLetter?: string;
}

export const applicationService = {
  applyForJob: async (application: Partial<JobApplication>): Promise<JobApplication> => {
    const response = await apiClient.post<JobApplication>('/api/jobs/applications', application);
    return response.data;
  },

  getMyApplications: async (): Promise<JobApplication[]> => {
    const response = await apiClient.get<JobApplication[]>('/api/jobs/applications/my');
    return response.data;
  },

  getJobApplications: async (jobId: string): Promise<JobApplication[]> => {
    const response = await apiClient.get<JobApplication[]>(`/api/jobs/applications/job/${jobId}`);
    return response.data;
  },

  getApplicationsByJobs: async (jobIds: string[]): Promise<JobApplication[]> => {
    const response = await apiClient.post<JobApplication[]>('/api/jobs/applications/by-jobs', jobIds);
    return response.data;
  },

  updateStatus: async (id: string, status: JobApplication['status']): Promise<JobApplication> => {
    const response = await apiClient.patch<JobApplication>(`/api/jobs/applications/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
