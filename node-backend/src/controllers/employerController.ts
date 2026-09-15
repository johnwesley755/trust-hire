import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const getEmployerProfile = async (c: Context) => {
  try {
    const userId = c.req.param('userId') || c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);
    
    const profile = await prisma.employer_profiles.findUnique({ where: { user_id: userId } });
    // If no profile exists, return null data rather than a 404 HTTP error so the frontend doesn't crash/retry
    return c.json(ApiResponse.ok(profile || null));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateEmployerProfile = async (c: Context) => {
  try {
    const userId = c.req.param('userId') || c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);
    
    const data = (await c.req.json());
    
    // Map camelCase to snake_case for Prisma
    const dbData = {
      company_name: data.companyName,
      industry: data.industry,
      company_website: data.companyWebsite,
      profile_bio: data.profileBio,
      city: data.city,
      location: data.location,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      business_tier: data.businessTier,
    };
    
    // Remove undefined fields so we don't accidentally overwrite existing data with nulls if not provided
    Object.keys(dbData).forEach(key => (dbData as any)[key] === undefined && delete (dbData as any)[key]);

    const profile = await prisma.employer_profiles.upsert({
      where: { user_id: userId },
      update: { ...dbData, updated_at: new Date() },
      create: { ...dbData, id: uuidv4(), user_id: userId, created_at: new Date(), updated_at: new Date() }
    });
    return c.json(ApiResponse.ok("Profile updated", profile));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
