import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const getEmployerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const profile = await prisma.employer_profiles.findUnique({ where: { user_id: userId } });
    if (!profile) return res.status(404).json(ApiResponse.error("Employer profile not found"));
    res.json(ApiResponse.ok(profile));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const updateEmployerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const data = req.body;
    const profile = await prisma.employer_profiles.upsert({
      where: { user_id: userId },
      update: { ...data, updated_at: new Date() },
      create: { ...data, id: uuidv4(), user_id: userId, created_at: new Date(), updated_at: new Date() }
    });
    res.json(ApiResponse.ok("Profile updated", profile));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
