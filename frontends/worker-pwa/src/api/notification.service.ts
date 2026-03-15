import apiClient from './apiClient';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>('/api/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/api/notifications/${id}/read`);
  }
};
