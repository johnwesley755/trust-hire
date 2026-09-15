import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';
import { uploadMedia } from '../services/cloudinary';

export const uploadDoc = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const file = (c.req as any).file;
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

    return c.json(ApiResponse.ok("Document uploaded", record));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const captureLive = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const file = (c.req as any).file;
    let liveUrl = "placeholder_url";
    if (file) {
      const result = await uploadMedia(file.path, 'verifications');
      liveUrl = result.secure_url;
    }

    let record = await prisma.verification_records.findFirst({ where: { user_id: userId } });
    if (!record) {
       return c.json(ApiResponse.error("Upload document first"), 400 as any);
    }

    record = await prisma.verification_records.update({
      where: { id: record.id },
      data: { live_image_url: liveUrl, status: 'PROCESSING', updated_at: new Date() }
    });

    return c.json(ApiResponse.ok("Live capture completed", record));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getStatus = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const record = await prisma.verification_records.findFirst({ where: { user_id: userId } });
    return c.json(ApiResponse.ok(record));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
