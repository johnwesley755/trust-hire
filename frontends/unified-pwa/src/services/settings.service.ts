import apiClient from '../api/apiClient';

export const settingsService = {
  getSettings: () => apiClient.get('/api/settings'),
  updateSettings: (data: any) => apiClient.put('/api/settings', data),
};
