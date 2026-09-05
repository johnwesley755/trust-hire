import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';
import { uploadMedia } from '../services/cloudinary';

export const uploadDoc = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const file = (req as any).file;
    let docUrl = "placeholder_url";
    if (file) {
      const result = await uploadMedia(file.path, 'verifications');
      docUrl = result.secure_url;
    }

    let record = await prisma.verification_records.findFirst({ where: { user_id: userId } });
    if (!record) {
      record = await prisma.verification_records.create({
        data: {
          id: uuidv4(),
          user_id: userId,
          doc_image_url: docUrl,
          status: 'PENDING',
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    } else {
      record = await prisma.verification_records.update({
        where: { id: record.id },
        data: { doc_image_url: docUrl, updated_at: new Date() }
      });
    }

    res.json(ApiResponse.ok("Document uploaded", record));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const captureLive = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const file = (req as any).file;
    let liveUrl = "placeholder_url";
    if (file) {
      const result = await uploadMedia(file.path, 'verifications');
      liveUrl = result.secure_url;
    }

    let record = await prisma.verification_records.findFirst({ where: { user_id: userId } });
    if (!record) {
       return res.status(400).json(ApiResponse.error("Upload document first"));
    }

    record = await prisma.verification_records.update({
      where: { id: record.id },
      data: { live_image_url: liveUrl, status: 'PROCESSING', updated_at: new Date() }
    });

    res.json(ApiResponse.ok("Live capture completed", record));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const record = await prisma.verification_records.findFirst({ where: { user_id: userId } });
    res.json(ApiResponse.ok(record));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
