import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatApplication = (app: any) => {
  if (!app) return app;
  return {
    ...app,
    jobId: app.job_id,
    workerId: app.worker_id,
    appliedAt: app.applied_at,
    coverLetter: app.cover_letter,
  };
};

export const applyForJob = async (c: Context) => {
  try {
    const authUser = c.get('user');
    const workerId = authUser?.sub;
    if (!workerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    // Defect fix 1.9: Only WORKER role can apply for jobs
    if (authUser.role !== 'WORKER' && authUser.role !== 'ADMIN') {
      return c.json(ApiResponse.error("Forbidden: Only worker accounts can apply for jobs."), 403 as any);
    }

    const { jobId, coverLetter } = (await c.req.json());
    if (!jobId) return c.json(ApiResponse.error("Job ID is required"), 400 as any);

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);

    // Defect fix 3.3: Validate that job is OPEN and not expired
    if (job.status !== 'OPEN') {
      return c.json(ApiResponse.error(`Cannot apply: This job is currently ${(job.status || 'closed').toLowerCase()}.`), 400 as any);
    }

    if (job.expires_at && new Date(job.expires_at) < new Date()) {
      return c.json(ApiResponse.error("Cannot apply: This job posting has expired."), 400 as any);
    }

    const existing = await prisma.job_applications.findFirst({
      where: { job_id: jobId, worker_id: workerId }
    });

    if (existing) {
      return c.json(ApiResponse.error("You have already applied for this job"), 400 as any);
    }

    const application = await prisma.job_applications.create({
      data: {
        id: uuidv4(),
        job_id: jobId,
        worker_id: workerId,
        status: 'PENDING',
        cover_letter: coverLetter,
        applied_at: new Date()
      }
    });

    // Create Notification for Employer
    await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: job.employer_id,
        title: "New Application!",
        message: "A worker has applied for your job: " + job.title,
        type: "NEW_APPLICATION",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Create Notification for Worker
    await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: workerId,
        title: "Application Submitted",
        message: "You have successfully applied for: " + job.title,
        type: "APPLICATION_SUBMITTED",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return c.json(ApiResponse.ok("Application submitted successfully", formatApplication(application)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const dispatchOffer = async (c: Context) => {
  try {
    const authUser = c.get('user');
    const employerId = authUser?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const { jobId, workerId, coverLetter } = (await c.req.json());
    if (!jobId || !workerId) return c.json(ApiResponse.error("Job ID and Worker ID are required"), 400 as any);

    const employerProfile = await prisma.employer_profiles.findFirst({
      where: { user_id: employerId }
    });

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);

    const isOwner = job.employer_id === employerId || (employerProfile && job.employer_id === employerProfile.id) || authUser.role === 'ADMIN';
    if (!isOwner) {
      return c.json(ApiResponse.error("Unauthorized: You do not own this job"), 403 as any);
    }

    // Resolve canonical worker user ID
    const workerProfile = await prisma.worker_profiles.findFirst({
      where: {
        OR: [
          { user_id: workerId },
          { id: workerId }
        ]
      }
    });

    const canonicalWorkerId = workerProfile?.user_id || workerId;
    const allMatchingWorkerIds = Array.from(new Set([
      workerId,
      canonicalWorkerId,
      ...(workerProfile?.id ? [workerProfile.id] : [])
    ]));

    // Check if duplicate offer / application already exists for this job
    const existing = await prisma.job_applications.findFirst({
      where: {
        job_id: jobId,
        worker_id: { in: allMatchingWorkerIds }
      }
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        const updated = await prisma.job_applications.update({
          where: { id: existing.id },
          data: { status: 'OFFER_SENT' }
        });
        return c.json(ApiResponse.ok("Offer dispatched successfully by updating applicant status", formatApplication(updated)));
      }
      if (existing.status === 'OFFER_SENT') {
        return c.json(ApiResponse.error("Offer has already been dispatched to this candidate for this job."), 400 as any);
      }
      if (existing.status === 'ACCEPTED' || existing.status === 'APPROVED') {
        return c.json(ApiResponse.error("This candidate has already been approved / hired for this job."), 400 as any);
      }
      if (existing.status === 'REJECTED' || existing.status === 'DECLINED') {
        return c.json(ApiResponse.error("The offer for this job was previously declined."), 400 as any);
      }
      return c.json(ApiResponse.error(`An application already exists with status: ${existing.status}`), 400 as any);
    }

    const application = await prisma.job_applications.create({
      data: {
        id: uuidv4(),
        job_id: jobId,
        worker_id: canonicalWorkerId,
        status: 'OFFER_SENT',
        cover_letter: coverLetter || "Offer Dispatched",
        applied_at: new Date()
      }
    });

    // Notify Worker
    await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: canonicalWorkerId,
        title: "New Job Offer!",
        message: "You have received a job offer for: " + job.title,
        type: "NEW_OFFER",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return c.json(ApiResponse.ok("Offer dispatched successfully", formatApplication(application)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getEmployerWorkerStatus = async (c: Context) => {
  try {
    const authUser = c.get('user');
    const employerId = authUser?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const workerId = c.req.param('workerId') as string;
    if (!workerId) return c.json(ApiResponse.error("Worker ID required"), 400 as any);

    const employerProfile = await prisma.employer_profiles.findFirst({
      where: { user_id: employerId }
    });

    const employerJobs = await prisma.jobs.findMany({
      where: {
        OR: [
          { employer_id: employerId },
          ...(employerProfile ? [{ employer_id: employerProfile.id }] : [])
        ]
      },
      select: { id: true, title: true, status: true, budget: true, location: true, city: true }
    });

    const jobIds = employerJobs.map(j => j.id);
    if (jobIds.length === 0) {
      return c.json(ApiResponse.ok({ applications: [], jobs: [] }));
    }

    // Resolve worker id/user_id
    const workerProfile = await prisma.worker_profiles.findFirst({
      where: {
        OR: [
          { user_id: workerId },
          { id: workerId }
        ]
      }
    });

    const targetWorkerIds = Array.from(new Set([
      workerId,
      ...(workerProfile?.user_id ? [workerProfile.user_id] : []),
      ...(workerProfile?.id ? [workerProfile.id] : [])
    ]));

    const applications = await prisma.job_applications.findMany({
      where: {
        job_id: { in: jobIds },
        worker_id: { in: targetWorkerIds }
      },
      include: {
        jobs: {
          select: { id: true, title: true, status: true }
        }
      },
      orderBy: { applied_at: 'desc' }
    });

    return c.json(ApiResponse.ok({
      applications: applications.map(formatApplication),
      jobs: employerJobs
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateApplicationStatus = async (c: Context) => {
  try {
    const applicationId = c.req.param('applicationId') as string;
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const body = (await c.req.json().catch(() => ({}))) || {};
    const query = c.req.query();
    const status = (body.status || query.status) as string;

    const application = await prisma.job_applications.findUnique({
      where: { id: applicationId },
      include: { jobs: true }
    });

    if (!application) return c.json(ApiResponse.error("Application not found"), 404 as any);

    // Defect fix 1.7: Authorization ownership validation
    const isEmployerOwner = application.jobs?.employer_id === authUser.sub;
    const isApplicant = application.worker_id === authUser.sub;
    const isAdmin = authUser.role === 'ADMIN';

    if (!isEmployerOwner && !isApplicant && !isAdmin) {
      return c.json(ApiResponse.error("Forbidden: You are not authorized to modify this application."), 403 as any);
    }

    const updated = await prisma.job_applications.update({
      where: { id: applicationId },
      data: { status }
    });

    // Notify target party
    const targetUserId = isEmployerOwner ? application.worker_id : application.jobs?.employer_id;
    if (targetUserId) {
      await prisma.notifications.create({
        data: {
          id: uuidv4(),
          user_id: targetUserId,
          title: "Application Status Updated",
          message: `Application for '${application.jobs?.title || 'Shift'}' is now ${status}`,
          type: "APPLICATION_UPDATE",
          is_read: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    return c.json(ApiResponse.ok("Status updated", formatApplication(updated)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getMyApplications = async (c: Context) => {
  try {
    const workerId = c.get('user')?.sub;
    if (!workerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const applications = await prisma.job_applications.findMany({
      where: { worker_id: workerId },
      include: { jobs: true },
      orderBy: { applied_at: 'desc' }
    });
    return c.json(ApiResponse.ok("My applications fetched", applications.map(formatApplication)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getJobApplications = async (c: Context) => {
  try {
    const jobId = c.req.param('jobId') as string;
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);

    // Defect fix 1.8: Ensure requesting user owns the job or is ADMIN
    if (job.employer_id !== authUser.sub && authUser.role !== 'ADMIN') {
      return c.json(ApiResponse.error("Forbidden: You do not own this job posting."), 403 as any);
    }

    const applications = await prisma.job_applications.findMany({
      where: { job_id: jobId },
      orderBy: { applied_at: 'desc' }
    });
    return c.json(ApiResponse.ok("Job applications fetched", applications.map(formatApplication)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getApplicationsByJobs = async (c: Context) => {
  try {
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const body = (await c.req.json().catch(() => ({}))) || {};
    let jobIds: string[] = [];
    if (Array.isArray(body)) {
      jobIds = body;
    } else if (body && Array.isArray(body.jobIds)) {
      jobIds = body.jobIds;
    } else if (body && Array.isArray(body.job_ids)) {
      jobIds = body.job_ids;
    }

    // Default to all jobs owned by employer
    if (jobIds.length === 0) {
      const employerJobs = await prisma.jobs.findMany({
        where: { employer_id: authUser.sub },
        select: { id: true }
      });
      jobIds = employerJobs.map(j => j.id);
    } else if (authUser.role !== 'ADMIN') {
      // Defect fix 1.8: Filter jobIds to only those owned by the employer
      const ownedJobs = await prisma.jobs.findMany({
        where: { id: { in: jobIds }, employer_id: authUser.sub },
        select: { id: true }
      });
      jobIds = ownedJobs.map(j => j.id);
    }

    if (jobIds.length === 0) {
      return c.json(ApiResponse.ok("Applications for jobs fetched", []));
    }

    const applications = await prisma.job_applications.findMany({
      where: { job_id: { in: jobIds } },
      include: { jobs: true },
      orderBy: { applied_at: 'desc' }
    });
    return c.json(ApiResponse.ok("Applications for jobs fetched", applications.map(formatApplication)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

