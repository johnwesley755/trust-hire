import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const createJob = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.sub;
    if (!employerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const data = req.body;
    const job = await prisma.jobs.create({
      data: {
        id: uuidv4(),
        employer_id: employerId,
        title: data.title,
        description: data.description,
        budget: data.budget,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
        industry: data.industry,
        experience_years_required: data.experienceYearsRequired,
        status: 'OPEN',
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json(ApiResponse.ok("Job created", job));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const job = await prisma.jobs.findUnique({ where: { id } });
    if (!job) return res.status(404).json(ApiResponse.error("Job not found"));
    res.json(ApiResponse.ok(job));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.sub;
    if (!employerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const jobs = await prisma.jobs.findMany({ where: { employer_id: employerId } });
    res.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const employerId = req.user?.sub;
    const data = req.body;

    const job = await prisma.jobs.updateMany({
      where: { id, employer_id: employerId },
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
        industry: data.industry,
        experience_years_required: data.experienceYearsRequired,
        status: data.status,
        updated_at: new Date()
      }
    });

    if (job.count === 0) return res.status(404).json(ApiResponse.error("Job not found or not owned by employer"));
    const updatedJob = await prisma.jobs.findUnique({ where: { id } });
    res.json(ApiResponse.ok("Job updated", updatedJob));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const employerId = req.user?.sub;

    await prisma.jobs.deleteMany({
      where: { id, employer_id: employerId }
    });
    res.json(ApiResponse.ok("Job deleted", null));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getJobsByIds = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body;
    const jobs = await prisma.jobs.findMany({ where: { id: { in: ids } } });
    res.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalJobs = await prisma.jobs.count();
    res.json(ApiResponse.ok({ totalJobs }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
