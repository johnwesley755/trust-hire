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

    const jobIds = jobs.map(j => j.id);
    const employerIds = jobs.map(j => j.employer_id).filter(Boolean);

    const [searchIndices, employerProfiles] = await Promise.all([
      prisma.job_search_index.findMany({ where: { job_id: { in: jobIds } } }),
      prisma.employer_profiles.findMany({
        where: {
          OR: [
            { id: { in: employerIds } },
            { user_id: { in: employerIds } }
          ]
        }
      })
    ]);

    const indexByJobId = new Map(searchIndices.map(si => [si.job_id, si]));
    const employerById = new Map();
    employerProfiles.forEach(ep => {
      employerById.set(ep.id, ep);
      if (ep.user_id) employerById.set(ep.user_id, ep);
    });

    const formatted = jobs.map(j => {
      const sIndex = indexByJobId.get(j.id);
      const emp = employerById.get(j.employer_id);

      return {
        id: j.id,
        title: j.title,
        description: j.description || '',
        industry: j.industry || 'General',
        location: j.location || '',
        city: j.city || '',
        budget: j.budget ? Number(j.budget) : 0,
        experienceLevel: 'L1',
        status: j.status || 'OPEN',
        expiresAt: j.expires_at,
        createdAt: j.created_at,
        updatedAt: j.updated_at,
        requiredSkills: sIndex?.required_skills
          ? sIndex.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        employerProfile: emp ? {
          id: emp.id,
          companyName: emp.company_name || 'Employer',
          businessTier: emp.business_tier || 'STARTER',
          isVerified: emp.is_verified || false,
          city: emp.city || '',
          logoUrl: ''
        } : null
      };
    });

    return c.json(ApiResponse.ok(formatted));
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

    const userIds = workers.map(w => w.user_id).filter(Boolean);

    const [userMetaList, verifications] = await Promise.all([
      prisma.user_metadata.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          profile_image_url: true,
          phone_number: true,
          email_verified: true
        }
      }),
      prisma.verification_records.findMany({
        where: { user_id: { in: userIds } }
      })
    ]);

    const userMetaById = new Map(userMetaList.map(u => [u.id, u]));
    const verificationByUser = new Map(verifications.map(v => [v.user_id, v]));

    let employerOffersMap = new Map<string, string>();
    if (employerId) {
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
        select: { id: true }
      });
      const jobIds = employerJobs.map(j => j.id);
      if (jobIds.length > 0) {
        const offers = await prisma.job_applications.findMany({
          where: { 
            job_id: { in: jobIds }
          },
          select: { worker_id: true, status: true }
        });
        offers.forEach(o => {
          if (o.worker_id && o.status) {
            employerOffersMap.set(o.worker_id, o.status);
          }
        });
      }
    }

    const formatted = workers.map(w => {
      const meta = userMetaById.get(w.user_id);
      const vRecord = verificationByUser.get(w.user_id);
      const isVerified = vRecord?.status === 'VERIFIED' || vRecord?.status === 'APPROVED' || Boolean(meta?.email_verified);
      const offerStatus = employerOffersMap.get(w.id) || (w.user_id ? employerOffersMap.get(w.user_id) : null) || null;

      return {
        id: w.id,
        userId: w.user_id,
        name: w.full_name || `${meta?.first_name || ''} ${meta?.last_name || ''}`.trim() || 'Worker',
        bio: w.bio || '',
        skills: w.skills || '',
        location: w.location || '',
        city: w.city || '',
        level: w.level || 'L1',
        levelNumber: w.level_number || 1,
        experienceYears: w.experience_years || 0,
        hourlyRate: w.hourly_rate ? Number(w.hourly_rate) : null,
        isVerified,
        profileImageUrl: meta?.profile_image_url || '',
        status: w.is_available ? 'AVAILABLE' : 'OFFLINE',
        trustScore: w.trust_score || 70,
        offerStatus,
        isOfferSent: Boolean(offerStatus)
      };
    });

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

