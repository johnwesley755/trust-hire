import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const createJob = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());
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
    return c.json(ApiResponse.ok("Job created", job));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getAllJobs = async (c: Context) => {
  try {
    const jobs = await prisma.jobs.findMany({
      where: {
        status: 'OPEN',
        OR: [
          { expires_at: null },
          { expires_at: { gt: new Date() } }
        ]
      },
      orderBy: { created_at: 'desc' }
    });
    return c.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getJobById = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const job = await prisma.jobs.findUnique({ where: { id } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);
    return c.json(ApiResponse.ok(job));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getMyJobs = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const jobs = await prisma.jobs.findMany({ where: { employer_id: employerId } });
    return c.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateJob = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const employerId = c.get('user')?.sub;
    const data = (await c.req.json());

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

    if (job.count === 0) return c.json(ApiResponse.error("Job not found or not owned by employer"), 404 as any);
    const updatedJob = await prisma.jobs.findUnique({ where: { id } });
    return c.json(ApiResponse.ok("Job updated", updatedJob));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const deleteJob = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const employerId = c.get('user')?.sub;

    await prisma.jobs.deleteMany({
      where: { id, employer_id: employerId }
    });
    return c.json(ApiResponse.ok("Job deleted", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getJobsByIds = async (c: Context) => {
  try {
    let ids: string[] = [];
    if (Array.isArray((await c.req.json()))) {
      ids = (await c.req.json());
    } else if ((await c.req.json()) && Array.isArray((await c.req.json()).ids)) {
      ids = (await c.req.json()).ids;
    }
    ids = ids.filter(Boolean);

    if (ids.length === 0) {
      return c.json(ApiResponse.ok([]));
    }
    const jobs = await prisma.jobs.findMany({ where: { id: { in: ids } } });
    return c.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getStats = async (c: Context) => {
  try {
    const totalJobs = await prisma.jobs.count();
    return c.json(ApiResponse.ok({ totalJobs }));
  } catch (err: any) {
    console.error("GET STATS ERROR:", err);
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
