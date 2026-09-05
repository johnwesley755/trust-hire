import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { query, category, location, city } = req.query;
    let whereClause: any = {};
    if (query) whereClause.title = { contains: query as string, mode: 'insensitive' };
    if (category) whereClause.category = { contains: category as string, mode: 'insensitive' };
    if (location) whereClause.location = { contains: location as string, mode: 'insensitive' };
    if (city) whereClause.city = { contains: city as string, mode: 'insensitive' };

    const jobs = await prisma.job_search_index.findMany({ where: whereClause });
    res.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const searchWorkers = async (req: Request, res: Response) => {
  try {
    const { query, level, location, city } = req.query;
    let whereClause: any = {};
    if (query) whereClause.name = { contains: query as string, mode: 'insensitive' };
    if (level) whereClause.level = { contains: level as string, mode: 'insensitive' };
    if (location) whereClause.location = { contains: location as string, mode: 'insensitive' };
    if (city) whereClause.city = { contains: city as string, mode: 'insensitive' };

    const workers = await prisma.worker_search_index.findMany({ where: whereClause });
    res.json(ApiResponse.ok(workers));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const indexJob = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    await prisma.job_search_index.upsert({
      where: { job_id: data.jobId || data.job_id },
      update: { ...data, indexed_at: new Date() },
      create: { ...data, indexed_at: new Date() }
    });
    res.json(ApiResponse.ok("Job indexed"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const removeJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    await prisma.job_search_index.delete({ where: { job_id: jobId } });
    res.json(ApiResponse.ok("Job removed from index"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const indexWorker = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    await prisma.worker_search_index.upsert({
      where: { user_id: data.userId || data.user_id },
      update: { ...data, indexed_at: new Date() },
      create: { ...data, indexed_at: new Date() }
    });
    res.json(ApiResponse.ok("Worker indexed"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const removeWorker = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await prisma.worker_search_index.delete({ where: { user_id: userId } });
    res.json(ApiResponse.ok("Worker removed from index"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
