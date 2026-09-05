import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

export const requestEarlyAccess = async (req: Request, res: Response) => {
  try {
    console.log("Early access request:", req.body);
    res.json(ApiResponse.ok("Early access requested"));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
