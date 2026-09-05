import apiClient from '../api/apiClient';

export const mediaService = {
  uploadMedia: async (file: File): Promise<{ url: string; publicId?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string; publicId: string }>('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<{ url: string }>('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
    return res.data;
  },
};
