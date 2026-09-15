import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const submitRating = async (c: Context) => {
  try {
    const reviewerId = c.get('user')?.sub;
    if (!reviewerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());
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
    return c.json(ApiResponse.ok("Rating submitted", rating));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getForUser = async (c: Context) => {
  try {
    const rateeId = c.req.param('rateeId') as string;
    const ratings = await prisma.ratings.findMany({ where: { ratee_id: rateeId } });
    return c.json(ApiResponse.ok(ratings));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getAverage = async (c: Context) => {
  try {
    const rateeId = c.req.param('rateeId') as string;
    const aggregations = await prisma.ratings.aggregate({
      where: { ratee_id: rateeId },
      _avg: { score: true }
    });
    return c.json(ApiResponse.ok(aggregations._avg.score || 0));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getMyRatings = async (c: Context) => {
  try {
    const reviewerId = c.get('user')?.sub;
    if (!reviewerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const ratings = await prisma.ratings.findMany({ where: { reviewer_id: reviewerId } });
    return c.json(ApiResponse.ok(ratings));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getById = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const rating = await prisma.ratings.findUnique({ where: { id } });
    if (!rating) return c.json(ApiResponse.error("Rating not found"), 404 as any);
    return c.json(ApiResponse.ok(rating));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
