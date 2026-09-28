import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_JOB_STATUSES = ['OPEN', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED', 'CLOSED'];

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
    const authUser = c.get('user');
    const employerId = authUser?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    // Security fix 1.6: Only EMPLOYER (or ADMIN) accounts can create jobs
    if (authUser.role !== 'EMPLOYER' && authUser.role !== 'ADMIN') {
      return c.json(ApiResponse.error("Forbidden: Only registered employer accounts can post jobs."), 403 as any);
    }

    const data = (await c.req.json());

    const employer = await prisma.employer_profiles.findUnique({ where: { user_id: employerId } });
    const userMeta = await prisma.user_metadata.findUnique({ where: { id: employerId } });
    const employerName = employer?.company_name || `${userMeta?.first_name || ''} ${userMeta?.last_name || ''}`.trim() || 'Employer';

    const requiredSkillsStr = Array.isArray(data.requiredSkills) 
      ? data.requiredSkills.join(', ') 
      : (typeof data.requiredSkills === 'string' ? data.requiredSkills : '');

    // Defect fix 3.1: Persist expiry date
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : (data.expires_at ? new Date(data.expires_at) : null);

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
        expires_at: expiresAt,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Populate search index with skills & expiry
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
    const { query, category, industry, location, city } = c.req.query();
    let whereClause: any = {
      status: 'OPEN',
      AND: [
        {
          OR: [
            { expires_at: null },
            { expires_at: { gt: new Date() } }
          ]
        }
      ]
    };

    if (query) {
      whereClause.AND.push({
        OR: [
          { title: { contains: query as string, mode: 'insensitive' } },
          { description: { contains: query as string, mode: 'insensitive' } },
          { industry: { contains: query as string, mode: 'insensitive' } },
        ]
      });
    }

    const tradeFilter = (category || industry) as string;
    if (tradeFilter && tradeFilter !== 'All') {
      whereClause.industry = { contains: tradeFilter, mode: 'insensitive' };
    }

    if (location) whereClause.location = { contains: location as string, mode: 'insensitive' };
    if (city) whereClause.city = { contains: city as string, mode: 'insensitive' };

    const jobs = await prisma.jobs.findMany({
      where: whereClause,
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

    let employerProfile: any = null;
    if (job.employer_id) {
      const emp = await prisma.employer_profiles.findFirst({
        where: {
          OR: [
            { id: job.employer_id },
            { user_id: job.employer_id }
          ]
        }
      });
      const user = await prisma.user_metadata.findUnique({
        where: { id: emp?.user_id || job.employer_id }
      });
      if (emp || user) {
        employerProfile = {
          id: emp?.id || job.employer_id,
          userId: emp?.user_id || user?.id || job.employer_id,
          companyName: emp?.company_name || job.employer_name || (user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '') || 'Verified Employer',
          companyWebsite: emp?.company_website || '',
          profileBio: emp?.profile_bio || '',
          businessTier: emp?.business_tier || 'STARTER',
          isVerified: emp?.is_verified ?? false,
          location: emp?.location || '',
          city: emp?.city || '',
          address: emp?.address || '',
          logoUrl: user?.profile_image_url || null,
          phoneNumber: user?.phone_number || null,
          email: user?.email || null
        };
      }
    }

    return c.json(ApiResponse.ok({
      ...formatJob(job),
      employerName: employerProfile?.companyName || job.employer_name || 'Verified Employer',
      employer: employerProfile,
      employerProfile
    }));
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
    const authUser = c.get('user');
    const employerId = authUser?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());

    // Defect fix 3.5: Validate status against allowed enum set
    if (data.status && !ALLOWED_JOB_STATUSES.includes(data.status)) {
      return c.json(ApiResponse.error(`Invalid job status: ${data.status}. Must be one of: ${ALLOWED_JOB_STATUSES.join(', ')}`), 400 as any);
    }

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
    if (data.expiresAt !== undefined || data.expires_at !== undefined) {
      updatePayload.expires_at = data.expiresAt ? new Date(data.expiresAt) : (data.expires_at ? new Date(data.expires_at) : null);
    }
    if (data.experienceYearsRequired !== undefined || data.experience_years_required !== undefined) {
      updatePayload.experience_years_required = Number(data.experienceYearsRequired ?? data.experience_years_required);
    }
    if (data.status !== undefined) updatePayload.status = data.status;

    const whereClause: any = { id };
    if (authUser.role !== 'ADMIN') {
      whereClause.employer_id = employerId;
    }

    const job = await prisma.jobs.updateMany({
      where: whereClause,
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
    const authUser = c.get('user');
    const employerId = authUser?.sub;
    if (!employerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const whereClause: any = { id };
    if (authUser.role !== 'ADMIN') {
      whereClause.employer_id = employerId;
    }

    const existingJob = await prisma.jobs.findFirst({ where: whereClause });
    if (!existingJob) {
      return c.json(ApiResponse.error("Job not found or not owned by employer"), 404 as any);
    }

    // Defect fix 3.4: Safely handle cascade deletion for related applications and search index
    await prisma.job_applications.deleteMany({ where: { job_id: id } }).catch(() => {});
    await prisma.job_search_index.deleteMany({ where: { job_id: id } }).catch(() => {});
    await prisma.jobs.delete({ where: { id } });

    return c.json(ApiResponse.ok("Job deleted successfully", null));
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
