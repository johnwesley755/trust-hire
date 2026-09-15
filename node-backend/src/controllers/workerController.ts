import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatWorkerProfile = (profile: any) => {
  if (!profile) return profile;
  return {
    ...profile,
    profile_views: profile.profile_views != null ? Number(profile.profile_views) : 0,
    hourly_rate: profile.hourly_rate != null ? Number(profile.hourly_rate) : null,
  };
};

export const getMyProfile = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    let profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!profile) {
      profile = await prisma.worker_profiles.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }
    return c.json(ApiResponse.ok(formatWorkerProfile(profile)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());
    const profile = await prisma.worker_profiles.upsert({
      where: { user_id: userId },
      update: {
        full_name: data.fullName,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
        bio: data.bio,
        skills: data.skills,
        experience_years: data.experienceYears,
        hourly_rate: data.hourlyRate,
        level: data.level,
        is_available: data.isAvailable,
        updated_at: new Date()
      },
      create: {
        id: uuidv4(),
        user_id: userId,
        full_name: data.fullName,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
        bio: data.bio,
        skills: data.skills,
        experience_years: data.experienceYears,
        hourly_rate: data.hourlyRate,
        level: data.level,
        is_available: data.isAvailable,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    if (data.phoneNumber) {
      const cleanPhone = String(data.phoneNumber).trim().replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        return c.json(ApiResponse.error("Please provide a valid 10-digit phone number."), 400 as any);
      }

      const existingPhoneUser = await prisma.user_metadata.findFirst({
        where: {
          phone_number: cleanPhone,
          id: { not: userId }
        }
      });

      if (existingPhoneUser) {
        return c.json(ApiResponse.error("This phone number is already registered to another account. Duplicate accounts are not permitted."), 400 as any);
      }

      await prisma.user_metadata.update({
        where: { id: userId },
        data: { 
          phone_number: cleanPhone,
          onboarded: true,
          first_name: data.fullName ? data.fullName.split(' ')[0] : undefined,
          last_name: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : undefined,
        }
      });
    } else {
      await prisma.user_metadata.update({
        where: { id: userId },
        data: { onboarded: true }
      });
    }

    return c.json(ApiResponse.ok("Profile updated", formatWorkerProfile(profile)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getProfileCompletion = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });

    let isComplete = false;
    let missingFields: string[] = [];
    if (profile) {
      if (!profile.full_name) missingFields.push('fullName');
      if (!profile.skills) missingFields.push('skills');
      if (!profile.hourly_rate) missingFields.push('hourlyRate');
      isComplete = missingFields.length === 0;
    }

    return c.json(ApiResponse.ok({ isComplete, missingFields }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getProfilesByUserIds = async (c: Context) => {
  try {
    const employerId = c.get('user')?.sub;
    const userIds: string[] = (await c.req.json());
    const validUserIds = (userIds || []).filter(Boolean);
    if (validUserIds.length === 0) return c.json(ApiResponse.ok([]));
    
    const profiles = await prisma.worker_profiles.findMany({
      where: { user_id: { in: validUserIds } }
    });

    let employerOffers = new Set();
    if (employerId) {
      const employerJobs = await prisma.jobs.findMany({ where: { employer_id: employerId }, select: { id: true } });
      const jobIds = employerJobs.map(j => j.id);
      if (jobIds.length > 0) {
        const offers = await prisma.job_applications.findMany({
          where: { 
            job_id: { in: jobIds },
            worker_id: { in: validUserIds },
            status: { in: ['OFFER_SENT', 'PENDING', 'ACCEPTED'] } 
          },
          select: { worker_id: true }
        });
        offers.forEach(o => employerOffers.add(o.worker_id));
      }
    }

    const formatted = profiles.map((p) => {
      const f = formatWorkerProfile(p);
      if (f) {
        f.isOfferSent = employerOffers.has(f.user_id);
      }
      return f;
    });

    return c.json(ApiResponse.ok(formatted));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const incrementProfileView = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    await prisma.worker_profiles.update({
      where: { user_id: userId },
      data: { profile_views: { increment: 1 } }
    });
    return c.json(ApiResponse.ok("View incremented", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getTrustScore = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    const verification = await prisma.verification_records.findFirst({ where: { user_id: userId, status: 'APPROVED' } });

    const trustScore = profile?.trust_score || 0;
    const identityVerified = !!verification;
    const avgRating = profile?.performance_score || 0.0;

    return c.json(ApiResponse.ok({
      score: trustScore,
      identityVerified,
      skillsVerifiedCount: 0,
      avgRating,
      reliabilityRate: 0.95,
      lastUpdated: new Date().toISOString()
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getGlobalStats = async (c: Context) => {
  try {
    const totalWorkers = await prisma.worker_profiles.count();
    return c.json(ApiResponse.ok({ totalWorkers }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
