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
    const workerId = c.get('user')?.sub;
    if (!workerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const { jobId, coverLetter } = (await c.req.json());
    if (!jobId) return c.json(ApiResponse.error("Job ID is required"), 400 as any);

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);

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
    const employerId = c.get('user')?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const { jobId, workerId, coverLetter } = (await c.req.json());
    if (!jobId || !workerId) return c.json(ApiResponse.error("Job ID and Worker ID are required"), 400 as any);

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);
    if (job.employer_id !== employerId) return c.json(ApiResponse.error("Unauthorized: You do not own this job"), 403 as any);

    const existing = await prisma.job_applications.findFirst({
      where: { job_id: jobId, worker_id: workerId }
    });

    if (existing) {
      if (existing.status === 'PENDING') {
        const updated = await prisma.job_applications.update({
          where: { id: existing.id },
          data: { status: 'OFFER_SENT' }
        });
        return c.json(ApiResponse.ok("Offer dispatched successfully by updating existing application", formatApplication(updated)));
      }
      return c.json(ApiResponse.error("Offer or application already exists for this candidate"), 400 as any);
    }

    const application = await prisma.job_applications.create({
      data: {
        id: uuidv4(),
        job_id: jobId,
        worker_id: workerId,
        status: 'OFFER_SENT',
        cover_letter: coverLetter || "Offer Dispatched",
        applied_at: new Date()
      }
    });

    // Notify Worker
    await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: workerId,
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

export const updateApplicationStatus = async (c: Context) => {
  try {
    const applicationId = c.req.param('applicationId') as string;
    const body = (await c.req.json().catch(() => ({}))) || {};
    const query = c.req.query();
    const status = body.status || query.status;

    const application = await prisma.job_applications.findUnique({
      where: { id: applicationId },
      include: { jobs: true }
    });

    if (!application) return c.json(ApiResponse.error("Application not found"), 404 as any);

    const updated = await prisma.job_applications.update({
      where: { id: applicationId },
      data: { status: status as string }
    });

    // Notify Worker
    await prisma.notifications.create({
      data: {
        id: uuidv4(),
        user_id: application.worker_id,
        title: "Application Update",
        message: "Your application for '" + application.jobs.title + "' is now " + status,
        type: "APPLICATION_UPDATE",
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

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
    const body = (await c.req.json().catch(() => ({}))) || {};
    let jobIds: string[] = [];
    if (Array.isArray(body)) {
      jobIds = body;
    } else if (body && Array.isArray(body.jobIds)) {
      jobIds = body.jobIds;
    } else if (body && Array.isArray(body.job_ids)) {
      jobIds = body.job_ids;
    }

    if (jobIds.length === 0) {
      const employerId = c.get('user')?.sub;
      if (employerId) {
        const employerJobs = await prisma.jobs.findMany({
          where: { employer_id: employerId },
          select: { id: true }
        });
        jobIds = employerJobs.map(j => j.id);
      }
    }

    if (jobIds.length === 0) {
      return c.json(ApiResponse.ok("Applications for jobs fetched", []));
    }

    const applications = await prisma.job_applications.findMany({
      where: { job_id: { in: jobIds } },
      orderBy: { applied_at: 'desc' }
    });
    return c.json(ApiResponse.ok("Applications for jobs fetched", applications.map(formatApplication)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
