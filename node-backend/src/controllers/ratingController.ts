import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const submitRating = async (req: Request, res: Response) => {
  try {
    const reviewerId = req.user?.sub;
    if (!reviewerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const data = req.body;
    const rating = await prisma.ratings.create({
      data: {
        id: uuidv4(),
        reviewer_id: reviewerId,
        ratee_id: data.rateeId || data.ratee_id,
        job_id: data.jobId || data.job_id,
        score: data.score,
        comment: data.comment,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json(ApiResponse.ok("Rating submitted", rating));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getForUser = async (req: Request, res: Response) => {
  try {
    const rateeId = req.params.rateeId as string;
    const ratings = await prisma.ratings.findMany({ where: { ratee_id: rateeId } });
    res.json(ApiResponse.ok(ratings));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getAverage = async (req: Request, res: Response) => {
  try {
    const rateeId = req.params.rateeId as string;
    const aggregations = await prisma.ratings.aggregate({
      where: { ratee_id: rateeId },
      _avg: { score: true }
    });
    res.json(ApiResponse.ok(aggregations._avg.score || 0));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getMyRatings = async (req: Request, res: Response) => {
  try {
    const reviewerId = req.user?.sub;
    if (!reviewerId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const ratings = await prisma.ratings.findMany({ where: { reviewer_id: reviewerId } });
    res.json(ApiResponse.ok(ratings));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const rating = await prisma.ratings.findUnique({ where: { id } });
    if (!rating) return res.status(404).json(ApiResponse.error("Rating not found"));
    res.json(ApiResponse.ok(rating));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
