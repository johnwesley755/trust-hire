import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const workerId = req.user?.sub;
    if (!workerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const { jobId, coverLetter } = req.body;
    if (!jobId) return res.status(400).json(ApiResponse.error("Job ID is required"));

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json(ApiResponse.error("Job not found"));

    const existing = await prisma.job_applications.findFirst({
      where: { job_id: jobId, worker_id: workerId }
    });

    if (existing) {
      return res.status(400).json(ApiResponse.error("You have already applied for this job"));
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

    res.json(ApiResponse.ok("Application submitted successfully", application));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.applicationId as string;
    const { status } = req.query;

    const application = await prisma.job_applications.findUnique({
      where: { id: applicationId },
      include: { jobs: true }
    });

    if (!application) return res.status(404).json(ApiResponse.error("Application not found"));

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

    res.json(ApiResponse.ok("Status updated", updated));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const workerId = req.user?.sub;
    if (!workerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const applications = await prisma.job_applications.findMany({
      where: { worker_id: workerId }
    });
    res.json(ApiResponse.ok("My applications fetched", applications));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const applications = await prisma.job_applications.findMany({
      where: { job_id: jobId }
    });
    res.json(ApiResponse.ok("Job applications fetched", applications));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getApplicationsByJobs = async (req: Request, res: Response) => {
  try {
    const { jobIds } = req.body;
    const applications = await prisma.job_applications.findMany({
      where: { job_id: { in: jobIds } }
    });
    res.json(ApiResponse.ok("Applications for jobs fetched", applications));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
