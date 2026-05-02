import apiClient from '../api/apiClient';

export interface MediaResponse {
  id: string;
  url: string;
  type: string;
  ownerId: string;
}

export const mediaService = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void): Promise<MediaResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<MediaResponse>('/api/media/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  getMyMedia: async (): Promise<MediaResponse[]> => {
    const response = await apiClient.get<MediaResponse[]>('/api/media/my');
    return response.data;
  },

  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/media/${id}`);
  }
};
