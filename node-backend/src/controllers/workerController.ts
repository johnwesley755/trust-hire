import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatWorkerProfile = (profile: any, userMeta?: any, isVerified?: boolean) => {
  if (!profile) return profile;
  const phoneNumber = userMeta?.phone_number || profile.phone_number || profile.phoneNumber || null;
  const email = userMeta?.email || profile.email || null;
  const profileImageUrl = profile.profile_image_url || userMeta?.profile_image_url || profile.profileImageUrl || userMeta?.photoURL || null;
  const fullName = profile.full_name || `${userMeta?.first_name || ''} ${userMeta?.last_name || ''}`.trim() || 'Worker';

  // Safely parse JSON array fields
  const parseList = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fallback comma-separated
    }
    return String(val).split(',').map(s => s.trim()).filter(Boolean);
  };

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
    profilePhoto: profileImageUrl,
    is_verified: isVerified ?? (Boolean(userMeta?.email_verified) || Boolean(profile.is_verified)),
    isVerified: isVerified ?? (Boolean(userMeta?.email_verified) || Boolean(profile.is_verified)),
    
    // Onboarding & Resume Builder fields
    dob: profile.dob || null,
    gender: profile.gender || null,
    whatsapp_opt_in: profile.whatsapp_opt_in ?? true,
    area: profile.area || null,
    willing_to_relocate: Boolean(profile.willing_to_relocate),
    preferred_cities: parseList(profile.preferred_cities),
    highest_education: profile.highest_education || null,
    is_pursuing_education: Boolean(profile.is_pursuing_education),
    college_name: profile.college_name || null,
    degree: profile.degree || null,
    specialization: profile.specialization || null,
    school_medium: profile.school_medium || null,
    english_proficiency: profile.english_proficiency || 'BASIC',
    languages_known: parseList(profile.languages_known),
    preferred_roles: parseList(profile.preferred_roles),
    resume_url: profile.resume_url || null,
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
          profile_image_url: userMeta?.profile_image_url || null,
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

    // Normalize Array / string fields for persistence
    const languagesStr = Array.isArray(data.languagesKnown) 
      ? JSON.stringify(data.languagesKnown) 
      : (data.languagesKnown ? String(data.languagesKnown) : undefined);

    const preferredRolesStr = Array.isArray(data.preferredRoles) 
      ? JSON.stringify(data.preferredRoles) 
      : (data.preferredRoles ? String(data.preferredRoles) : undefined);

    const preferredCitiesStr = Array.isArray(data.preferredCities) 
      ? JSON.stringify(data.preferredCities) 
      : (data.preferredCities ? String(data.preferredCities) : undefined);

    let parsedDob: Date | undefined = undefined;
    if (data.dob) {
      const d = new Date(data.dob);
      if (!isNaN(d.getTime())) {
        parsedDob = d;
      }
    }

    const profileImageUrl = data.profileImageUrl || data.profile_image_url || data.profilePhoto || undefined;

    const updatePayload: any = {
      full_name: data.fullName,
      profile_image_url: profileImageUrl,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      area: data.area,
      address: data.address,
      bio: data.bio,
      skills: data.skills,
      experience_years: data.experienceYears !== undefined ? Number(data.experienceYears) : undefined,
      hourly_rate: data.hourlyRate !== undefined ? Number(data.hourlyRate) : undefined,
      level: data.level,
      is_available: data.isAvailable !== undefined ? Boolean(data.isAvailable) : undefined,
      
      // Demographics & Education
      dob: parsedDob,
      gender: data.gender,
      whatsapp_opt_in: data.whatsappOptIn !== undefined ? Boolean(data.whatsappOptIn) : undefined,
      willing_to_relocate: data.willingToRelocate !== undefined ? Boolean(data.willingToRelocate) : undefined,
      preferred_cities: preferredCitiesStr,
      highest_education: data.highestEducation,
      is_pursuing_education: data.isPursuingEducation !== undefined ? Boolean(data.isPursuingEducation) : undefined,
      college_name: data.collegeName,
      degree: data.degree,
      specialization: data.specialization,
      school_medium: data.schoolMedium,
      english_proficiency: data.englishProficiency,
      languages_known: languagesStr,
      preferred_roles: preferredRolesStr,
      resume_url: data.resumeUrl,
      updated_at: new Date()
    };

    const profile = await prisma.worker_profiles.upsert({
      where: { user_id: userId },
      update: updatePayload,
      create: {
        id: uuidv4(),
        user_id: userId,
        ...updatePayload,
        created_at: new Date()
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
          profile_image_url: profileImageUrl,
          onboarded: true,
          first_name: data.fullName ? data.fullName.split(' ')[0] : undefined,
          last_name: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : undefined,
        }
      });
    } else {
      updatedUserMeta = await prisma.user_metadata.update({
        where: { id: userId },
        data: { 
          profile_image_url: profileImageUrl,
          onboarded: true,
          first_name: data.fullName ? data.fullName.split(' ')[0] : undefined,
          last_name: data.fullName ? data.fullName.split(' ').slice(1).join(' ') : undefined,
        }
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
