import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

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
    res.json(ApiResponse.ok(profile));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const data = req.body;
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

    await prisma.user_metadata.update({
      where: { id: userId },
      data: { onboarded: true }
    });

    res.json(ApiResponse.ok("Profile updated", profile));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getProfileCompletion = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });

    let isComplete = false;
    let missingFields: string[] = [];
    if (profile) {
      if (!profile.full_name) missingFields.push('fullName');
      if (!profile.skills) missingFields.push('skills');
      if (!profile.hourly_rate) missingFields.push('hourlyRate');
      isComplete = missingFields.length === 0;
    }

    res.json(ApiResponse.ok({ isComplete, missingFields }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getProfilesByUserIds = async (req: Request, res: Response) => {
  try {
    const userIds: string[] = req.body;
    const profiles = await prisma.worker_profiles.findMany({
      where: { user_id: { in: userIds } }
    });
    res.json(ApiResponse.ok(profiles));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const incrementProfileView = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await prisma.worker_profiles.update({
      where: { user_id: userId },
      data: { profile_views: { increment: 1 } }
    });
    res.json(ApiResponse.ok("View incremented", null));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getTrustScore = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const profile = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    const user = await prisma.user_metadata.findUnique({ where: { id: userId } });

    const trustScore = profile?.trust_score || 0;
    const identityVerified = user?.identity_verified || false;
    const avgRating = profile?.performance_score || 0.0;

    res.json(ApiResponse.ok({
      score: trustScore,
      identityVerified,
      skillsVerifiedCount: 0,
      avgRating,
      reliabilityRate: 0.95,
      lastUpdated: new Date().toISOString()
    }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const totalWorkers = await prisma.worker_profiles.count();
    res.json(ApiResponse.ok({ totalWorkers }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
