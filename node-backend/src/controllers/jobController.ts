import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatJob = (job: any) => {
  if (!job) return job;
  return {
    ...job,
    employerId: job.employer_id,
    employerName: job.employer_name,
    experienceYearsRequired: job.experience_years_required != null ? Number(job.experience_years_required) : 0,
    requiredSkills: typeof job.required_skills === 'string' 
      ? job.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean) 
      : (Array.isArray(job.required_skills) ? job.required_skills : []),
    budget: job.budget != null ? Number(job.budget) : 0,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
    expiresAt: job.expires_at,
  };
};

export const createJob = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());

    const employer = await prisma.employer_profiles.findUnique({ where: { user_id: employerId } });
    const userMeta = await prisma.user_metadata.findUnique({ where: { id: employerId } });
    const employerName = employer?.company_name || `${userMeta?.first_name || ''} ${userMeta?.last_name || ''}`.trim() || 'Employer';

    const requiredSkillsStr = Array.isArray(data.requiredSkills) 
      ? data.requiredSkills.join(', ') 
      : (typeof data.requiredSkills === 'string' ? data.requiredSkills : '');

    const job = await prisma.jobs.create({
      data: {
        id: uuidv4(),
        employer_id: employerId,
        employer_name: employerName,
        title: data.title,
        description: data.description,
        budget: data.budget ? Number(data.budget) : null,
        location: data.location || data.address || data.city || '',
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
        city: data.city || '',
        address: data.address || '',
        industry: data.industry || 'General',
        experience_years_required: data.experienceYearsRequired ? Number(data.experienceYearsRequired) : (data.experience_years_required ? Number(data.experience_years_required) : 0),
        status: 'OPEN',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Also populate job_search_index if present
    try {
      await prisma.job_search_index.upsert({
        where: { job_id: job.id },
        update: {
          title: job.title,
          description: job.description,
          category: job.industry,
          location: job.location,
          city: job.city,
          address: job.address,
          latitude: job.latitude,
          longitude: job.longitude,
          required_skills: requiredSkillsStr,
          budget: job.budget ? Number(job.budget) : null,
          status: job.status,
          employer_name: employerName,
          last_updated_at: new Date()
        },
        create: {
          job_id: job.id,
          title: job.title,
          description: job.description,
          category: job.industry,
          location: job.location,
          city: job.city,
          address: job.address,
          latitude: job.latitude,
          longitude: job.longitude,
          required_skills: requiredSkillsStr,
          budget: job.budget ? Number(job.budget) : null,
          status: job.status,
          employer_name: employerName,
          indexed_at: new Date(),
          last_updated_at: new Date()
        }
      });
    } catch (e: any) {
      console.warn("Index update notice:", e.message);
    }

    return c.json(ApiResponse.ok("Job created", formatJob({ ...job, required_skills: requiredSkillsStr })));
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
    return c.json(ApiResponse.ok(jobs.map(formatJob)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getJobById = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const job = await prisma.jobs.findUnique({ where: { id } });
    if (!job) return c.json(ApiResponse.error("Job not found"), 404 as any);
    return c.json(ApiResponse.ok(formatJob(job)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getMyJobs = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const jobs = await prisma.jobs.findMany({ 
      where: { employer_id: employerId },
      orderBy: { created_at: 'desc' }
    });
    return c.json(ApiResponse.ok(jobs.map(formatJob)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateJob = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const employerId = c.get('user')?.sub;
    const data = (await c.req.json());

    const updatePayload: any = {
      updated_at: new Date()
    };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.budget !== undefined) updatePayload.budget = data.budget ? Number(data.budget) : null;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.latitude !== undefined) updatePayload.latitude = data.latitude ? Number(data.latitude) : null;
    if (data.longitude !== undefined) updatePayload.longitude = data.longitude ? Number(data.longitude) : null;
    if (data.city !== undefined) updatePayload.city = data.city;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.industry !== undefined) updatePayload.industry = data.industry;
    if (data.experienceYearsRequired !== undefined || data.experience_years_required !== undefined) {
      updatePayload.experience_years_required = Number(data.experienceYearsRequired ?? data.experience_years_required);
    }
    if (data.status !== undefined) updatePayload.status = data.status;

    const job = await prisma.jobs.updateMany({
      where: { id, employer_id: employerId },
      data: updatePayload
    });

    if (job.count === 0) return c.json(ApiResponse.error("Job not found or not owned by employer"), 404 as any);
    const updatedJob = await prisma.jobs.findUnique({ where: { id } });
    return c.json(ApiResponse.ok("Job updated", formatJob(updatedJob)));
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
    const body = (await c.req.json().catch(() => ({}))) || {};
    let ids: string[] = [];
    if (Array.isArray(body)) {
      ids = body;
    } else if (body && Array.isArray(body.ids)) {
      ids = body.ids;
    }
    ids = ids.filter(Boolean);

    if (ids.length === 0) {
      return c.json(ApiResponse.ok([]));
    }
    const jobs = await prisma.jobs.findMany({ where: { id: { in: ids } } });
    return c.json(ApiResponse.ok(jobs.map(formatJob)));
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
