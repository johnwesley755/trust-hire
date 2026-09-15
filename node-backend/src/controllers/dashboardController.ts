import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getWorkerStats = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const appliedJobs = await prisma.job_applications.count({ where: { worker_id: userId } });
    const unreadNotifications = await prisma.notifications.count({ where: { user_id: userId, is_read: false } });

    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });

    return c.json(ApiResponse.ok("Worker stats fetched", {
      appliedJobs,
      unreadNotifications,
      level: profile?.level,
      trustScore: profile?.trust_score
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getEmployerStats = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

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

    return c.json(ApiResponse.ok("Employer stats fetched", {
      activeJobs,
      totalApplicants,
      interviewingCount,
      totalHired,
      unreadNotifications
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
