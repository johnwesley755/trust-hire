import apiClient from '../api/apiClient';

export const verificationService = {
  getStatus: async (): Promise<any> => {
    const res = await apiClient.get('/api/verification/status');
    return res.data;
  },
  initiate: async (docImageUrl: string, liveImageUrl: string): Promise<any> => {
    const res = await apiClient.post('/api/verification/initiate', { docImageUrl, liveImageUrl });
    return res.data;
  },
  uploadAadhaar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string }>('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  uploadLiveCapture: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string }>('/api/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  submitAadhaar: (data: any) => apiClient.post('/api/verification/aadhaar', data),
  submitBiometricMatch: (data: any) => apiClient.post('/api/verification/biometric-match', data),
  review: (data: any) => apiClient.post('/api/verification/review', data),
};
