import { Context } from 'hono';
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
    const id = c.req.param('id') as string;
    if (!id) return c.json(ApiResponse.error("Media ID required"), 400 as any);
    const result = await deleteMedia(id);
    return c.json(ApiResponse.ok("File deleted", result));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
