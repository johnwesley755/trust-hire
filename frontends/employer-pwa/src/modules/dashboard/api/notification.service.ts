import apiClient from '../../../core/api/apiClient';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'ALERT';
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await apiClient.get<Notification[]>('/api/notifications');
        return response.data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await apiClient.patch(`/api/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await apiClient.patch('/api/notifications/read-all');
    }
};
