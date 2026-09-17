import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatWorkerProfile = (profile: any, userMeta?: any, isVerified?: boolean) => {
  if (!profile) return profile;
  const phoneNumber = userMeta?.phone_number || profile.phone_number || profile.phoneNumber || null;
  const email = userMeta?.email || profile.email || null;
  const profileImageUrl = userMeta?.profile_image_url || profile.profile_image_url || profile.profileImageUrl || null;
  const fullName = profile.full_name || `${userMeta?.first_name || ''} ${userMeta?.last_name || ''}`.trim() || 'Worker';

  return {
    ...profile,
    full_name: fullName,
    fullName: fullName,
    profile_views: profile.profile_views != null ? Number(profile.profile_views) : 0,
    hourly_rate: profile.hourly_rate != null ? Number(profile.hourly_rate) : null,
    phone_number: phoneNumber,
    phoneNumber: phoneNumber,
    email: email,
    profile_image_url: profileImageUrl,
    profileImageUrl: profileImageUrl,
    is_verified: isVerified ?? (Boolean(userMeta?.email_verified) || Boolean(profile.is_verified)),
    isVerified: isVerified ?? (Boolean(userMeta?.email_verified) || Boolean(profile.is_verified)),
  };
};

export const getMyProfile = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    let profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    const userMeta = await prisma.user_metadata.findUnique({ where: { id: userId } });

    if (!profile) {
      profile = await prisma.worker_profiles.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          full_name: `${userMeta?.first_name || ''} ${userMeta?.last_name || ''}`.trim() || 'Worker',
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }
    return c.json(ApiResponse.ok(formatWorkerProfile(profile, userMeta)));
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

    let updatedUserMeta: any = null;
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

      updatedUserMeta = await prisma.user_metadata.update({
        where: { id: userId },
        data: { 
          phone_number: cleanPhone,
          onboarded: true,
          first_name: data.fullName ? data.fullName.split(' ')[0] : undefined,
          last_name: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : undefined,
        }
      });
    } else {
      updatedUserMeta = await prisma.user_metadata.update({
        where: { id: userId },
        data: { onboarded: true }
      });
    }

    return c.json(ApiResponse.ok("Profile updated", formatWorkerProfile(profile, updatedUserMeta)));
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
      where: {
        OR: [
          { user_id: { in: validUserIds } },
          { id: { in: validUserIds } }
        ]
      }
    });

    const targetUserIds = Array.from(new Set([
      ...validUserIds,
      ...profiles.map(p => p.user_id).filter(Boolean)
    ]));

    const [userMetaList, verifications] = await Promise.all([
      prisma.user_metadata.findMany({
        where: { id: { in: targetUserIds } }
      }),
      prisma.verification_records.findMany({
        where: { user_id: { in: targetUserIds } }
      })
    ]);

    const userMetaById = new Map();
    userMetaList.forEach(u => {
      userMetaById.set(u.id, u);
    });

    const verificationByUser = new Map();
    verifications.forEach(v => {
      verificationByUser.set(v.user_id, v);
    });

    let employerOffers = new Set();
    if (employerId) {
      const employerProfile = await prisma.employer_profiles.findFirst({
        where: { user_id: employerId }
      });
      const employerOwnerId = employerProfile?.id || employerId;

      const employerJobs = await prisma.jobs.findMany({ where: { employer_id: employerOwnerId }, select: { id: true } });
      const jobIds = employerJobs.map(j => j.id);
      if (jobIds.length > 0) {
        const offers = await prisma.job_applications.findMany({
          where: { 
            job_id: { in: jobIds },
            worker_id: { in: targetUserIds },
            status: { in: ['OFFER_SENT', 'PENDING', 'ACCEPTED'] } 
          },
          select: { worker_id: true }
        });
        offers.forEach(o => employerOffers.add(o.worker_id));
      }
    }

    const formatted = profiles.map((p) => {
      const meta = userMetaById.get(p.user_id) || userMetaById.get(p.id);
      const vRecord = verificationByUser.get(p.user_id) || verificationByUser.get(p.id);
      const isVerified = vRecord?.status === 'VERIFIED' || vRecord?.status === 'APPROVED' || Boolean(meta?.email_verified);
      
      const f = formatWorkerProfile(p, meta, isVerified);
      if (f) {
        f.isOfferSent = employerOffers.has(f.user_id) || employerOffers.has(f.id);
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
    await prisma.worker_profiles.updateMany({
      where: {
        OR: [
          { user_id: userId },
          { id: userId }
        ]
      },
      data: { profile_views: { increment: 1 } }
    });
    return c.json(ApiResponse.ok("View incremented", null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getWorkerById = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    let profile = await prisma.worker_profiles.findFirst({
      where: {
        OR: [
          { id },
          { user_id: id }
        ]
      }
    });

    if (!profile) {
      return c.json(ApiResponse.error("Worker profile not found"), 404 as any);
    }

    const [userMeta, verification] = await Promise.all([
      prisma.user_metadata.findUnique({
        where: { id: profile.user_id },
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
      prisma.verification_records.findFirst({
        where: { user_id: profile.user_id }
      })
    ]);

    const isVerified = verification?.status === 'VERIFIED' || verification?.status === 'APPROVED' || Boolean(userMeta?.email_verified);

    return c.json(ApiResponse.ok(formatWorkerProfile(profile, userMeta, isVerified)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getTrustScore = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    const profile = await prisma.worker_profiles.findFirst({
      where: {
        OR: [
          { user_id: userId },
          { id: userId }
        ]
      }
    });

    const targetUserId = profile?.user_id || userId;

    // Check verification status
    const verification = await prisma.verification_records.findFirst({
      where: { user_id: targetUserId, status: { in: ['APPROVED', 'VERIFIED'] } }
    });

    const userMeta = await prisma.user_metadata.findUnique({
      where: { id: targetUserId }
    });

    const isIdVerified = !!verification || Boolean(userMeta?.email_verified);

    // Count passed tests
    const passedTestsCount = await prisma.skill_test_results.count({
      where: { worker_id: targetUserId, passed: true }
    });

    // Rating aggregate
    const ratings = await prisma.ratings.aggregate({
      where: { ratee_id: targetUserId },
      _avg: { score: true },
      _count: { score: true }
    });

    // Completed jobs count
    const completedJobsCount = await prisma.job_applications.count({
      where: {
        worker_id: targetUserId,
        status: { in: ['COMPLETED', 'ACCEPTED'] }
      }
    });

    // Compute composite trust score (0 to 100)
    let computedScore = 50; // Base baseline
    if (isIdVerified) computedScore += 20;
    computedScore += Math.min(passedTestsCount * 5, 15); // Up to 15 points for skill tests
    if (ratings._count.score > 0 && ratings._avg.score) {
      computedScore += Math.round((ratings._avg.score / 5) * 15);
    }
    if (completedJobsCount > 0) {
      computedScore += Math.min(completedJobsCount * 2, 10);
    }
    computedScore = Math.min(100, Math.max(20, computedScore));

    const avgRating = ratings._avg.score ? Number(ratings._avg.score.toFixed(1)) : 4.8;
    const reliabilityRate = completedJobsCount > 0 ? 0.98 : 0.92;

    return c.json(ApiResponse.ok({
      score: profile?.trust_score && profile.trust_score > 0 ? profile.trust_score : computedScore,
      identityVerified: isIdVerified,
      skillsVerifiedCount: passedTestsCount,
      avgRating,
      reliabilityRate,
      completedJobsCount,
      ratingsCount: ratings._count.score,
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
