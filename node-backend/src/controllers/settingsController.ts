import { Request, Response } from 'express';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { ApiResponse } from '../utils/ApiResponse';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    let settings = await prisma.user_settings.findUnique({ where: { user_id: userId } });
    if (!settings) {
      settings = await prisma.user_settings.create({
        data: {
          user_id: userId,
          email_notifications: true,
          push_notifications: true,
          marketing_emails: false,
          language: 'en',
          updated_at: new Date()
        }
      });
    }
    res.json(ApiResponse.ok(settings));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const data = req.body;
    const settings = await prisma.user_settings.upsert({
      where: { user_id: userId },
      update: { ...data, updated_at: new Date() },
      create: {
        ...data,
        user_id: userId,
        email_notifications: data.email_notifications || true,
        push_notifications: data.push_notifications || true,
        marketing_emails: data.marketing_emails || false,
        updated_at: new Date()
      }
    });
    res.json(ApiResponse.ok("Settings updated", settings));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const { oldPassword, newPassword } = req.body;
    const user = await prisma.user_metadata.findUnique({ where: { id: userId } });

    if (!user || !user.password_hash) {
       return res.status(400).json(ApiResponse.error("Cannot change password for this account type"));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) return res.status(400).json(ApiResponse.error("Incorrect old password"));

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user_metadata.update({
      where: { id: userId },
      data: { password_hash: hash, updated_at: new Date() }
    });

    res.json(ApiResponse.ok("Password changed successfully", "success"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
