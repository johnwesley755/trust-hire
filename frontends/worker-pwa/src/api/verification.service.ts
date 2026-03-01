import apiClient from './apiClient';

export interface VerificationRecord {
  id: string;
  clerkId: string;
  aadhaarMasked?: string;
  identityVerified: boolean;
  faceMatchScore?: number;
  status: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  updatedAt: string;
}

export const verificationService = {
  uploadAadhaar: async (file: File): Promise<VerificationRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<VerificationRecord>('/api/verification/upload-doc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadLiveCapture: async (file: File): Promise<VerificationRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<VerificationRecord>('/api/verification/capture-live', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getStatus: async (): Promise<VerificationRecord> => {
    const response = await apiClient.get<VerificationRecord>('/api/verification/status');
    return response.data;
  }
};
