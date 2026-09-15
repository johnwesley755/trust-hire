import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { queryKeys } from '../api/queryKeys';
import { toast } from 'sonner';

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationService.getNotifications(),
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData(queryKeys.notifications.all, (old: any) => {
        if (!old) return old;
        const list = Array.isArray(old) ? old : old.notifications;
        if (!list) return old;
        const updated = list.map((n: any) => (n.id === id ? { ...n, isRead: true } : n));
        return Array.isArray(old) ? updated : { ...old, notifications: updated };
      });
      queryClient.setQueryData(['unreadCount'], (prev: any) => {
        const count = typeof prev === 'number' ? prev : prev?.count || 0;
        return Math.max(0, count - 1);
      });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.setQueryData(queryKeys.notifications.all, (old: any) => {
        if (!old) return old;
        const list = Array.isArray(old) ? old : old.notifications;
        if (!list) return old;
        const updated = list.map((n: any) => ({ ...n, isRead: true }));
        return Array.isArray(old) ? updated : { ...old, notifications: updated };
      });
      queryClient.setQueryData(['unreadCount'], 0);
    },
  });
};
