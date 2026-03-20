import apiClient from '../../../core/api/apiClient';

export interface EmployerVerificationRecord {
  id: string;
  userId?: string;
  businessTier: 'BASIC' | 'VERIFIED' | 'PREMIUM';
  isVerified: boolean;
  docUrl?: string;
  status: 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  updatedAt: string;
}

export const verificationService = {
  uploadBusinessDoc: async (file: File): Promise<EmployerVerificationRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<EmployerVerificationRecord>('/api/verification/employer/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getStatus: async (): Promise<EmployerVerificationRecord> => {
    const response = await apiClient.get<EmployerVerificationRecord>('/api/verification/employer/status');
    return response.data;
  },

  upgradeTier: async (tier: 'VERIFIED' | 'PREMIUM'): Promise<EmployerVerificationRecord> => {
    const response = await apiClient.post<EmployerVerificationRecord>(`/api/verification/employer/upgrade?tier=${tier}`);
    return response.data;
  }
};
