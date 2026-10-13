import { Context } from 'hono';
import prisma from '../config/prisma';
import { uploadMedia, deleteMedia } from '../services/cloudinary';
import { ApiResponse } from '../utils/ApiResponse';

export const upload = async (c: Context) => {
  try {
    const contentType = c.req.header('content-type') || '';
    let mediaInput: any = null;

    if (contentType.includes('multipart/form-data')) {
      const body = await c.req.parseBody();
      const file = body['file'] || body['image'] || body['document'];
      if (file && typeof file === 'object' && 'arrayBuffer' in (file as any)) {
        const arrayBuf = await (file as any).arrayBuffer();
        if (arrayBuf.byteLength > 10 * 1024 * 1024) {
          return c.json(ApiResponse.error("File size exceeds 10MB limit"), 400 as any);
        }
        mediaInput = Buffer.from(arrayBuf);
      } else if (typeof file === 'string') {
        mediaInput = file;
      }
    } else {
      const jsonBody = await c.req.json().catch(() => ({}));
      mediaInput = jsonBody.image || jsonBody.file || jsonBody.dataUrl || jsonBody.base64 || jsonBody.url;
    }

    if (!mediaInput) {
      return c.json(ApiResponse.error("No file or image provided for upload"), 400 as any);
    }

    const result = await uploadMedia(mediaInput, 'media');
    return c.json(ApiResponse.ok("File uploaded successfully", {
      url: result.secure_url,
      publicId: result.public_id,
      format: (result as any).format || 'jpg',
      width: (result as any).width || 800,
      height: (result as any).height || 600
    }));
  } catch (err: any) {
    console.error("Upload error in mediaController:", err);
    return c.json(ApiResponse.error(err.message || "Upload failed"), 500 as any);
  }
};

export const remove = async (c: Context) => {
  try {
    const authUser = c.get('user');
    if (!authUser?.sub) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const id = c.req.param('id') as string;
    if (!id) return c.json(ApiResponse.error("Media ID required"), 400 as any);

    // Security Gate: Validate asset ownership
    if (authUser.role !== 'ADMIN') {
      const [userWithMedia, workerWithMedia, verificationWithMedia] = await Promise.all([
        prisma.user_metadata.findFirst({
          where: {
            id: authUser.sub,
            profile_image_url: { contains: id }
          }
        }),
        prisma.worker_profiles.findFirst({
          where: {
            user_id: authUser.sub,
            OR: [
              { profile_image_url: { contains: id } },
              { resume_url: { contains: id } }
            ]
          }
        }),
        prisma.verification_records.findFirst({
          where: {
            user_id: authUser.sub,
            OR: [
              { doc_image_url: { contains: id } },
              { live_image_url: { contains: id } }
            ]
          }
        })
      ]);

      const isOwner = Boolean(userWithMedia || workerWithMedia || verificationWithMedia);
      if (!isOwner) {
        return c.json(ApiResponse.error("Forbidden: You do not own this media asset."), 403 as any);
      }
    }

    const result = await deleteMedia(id);
    return c.json(ApiResponse.ok("File deleted", result));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
