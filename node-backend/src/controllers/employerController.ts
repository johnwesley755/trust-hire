import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatEmployerProfile = (profile: any, user?: any) => {
  if (!profile) return null;
  return {
    id: profile.id,
    userId: profile.user_id,
    user_id: profile.user_id,
    companyName: profile.company_name || user?.company_name || '',
    company_name: profile.company_name || user?.company_name || '',
    industry: profile.industry || 'Enterprise',
    companyWebsite: profile.company_website || '',
    company_website: profile.company_website || '',
    profileBio: profile.profile_bio || '',
    profile_bio: profile.profile_bio || '',
    businessTier: profile.business_tier || 'VERIFIED',
    business_tier: profile.business_tier || 'VERIFIED',
    isVerified: profile.is_verified ?? true,
    is_verified: profile.is_verified ?? true,
    location: profile.location || '',
    city: profile.city || '',
    address: profile.address || '',
    latitude: profile.latitude,
    longitude: profile.longitude,
    profileImageUrl: user?.profile_image_url || null,
    profile_image_url: user?.profile_image_url || null,
    createdAt: profile.created_at,
    created_at: profile.created_at,
    updatedAt: profile.updated_at,
    updated_at: profile.updated_at
  };
};

export const getEmployerProfile = async (c: Context) => {
  try {
    const paramId = c.req.param('userId');
    const userId = (paramId && paramId !== 'profile' && paramId !== 'me') ? paramId : c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    let profile = await prisma.employer_profiles.findUnique({ where: { user_id: userId } });
    const user = await prisma.user_metadata.findUnique({ where: { id: userId } });
    
    if (!profile && user?.role === 'EMPLOYER') {
      profile = await prisma.employer_profiles.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          company_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'My Company',
          business_tier: 'VERIFIED',
          is_verified: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    return c.json(ApiResponse.ok(formatEmployerProfile(profile, user)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateEmployerProfile = async (c: Context) => {
  try {
    const paramId = c.req.param('userId');
    const userId = (paramId && paramId !== 'profile' && paramId !== 'me') ? paramId : c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());

    const dbData: any = {};
    if (data.companyName !== undefined || data.company_name !== undefined) {
      dbData.company_name = data.companyName ?? data.company_name;
    }
    if (data.industry !== undefined) dbData.industry = data.industry;
    if (data.companyWebsite !== undefined || data.company_website !== undefined) {
      dbData.company_website = data.companyWebsite ?? data.company_website;
    }
    if (data.profileBio !== undefined || data.profile_bio !== undefined) {
      dbData.profile_bio = data.profileBio ?? data.profile_bio;
    }
    if (data.city !== undefined) dbData.city = data.city;
    if (data.location !== undefined) dbData.location = data.location;
    if (data.address !== undefined) dbData.address = data.address;
    if (data.latitude !== undefined) dbData.latitude = data.latitude ? Number(data.latitude) : null;
    if (data.longitude !== undefined) dbData.longitude = data.longitude ? Number(data.longitude) : null;
    if (data.businessTier !== undefined || data.business_tier !== undefined) {
      dbData.business_tier = data.businessTier ?? data.business_tier;
    }
    if (data.isVerified !== undefined || data.is_verified !== undefined) {
      dbData.is_verified = data.isVerified ?? data.is_verified;
    }

    const profile = await prisma.employer_profiles.upsert({
      where: { user_id: userId },
      update: { ...dbData, updated_at: new Date() },
      create: {
        ...dbData,
        id: uuidv4(),
        user_id: userId,
        business_tier: dbData.business_tier || 'VERIFIED',
        is_verified: dbData.is_verified ?? true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    const user = await prisma.user_metadata.findUnique({ where: { id: userId } });
    return c.json(ApiResponse.ok("Profile updated", formatEmployerProfile(profile, user)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateEmployerTier = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);
    const { tier } = await c.req.json();
    const profile = await prisma.employer_profiles.update({
      where: { user_id: userId },
      data: { business_tier: tier, updated_at: new Date() }
    });
    return c.json(ApiResponse.ok("Tier updated", formatEmployerProfile(profile)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
