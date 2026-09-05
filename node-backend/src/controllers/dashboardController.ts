import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getWorkerStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const appliedJobs = await prisma.job_applications.count({ where: { worker_id: userId } });
    const unreadNotifications = await prisma.notifications.count({ where: { user_id: userId, is_read: false } });

    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });

    res.json(ApiResponse.ok("Worker stats fetched", {
      appliedJobs,
      unreadNotifications,
      level: profile?.level,
      trustScore: profile?.trust_score
    }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getEmployerStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const activeJobs = await prisma.jobs.count({ where: { employer_id: userId, status: 'OPEN' } });

    const totalApplicants = await prisma.job_applications.count({
      where: { jobs: { employer_id: userId } }
    });

    const interviewingCount = await prisma.job_applications.count({
      where: { jobs: { employer_id: userId }, status: 'REVIEWING' }
    });

    const totalHired = await prisma.job_applications.count({
      where: { jobs: { employer_id: userId }, status: 'ACCEPTED' }
    });

    const unreadNotifications = await prisma.notifications.count({ where: { user_id: userId, is_read: false } });

    res.json(ApiResponse.ok("Employer stats fetched", {
      activeJobs,
      totalApplicants,
      interviewingCount,
      totalHired,
      unreadNotifications
    }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
