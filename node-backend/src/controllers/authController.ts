import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../services/mailer';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } = req.body;

    const existing = await prisma.user_metadata.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json(ApiResponse.error("Email already in use"));
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
        phone_number: phoneNumber,
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
  await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);
  res.json(ApiResponse.ok(`OTP sent to ${email}`, "sent"));
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const user = await prisma.user_metadata.findUnique({ where: { email } });
  if (user) {
    const token = uuidv4();
    await prisma.user_metadata.update({
      where: { email },
      data: { reset_token: token, reset_token_expiry: new Date(Date.now() + 3600000) }
    });
    await sendEmail(email, "Reset Password", `Token: ${token}`);
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
  const updated = await prisma.user_metadata.update({
    where: { id: req.user.sub },
    data: { ...req.body, updated_at: new Date() }
  });
  res.json(ApiResponse.ok("User synced", updated));
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
    const { email, firstName, lastName, profileImageUrl, role } = req.body;
    if (!email) {
      return res.status(400).json(ApiResponse.error("Email is required"));
    }

    let user = await prisma.user_metadata.findUnique({ where: { email } });
    if (!user) {
      const newId = uuidv4();
      user = await prisma.user_metadata.create({
        data: {
          id: newId,
          email,
          first_name: firstName || 'Worker',
          last_name: lastName || '',
          profile_image_url: profileImageUrl,
          role: role || 'WORKER',
          created_at: new Date(),
          updated_at: new Date(),
          email_verified: true,
          onboarded: true,
        }
      });

      if ((role || 'WORKER') === 'WORKER') {
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
      }
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

