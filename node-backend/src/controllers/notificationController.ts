import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const notifications = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    res.json(ApiResponse.ok("Notifications fetched", notifications));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const count = await prisma.notifications.count({
      where: { user_id: userId, is_read: false }
    });
    res.json(ApiResponse.ok("Unread count fetched", count));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const notification = await prisma.notifications.update({
      where: { id },
      data: { is_read: true, updated_at: new Date() }
    });
    res.json(ApiResponse.ok("Notification marked as read", notification));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true, updated_at: new Date() }
    });
    res.json(ApiResponse.ok("All notifications marked as read", null));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.notifications.delete({ where: { id } });
    res.json(ApiResponse.ok("Notification deleted", null));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    await prisma.notifications.deleteMany({ where: { user_id: userId } });
    res.json(ApiResponse.ok("All notifications deleted", null));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
