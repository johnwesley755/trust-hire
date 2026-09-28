import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

const formatEmployerProfile = (profile: any, user?: any) => {
  if (!profile && !user) return null;
  return {
    id: profile?.id,
    userId: profile?.user_id || user?.id,
    user_id: profile?.user_id || user?.id,
    companyName: profile?.company_name || user?.company_name || '',
    company_name: profile?.company_name || user?.company_name || '',
    industry: profile?.industry || 'Enterprise',
    companyWebsite: profile?.company_website || '',
    company_website: profile?.company_website || '',
    profileBio: profile?.profile_bio || '',
    profile_bio: profile?.profile_bio || '',
    businessTier: profile?.business_tier || 'STARTER',
    business_tier: profile?.business_tier || 'STARTER',
    isVerified: profile?.is_verified ?? (user?.identity_verified ?? false),
    is_verified: profile?.is_verified ?? (user?.identity_verified ?? false),
    location: profile?.location || '',
    city: profile?.city || '',
    address: profile?.address || '',
    latitude: profile?.latitude,
    longitude: profile?.longitude,
    phoneNumber: user?.phone_number || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
    profileImageUrl: user?.profile_image_url || null,
    profile_image_url: user?.profile_image_url || null,
    createdAt: profile?.created_at || user?.created_at,
    created_at: profile?.created_at || user?.created_at,
    updatedAt: profile?.updated_at || user?.updated_at,
    updated_at: profile?.updated_at || user?.updated_at
  };
};

export const getEmployerProfile = async (c: Context) => {
  try {
    const paramId = c.req.param('userId');
    const authUser = c.get('user');
    const targetUserId = (paramId && paramId !== 'profile' && paramId !== 'me') ? paramId : authUser?.sub;
    
    if (!targetUserId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    let profile = await prisma.employer_profiles.findFirst({
      where: {
        OR: [
          { user_id: targetUserId },
          { id: targetUserId }
        ]
      }
    });

    const user = await prisma.user_metadata.findUnique({
      where: { id: profile?.user_id || targetUserId }
    });
    
    if (!profile && user?.role === 'EMPLOYER') {
      profile = await prisma.employer_profiles.create({
        data: {
          id: uuidv4(),
          user_id: targetUserId,
          company_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'My Company',
          business_tier: 'STARTER',
          is_verified: user.email_verified ?? false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    if (profile || user) {
      return c.json(ApiResponse.ok(formatEmployerProfile(profile, user)));
    }

    // Return a safe fallback object for verified enterprise partner
    return c.json(ApiResponse.ok({
      id: targetUserId,
      userId: targetUserId,
      user_id: targetUserId,
      companyName: 'Verified Enterprise Partner',
      company_name: 'Verified Enterprise Partner',
      industry: 'Enterprise',
      businessTier: 'STARTER',
      business_tier: 'STARTER',
      isVerified: true,
      is_verified: true,
      location: 'Chennai',
      city: 'Chennai'
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateEmployerProfile = async (c: Context) => {
  try {
    const paramId = c.req.param('userId');
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const targetUserId = (paramId && paramId !== 'profile' && paramId !== 'me') ? paramId : authUser.sub;

    // Security fix 1.4: Prevent editing arbitrary users' profiles
    if (targetUserId !== authUser.sub && authUser.role !== 'ADMIN') {
      return c.json(ApiResponse.error("Forbidden: You cannot edit another employer's profile"), 403 as any);
    }

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

    // Security fix 1.5: Only ADMIN can change businessTier or isVerified directly
    if (authUser.role === 'ADMIN') {
      if (data.businessTier !== undefined || data.business_tier !== undefined) {
        dbData.business_tier = data.businessTier ?? data.business_tier;
      }
      if (data.isVerified !== undefined || data.is_verified !== undefined) {
        dbData.is_verified = data.isVerified ?? data.is_verified;
      }
    }

    const phone = data.phoneNumber || data.phone_number || data.businessPhone;
    if (phone) {
      const duplicatePhone = await prisma.user_metadata.findFirst({
        where: {
          phone_number: phone,
          id: { not: targetUserId }
        }
      });
      if (duplicatePhone) {
        return c.json(ApiResponse.error("This phone number is already registered with another account. Please use a different phone number."), 400 as any);
      }
      await prisma.user_metadata.update({
        where: { id: targetUserId },
        data: { phone_number: phone, updated_at: new Date() }
      });
    }

    const profileImg = data.profileImageUrl || data.profile_image_url || data.profilePhoto;
    if (profileImg !== undefined) {
      await prisma.user_metadata.update({
        where: { id: targetUserId },
        data: { profile_image_url: profileImg, updated_at: new Date() }
      });
    }

    const profile = await prisma.employer_profiles.upsert({
      where: { user_id: targetUserId },
      update: { ...dbData, updated_at: new Date() },
      create: {
        ...dbData,
        id: uuidv4(),
        user_id: targetUserId,
        business_tier: dbData.business_tier || 'STARTER',
        is_verified: dbData.is_verified ?? false,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    const user = await prisma.user_metadata.findUnique({ where: { id: targetUserId } });
    return c.json(ApiResponse.ok("Profile updated", formatEmployerProfile(profile, user)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateEmployerTier = async (c: Context) => {
  try {
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);
    
    // Tier updates are restricted to admin or payment verification
    if (authUser.role !== 'ADMIN') {
      return c.json(ApiResponse.error("Forbidden: Tier upgrades must be completed via subscription verification"), 403 as any);
    }

    const { tier, userId } = await c.req.json();
    const targetUserId = userId || authUser.sub;
    const profile = await prisma.employer_profiles.update({
      where: { user_id: targetUserId },
      data: { business_tier: tier, updated_at: new Date() }
    });
    return c.json(ApiResponse.ok("Tier updated", formatEmployerProfile(profile)));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
