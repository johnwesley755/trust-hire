import { Request, Response } from 'express';
import { uploadMedia, deleteMedia } from '../services/cloudinary';
import { ApiResponse } from '../utils/ApiResponse';

export const upload = async (req: Request, res: Response) => {
  res.json(ApiResponse.ok("File uploaded"));
};

export const remove = async (req: Request, res: Response) => {
  res.json(ApiResponse.ok("File deleted"));
};
