import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const submitRating = async (c: Context) => {
  try {
    const reviewerId = c.get('user')?.sub;
    if (!reviewerId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const data = (await c.req.json());
    const rateeId = data.rateeId || data.ratee_id;
    const jobId = data.jobId || data.job_id;
    const score = Number(data.score);

    if (!rateeId || !jobId) {
      return c.json(ApiResponse.error("rateeId and jobId are required"), 400 as any);
    }

    if (isNaN(score) || score < 1 || score > 5) {
      return c.json(ApiResponse.error("Score must be a number between 1 and 5"), 400 as any);
    }

    if (reviewerId === rateeId) {
      return c.json(ApiResponse.error("You cannot rate yourself"), 400 as any);
    }

    // Check if job exists
    const job = await prisma.jobs.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return c.json(ApiResponse.error("Job not found"), 404 as any);
    }

    const employerProfile = await prisma.employer_profiles.findFirst({
      where: {
        OR: [
          { id: job.employer_id },
          { user_id: job.employer_id }
        ]
      }
    });

    const acceptedApplications = await prisma.job_applications.findMany({
      where: {
        job_id: jobId,
        status: { in: ['ACCEPTED', 'COMPLETED', 'HIRED'] }
      }
    });

    // Verify reviewer and ratee participated in this job
    const employerUserId = employerProfile?.user_id || job.employer_id;
    const isEmployerReviewer = employerUserId === reviewerId;
    const isEmployerRatee = employerUserId === rateeId;
    
    const acceptedWorkerUserIds = acceptedApplications.map(app => app.worker_id).filter(Boolean);
    const isWorkerReviewer = acceptedWorkerUserIds.includes(reviewerId);
    const isWorkerRatee = acceptedWorkerUserIds.includes(rateeId);

    const validInteraction = (isEmployerReviewer && isWorkerRatee) || (isWorkerReviewer && isEmployerRatee);

    if (!validInteraction) {
      return c.json(ApiResponse.error("You can only rate participants of a job you worked on or hired for"), 403 as any);
    }

    // Check duplicate rating
    const existingRating = await prisma.ratings.findFirst({
      where: {
        reviewer_id: reviewerId,
        ratee_id: rateeId,
        job_id: jobId
      }
    });

    if (existingRating) {
      return c.json(ApiResponse.error("You have already submitted a rating for this job participant"), 400 as any);
    }

    const rating = await prisma.ratings.create({
      data: {
        id: uuidv4(),
        reviewer_id: reviewerId,
        ratee_id: rateeId,
        job_id: jobId,
        score: score,
        comment: data.comment || '',
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    return c.json(ApiResponse.ok("Rating submitted successfully", rating));
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
