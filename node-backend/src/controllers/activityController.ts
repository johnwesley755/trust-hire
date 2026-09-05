import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const activities = await prisma.user_activities.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    res.json(ApiResponse.ok(activities));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
