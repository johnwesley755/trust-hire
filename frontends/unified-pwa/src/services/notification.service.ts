import apiClient from '../api/apiClient';
import type { NotificationItem } from '../types';

export type AppNotification = NotificationItem;

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiClient.get<NotificationItem[]>('/api/notifications');
    return res.data;
  },
  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<{ count: number } | number>('/api/notifications/unread/count');
    if (typeof res.data === 'number') return res.data;
    if (res.data && typeof res.data === 'object' && 'count' in res.data) return (res.data as any).count;
    return 0;
  },
  markAsRead: async (id: string): Promise<any> => {
    const res = await apiClient.patch(`/api/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async (): Promise<any> => {
    const res = await apiClient.patch('/api/notifications/read-all');
    return res.data;
  },
  deleteNotification: async (id: string): Promise<any> => {
    const res = await apiClient.delete(`/api/notifications/${id}`);
    return res.data;
  },
  deleteAllNotifications: async (): Promise<any> => {
    const res = await apiClient.delete('/api/notifications/all');
    return res.data;
  },
};

