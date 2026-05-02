import apiClient from "../api/apiClient";

export interface AppNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
}

export const notificationService = {
    getNotifications: async (): Promise<AppNotification[]> => {
        const response = await apiClient.get('/api/notifications');
        return response.data.data;
    },
    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/notifications/unread/count');
        return response.data.data;
    },
    markAsRead: async (id: string): Promise<AppNotification> => {
        const response = await apiClient.patch(`/api/notifications/${id}/read`);
        return response.data.data;
    },
    markAllAsRead: async (): Promise<void> => {
        await apiClient.patch('/api/notifications/read-all');
    },
    deleteNotification: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/notifications/${id}`);
    },
    deleteAllNotifications: async (): Promise<void> => {
        await apiClient.delete('/api/notifications/all');
    }
};
