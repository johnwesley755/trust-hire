import { Context } from 'hono';
import { uploadMedia, deleteMedia } from '../services/cloudinary';
import { ApiResponse } from '../utils/ApiResponse';

export const upload = async (c: Context) => {
  return c.json(ApiResponse.ok("File uploaded"));
};

export const remove = async (c: Context) => {
  return c.json(ApiResponse.ok("File deleted"));
};
