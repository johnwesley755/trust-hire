import apiClient from './apiClient';

export interface VerificationStatus {
  workerClerkId: string;
  docImageUrl: string;
  liveImageUrl: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  updatedAt: string;
}

export const verificationService = {
  uploadDocImage: async (file: File): Promise<VerificationStatus> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<VerificationStatus>('/api/verification/upload/doc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadLiveCapture: async (file: File): Promise<VerificationStatus> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<VerificationStatus>('/api/verification/upload/live', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getStatus: async (): Promise<VerificationStatus> => {
    const response = await apiClient.get<VerificationStatus>('/api/verification/status');
    return response.data;
  }
};
