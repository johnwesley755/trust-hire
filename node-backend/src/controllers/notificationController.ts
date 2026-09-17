import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getMyNotifications = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const notifications = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    return c.json(ApiResponse.ok("Notifications fetched", notifications));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getUnreadCount = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const count = await prisma.notifications.count({
      where: { user_id: userId, is_read: false }
    });
    return c.json(ApiResponse.ok("Unread count fetched", count));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const markAsRead = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const id = c.req.param('id') as string;
    const result = await prisma.notifications.updateMany({
      where: { id, user_id: userId },
      data: { is_read: true, updated_at: new Date() }
    });

    if (result.count === 0) {
      return c.json(ApiResponse.error("Notification not found or access denied"), 404 as any);
    }

    return c.json(ApiResponse.ok("Notification marked as read", { id, is_read: true }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const markAllAsRead = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true, updated_at: new Date() }
    });
    return c.json(ApiResponse.ok("All notifications marked as read", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const deleteNotification = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const id = c.req.param('id') as string;
    const result = await prisma.notifications.deleteMany({
      where: { id, user_id: userId }
    });

    if (result.count === 0) {
      return c.json(ApiResponse.error("Notification not found or access denied"), 404 as any);
    }

    return c.json(ApiResponse.ok("Notification deleted", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const deleteAllNotifications = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    await prisma.notifications.deleteMany({ where: { user_id: userId } });
    return c.json(ApiResponse.ok("All notifications deleted", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
