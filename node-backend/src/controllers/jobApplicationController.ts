import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

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

    return c.json(ApiResponse.ok("Application submitted successfully", application));
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
      // If it exists, maybe update it to OFFER_SENT, or reject if they already applied
      if (existing.status === 'PENDING') {
        const updated = await prisma.job_applications.update({
          where: { id: existing.id },
          data: { status: 'OFFER_SENT' }
        });
        return c.json(ApiResponse.ok("Offer dispatched successfully by updating existing application", updated));
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

    return c.json(ApiResponse.ok("Offer dispatched successfully", application));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateApplicationStatus = async (c: Context) => {
  try {
    const applicationId = c.req.param('applicationId') as string;
    const { status  } = c.req.query();

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

    return c.json(ApiResponse.ok("Status updated", updated));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getMyApplications = async (c: Context) => {
  try {
    const workerId = c.get('user')?.sub;
    if (!workerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const applications = await prisma.job_applications.findMany({
      where: { worker_id: workerId }
    });
    return c.json(ApiResponse.ok("My applications fetched", applications));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getJobApplications = async (c: Context) => {
  try {
    const jobId = c.req.param('jobId') as string;
    const applications = await prisma.job_applications.findMany({
      where: { job_id: jobId }
    });
    return c.json(ApiResponse.ok("Job applications fetched", applications));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getApplicationsByJobs = async (c: Context) => {
  try {
    const { jobIds } = (await c.req.json());
    const applications = await prisma.job_applications.findMany({
      where: { job_id: { in: jobIds } }
    });
    return c.json(ApiResponse.ok("Applications for jobs fetched", applications));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
