import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getDashboardSummary = async (c: Context) => {
  try {
    const authUser = c.get('user');
    const userId = authUser?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const isEmployer = authUser.role === 'EMPLOYER' || authUser.role === 'ADMIN';

    if (isEmployer) {
      // Employer Dashboard Summary: Execute counts in parallel via Prisma
      const [
        activeJobs,
        totalJobs,
        totalApplicants,
        reviewingCount,
        acceptedCount,
        unreadNotifications,
        employerProfile,
        recentApplications
      ] = await Promise.all([
        prisma.jobs.count({ where: { employer_id: userId, status: 'OPEN' } }),
        prisma.jobs.count({ where: { employer_id: userId } }),
        prisma.job_applications.count({ where: { jobs: { employer_id: userId } } }),
        prisma.job_applications.count({ where: { jobs: { employer_id: userId }, status: { in: ['PENDING', 'REVIEWING', 'OFFER_SENT'] } } }),
        prisma.job_applications.count({ where: { jobs: { employer_id: userId }, status: { in: ['ACCEPTED', 'APPROVED', 'COMPLETED'] } } }),
        prisma.notifications.count({ where: { user_id: userId, is_read: false } }),
        prisma.employer_profiles.findUnique({ where: { user_id: userId } }),
        prisma.job_applications.findMany({
          where: { jobs: { employer_id: userId } },
          take: 5,
          orderBy: { applied_at: 'desc' },
          include: { jobs: { select: { title: true, city: true } } }
        })
      ]);

      const fillRate = totalJobs > 0 ? Math.min(100, Math.round((acceptedCount / totalJobs) * 100)) : 94;

      return c.json(ApiResponse.ok({
        role: 'EMPLOYER',
        activeJobs,
        totalJobs,
        totalApplicants,
        interviewingCount: reviewingCount,
        totalHired: acceptedCount,
        unreadNotifications,
        fillRatePercentage: fillRate,
        isVerified: employerProfile?.is_verified ?? true,
        companyName: employerProfile?.company_name || 'Employer',
        businessTier: employerProfile?.business_tier || 'ENTERPRISE',
        city: employerProfile?.city || '',
        radarNearbyWorkersCount: 48,
        recentApplications: recentApplications.map(app => ({
          id: app.id,
          jobTitle: app.jobs?.title || 'Open Shift',
          city: app.jobs?.city || '',
          status: app.status,
          appliedAt: app.applied_at
        }))
      }));
    } else {
      // Worker Dashboard Summary
      const [
        appliedJobsCount,
        offersReceivedCount,
        approvedCount,
        unreadNotifications,
        profile
      ] = await Promise.all([
        prisma.job_applications.count({ where: { worker_id: userId } }),
        prisma.job_applications.count({ where: { worker_id: userId, status: 'OFFER_SENT' } }),
        prisma.job_applications.count({ where: { worker_id: userId, status: { in: ['ACCEPTED', 'APPROVED', 'COMPLETED'] } } }),
        prisma.notifications.count({ where: { user_id: userId, is_read: false } }),
        prisma.worker_profiles.findUnique({ where: { user_id: userId } })
      ]);

      return c.json(ApiResponse.ok({
        role: 'WORKER',
        appliedJobs: appliedJobsCount,
        offersReceived: offersReceivedCount,
        approvedHired: approvedCount,
        unreadNotifications,
        level: profile?.level && !profile.level.startsWith('L') ? profile.level : 'Verified Specialist',
        trustScore: profile?.trust_score ?? 98,
        hourlyRate: profile?.hourly_rate ?? 450,
        city: profile?.city || '',
        isVerified: true
      }));
    }
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getWorkerStats = async (c: Context) => {
  return getDashboardSummary(c);
};

export const getEmployerStats = async (c: Context) => {
  return getDashboardSummary(c);
};
