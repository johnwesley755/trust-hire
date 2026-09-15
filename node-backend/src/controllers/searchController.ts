import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const searchJobs = async (c: Context) => {
  try {
    const { query, category, industry, location, city  } = c.req.query();
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
    return c.json(ApiResponse.ok(jobs));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const searchWorkers = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    const { query, level, location, city, skills  } = c.req.query();
    let whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { full_name: { contains: query as string, mode: 'insensitive' } },
        { skills: { contains: query as string, mode: 'insensitive' } },
        { bio: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    if (level) whereClause.level = { contains: level as string, mode: 'insensitive' };
    if (location) whereClause.location = { contains: location as string, mode: 'insensitive' };
    if (city) whereClause.city = { contains: city as string, mode: 'insensitive' };
    if (skills) whereClause.skills = { contains: skills as string, mode: 'insensitive' };

    const workers = await prisma.worker_profiles.findMany({ 
      where: whereClause,
      orderBy: { updated_at: 'desc' }
    });

    let employerOffers = new Set();
    if (employerId) {
      const employerJobs = await prisma.jobs.findMany({ where: { employer_id: employerId }, select: { id: true } });
      const jobIds = employerJobs.map(j => j.id);
      if (jobIds.length > 0) {
        const offers = await prisma.job_applications.findMany({
          where: { 
            job_id: { in: jobIds },
            status: { in: ['OFFER_SENT', 'PENDING', 'ACCEPTED'] } 
          },
          select: { worker_id: true }
        });
        offers.forEach(o => employerOffers.add(o.worker_id));
      }
    }

    const formatted = workers.map(w => ({
      userId: w.user_id,
      name: w.full_name || 'Worker',
      bio: w.bio || '',
      skills: w.skills || '',
      location: w.location || '',
      city: w.city || '',
      level: w.level || 'L1',
      isVerified: true,
      profileImageUrl: '',
      status: w.is_available ? 'AVAILABLE' : 'OFFLINE',
      trustScore: w.trust_score || 0,
      isOfferSent: employerOffers.has(w.user_id)
    }));

    return c.json(ApiResponse.ok(formatted));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const indexJob = async (c: Context) => {
  try {
    const data = (await c.req.json());
    await prisma.job_search_index.upsert({
      where: { job_id: data.jobId || data.job_id },
      update: { ...data, indexed_at: new Date() },
      create: { ...data, indexed_at: new Date() }
    });
    return c.json(ApiResponse.ok("Job indexed"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const removeJob = async (c: Context) => {
  try {
    const jobId = c.req.param('jobId') as string;
    await prisma.job_search_index.delete({ where: { job_id: jobId } });
    return c.json(ApiResponse.ok("Job removed from index"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const indexWorker = async (c: Context) => {
  try {
    const data = (await c.req.json());
    await prisma.worker_search_index.upsert({
      where: { user_id: data.userId || data.user_id },
      update: { ...data, indexed_at: new Date() },
      create: { ...data, indexed_at: new Date() }
    });
    return c.json(ApiResponse.ok("Worker indexed"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const removeWorker = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    await prisma.worker_search_index.delete({ where: { user_id: userId } });
    return c.json(ApiResponse.ok("Worker removed from index"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
