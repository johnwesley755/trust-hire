import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../services/mailer';
import { getOtpTemplate, getResetPasswordTemplate } from '../utils/emailTemplates';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } = req.body;

    const existing = await prisma.user_metadata.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json(ApiResponse.error("Email already in use"));
    }

    if (phoneNumber) {
      const existingPhone = await prisma.user_metadata.findFirst({
        where: { phone_number: phoneNumber }
      });
      if (existingPhone) {
        return res.status(400).json(ApiResponse.error("This phone number is already registered with another account. Please use a different phone number."));
      }
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const user = await prisma.user_metadata.create({
      data: {
        id: uuidv4(),
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role: role || 'WORKER',
        phone_number: phoneNumber || null,
        created_at: new Date(),
        updated_at: new Date(),
        email_verified: false,
        onboarded: false
      }
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

    res.json(ApiResponse.ok("Registration successful", { token, user }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user_metadata.findUnique({ where: { email } });
    if (!user || !user.password_hash) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    res.json(ApiResponse.ok("Login successful", { token, user }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await sendEmail(email, "Your OTP - TrustHyre", getOtpTemplate(otp));
  res.json(ApiResponse.ok(`OTP sent to ${email}`, "sent"));
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const user = await prisma.user_metadata.findUnique({ where: { email } });
  if (user) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user_metadata.update({
      where: { email },
      data: { reset_token: token, reset_token_expiry: new Date(Date.now() + 3600000) }
    });
    await sendEmail(email, "Reset Password - TrustHyre", getResetPasswordTemplate(token));
  }
  res.json(ApiResponse.ok("Reset email sent successfully", "sent"));
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await prisma.user_metadata.findFirst({
    where: { reset_token: token, reset_token_expiry: { gt: new Date() } }
  });
  if (!user) return res.status(400).json(ApiResponse.error("Invalid or expired token"));

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user_metadata.update({
    where: { id: user.id },
    data: { password_hash: passwordHash, reset_token: null, reset_token_expiry: null }
  });
  res.json(ApiResponse.ok("Password updated successfully", "updated"));
};

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json(ApiResponse.error("Unauthorized"));
  const user = await prisma.user_metadata.findUnique({ where: { id: req.user.sub } });
  if (!user) return res.status(404).json(ApiResponse.error("User not found"));
  res.json(ApiResponse.ok(user));
};

export const syncUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json(ApiResponse.error("Unauthorized"));
  
  try {
    const rawData = { ...req.body };
    const phoneNumber = rawData.phone_number || rawData.phoneNumber;

    // Check phone number uniqueness if provided
    if (phoneNumber) {
      const duplicatePhone = await prisma.user_metadata.findFirst({
        where: {
          phone_number: phoneNumber,
          id: { not: req.user.sub }
        }
      });

      if (duplicatePhone) {
        return res.status(400).json(
          ApiResponse.error("This phone number is already registered with another account. Please use a different phone number.")
        );
      }
    }

    const updatePayload: any = {
      updated_at: new Date()
    };

    if (rawData.first_name || rawData.firstName) updatePayload.first_name = rawData.first_name || rawData.firstName;
    if (rawData.last_name || rawData.lastName) updatePayload.last_name = rawData.last_name || rawData.lastName;
    if (rawData.profile_image_url || rawData.profileImageUrl) updatePayload.profile_image_url = rawData.profile_image_url || rawData.profileImageUrl;
    if (phoneNumber) updatePayload.phone_number = phoneNumber;
    if (typeof rawData.onboarded === 'boolean') updatePayload.onboarded = rawData.onboarded;

    const updated = await prisma.user_metadata.update({
      where: { id: req.user.sub },
      data: updatePayload
    });

    // If user is a worker, update or create their worker profile
    if (updated.role === 'WORKER') {
      const workerPayload: any = {
        updated_at: new Date()
      };
      if (updatePayload.first_name || updatePayload.last_name) {
        workerPayload.full_name = `${updatePayload.first_name || updated.first_name || ''} ${updatePayload.last_name || updated.last_name || ''}`.trim();
      }
      if (rawData.skills) workerPayload.skills = Array.isArray(rawData.skills) ? rawData.skills.join(', ') : rawData.skills;
      if (rawData.location) workerPayload.location = rawData.location;
      if (rawData.city) workerPayload.city = rawData.city;
      if (rawData.address) workerPayload.address = rawData.address;
      if (rawData.bio) workerPayload.bio = rawData.bio;
      if (rawData.hourlyRate || rawData.hourly_rate) workerPayload.hourly_rate = Number(rawData.hourlyRate || rawData.hourly_rate);
      if (rawData.experienceYears || rawData.experience_years) workerPayload.experience_years = Number(rawData.experienceYears || rawData.experience_years);

      await prisma.worker_profiles.upsert({
        where: { user_id: req.user.sub },
        update: workerPayload,
        create: {
          user_id: req.user.sub,
          full_name: workerPayload.full_name || `${updated.first_name || 'Worker'} ${updated.last_name || ''}`.trim(),
          skills: workerPayload.skills || '',
          location: workerPayload.location || '',
          city: workerPayload.city || 'Mumbai',
          level: 'L1',
          level_number: 1,
          experience_years: workerPayload.experience_years || 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      }).catch((e: any) => console.warn("Worker profile sync notice:", e.message));
    }

    res.json(ApiResponse.ok("User synced", updated));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getUsersByIds = async (req: Request, res: Response) => {
  const userIds: string[] = req.body;
  const users = await prisma.user_metadata.findMany({
    where: { id: { in: userIds } },
    select: { id: true, first_name: true, last_name: true, email: true, profile_image_url: true, role: true }
  });
  res.json(ApiResponse.ok(users));
};

export const oauthSync = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, profileImageUrl } = req.body;
    if (!email) {
      return res.status(400).json(ApiResponse.error("Email is required"));
    }

    let user = await prisma.user_metadata.findUnique({ where: { email } });
    
    // Strictly block employers from using Google OAuth
    if (user && user.role === 'EMPLOYER') {
      return res.status(403).json(ApiResponse.error("This email is registered as an Employer account. Employers must sign in with Business Email OTP."));
    }

    if (!user) {
      const newId = uuidv4();
      user = await prisma.user_metadata.create({
        data: {
          id: newId,
          email,
          first_name: firstName || 'Worker',
          last_name: lastName || '',
          profile_image_url: profileImageUrl,
          role: 'WORKER', // Google OAuth is strictly for WORKER role
          created_at: new Date(),
          updated_at: new Date(),
          email_verified: true,
          onboarded: true, // Workers go directly to candidate workspace
        }
      });

      await prisma.worker_profiles.create({
        data: {
          user_id: newId,
          full_name: `${firstName || 'Worker'} ${lastName || ''}`.trim(),
          level: 'L1',
          level_number: 1,
          level_score: 100,
          experience_years: 1,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }).catch((e: any) => console.warn("Worker profile auto-creation notice:", e.message));
    } else {
      user = await prisma.user_metadata.update({
        where: { id: user.id },
        data: {
          profile_image_url: profileImageUrl || user.profile_image_url,
          first_name: firstName || user.first_name,
          last_name: lastName || user.last_name,
          updated_at: new Date(),
        }
      });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '30d' }
    );

    res.json(ApiResponse.ok("OAuth sync successful", { token, user }));
  } catch (err: any) {
    console.error("OAuth sync error:", err);
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const handleLegacyWebhook = (req: Request, res: Response) => {
  console.log("Received legacy webhook sync event:", req.body.type);
  res.sendStatus(200);
};

