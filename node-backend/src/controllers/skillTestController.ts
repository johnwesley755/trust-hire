import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const getAvailableTests = async (c: Context) => {
  try {
    const { category  } = c.req.query();
    let tests;
    if (category) {
       tests = await prisma.skill_tests.findMany({ where: { category: category as string } });
    } else {
       tests = await prisma.skill_tests.findMany();
    }
    return c.json(ApiResponse.ok(tests));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getTestById = async (c: Context) => {
  try {
    const id = c.req.param('id') as string;
    const test = await prisma.skill_tests.findUnique({
      where: { id },
      include: { skill_test_questions: true }
    });
    if (!test) return c.json(ApiResponse.error("Test not found"), 404 as any);
    return c.json(ApiResponse.ok(test));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const submitResult = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    const testId = c.req.param('id') || (await c.req.json()).testId;
    const { answers } = (await c.req.json());

    const test = await prisma.skill_tests.findUnique({
      where: { id: testId },
      include: { skill_test_questions: true }
    });

    if (!test) return c.json(ApiResponse.error("Test not found"), 404 as any);

    let score = 0;
    let totalPoints = 0;

    for (const q of test.skill_test_questions) {
      totalPoints += q.points || 1;
      const ans = answers ? (answers[q.id] !== undefined ? answers[q.id] : answers[test.skill_test_questions.indexOf(q)]) : undefined;
      if (ans !== undefined && ans === q.correct_option) {
         score += q.points || 1;
      }
    }

    const percentage = totalPoints > 0 ? Math.floor((score / totalPoints) * 100) : 0;
    const passed = percentage >= 70;

    const result = await prisma.skill_test_results.create({
      data: {
        id: uuidv4(),
        test_id: testId,
        worker_id: userId,
        score: percentage,
        passed,
        completed_at: new Date()
      }
    });

    if (passed) {
      await prisma.worker_profiles.updateMany({
        where: { user_id: userId },
        data: { skill_score: { increment: 5 } }
      });
    }

    return c.json(ApiResponse.ok("Test submitted", result));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getWorkerResults = async (c: Context) => {
  try {
    const workerId = String(c.req.param('workerId'));
    const results = await prisma.skill_test_results.findMany({
      where: { worker_id: workerId },
      include: { skill_tests: true },
      orderBy: { completed_at: 'desc' }
    });
    return c.json(ApiResponse.ok(results));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
