import { Context } from 'hono';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { ApiResponse } from '../utils/ApiResponse';

export const getSettings = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

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
    return c.json(ApiResponse.ok(settings));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const updateSettings = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());
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
    return c.json(ApiResponse.ok("Settings updated", settings));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const changePassword = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const { oldPassword, newPassword } = (await c.req.json());
    const user = await prisma.user_metadata.findUnique({ where: { id: userId } });

    if (!user || !user.password_hash) {
       return c.json(ApiResponse.error("Cannot change password for this account type"), 400 as any);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) return c.json(ApiResponse.error("Incorrect old password"), 400 as any);

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user_metadata.update({
      where: { id: userId },
      data: { password_hash: hash, updated_at: new Date() }
    });

    return c.json(ApiResponse.ok("Password changed successfully", "success"));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
