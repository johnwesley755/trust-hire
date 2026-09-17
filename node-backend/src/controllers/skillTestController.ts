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

    // Defect fix 1.12: Strip correct_option so test takers cannot view answer keys in the network response
    const sanitizedQuestions = test.skill_test_questions.map(q => {
      const { correct_option, ...rest } = q as any;
      return rest;
    });

    return c.json(ApiResponse.ok({
      ...test,
      skill_test_questions: sanitizedQuestions
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const submitResult = async (c: Context) => {
  try {
    const userId = c.get('user')?.sub;
    if (!userId) return c.json(ApiResponse.error("Unauthorized"), 401 as any);

    // Defect fix 14.1: Read request JSON body exactly ONCE to avoid stream lock errors
    const body = await c.req.json().catch(() => ({}));
    const testId = c.req.param('id') || body.testId;
    const answers = body.answers || {};

    if (!testId) {
      return c.json(ApiResponse.error("testId is required"), 400 as any);
    }

    const test = await prisma.skill_tests.findUnique({
      where: { id: testId },
      include: { skill_test_questions: true }
    });

    if (!test) return c.json(ApiResponse.error("Test not found"), 404 as any);

    let score = 0;
    let totalPoints = 0;

    for (const q of test.skill_test_questions) {
      totalPoints += q.points || 1;
      const ans = answers[q.id] !== undefined ? answers[q.id] : answers[test.skill_test_questions.indexOf(q)];
      if (ans !== undefined && Number(ans) === q.correct_option) {
         score += q.points || 1;
      }
    }

    const percentage = totalPoints > 0 ? Math.floor((score / totalPoints) * 100) : 0;
    const passed = percentage >= 70;

    // Defect fix 1.13: Prevent score farming - check if worker already passed this test previously
    const alreadyPassed = await prisma.skill_test_results.findFirst({
      where: {
        worker_id: userId,
        test_id: testId,
        passed: true
      }
    });

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

    // Award score boost only the FIRST time the worker passes this test
    if (passed && !alreadyPassed) {
      await prisma.worker_profiles.updateMany({
        where: { user_id: userId },
        data: {
          skill_score: { increment: 5 },
          level_score: { increment: 15 }
        }
      });
    }

    return c.json(ApiResponse.ok("Test submitted", result));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getWorkerResults = async (c: Context) => {
  try {
    const caller = c.get('user');
    const paramWorkerId = c.req.param('workerId');
    const targetWorkerId = paramWorkerId && paramWorkerId !== 'me' ? paramWorkerId : caller?.sub;

    if (!targetWorkerId) {
      return c.json(ApiResponse.error("workerId is required"), 400 as any);
    }

    // Defect fix 1.14: Protect worker test results from unauthorized snooping
    if (caller && caller.sub !== targetWorkerId && caller.role !== 'ADMIN' && caller.role !== 'EMPLOYER') {
      return c.json(ApiResponse.error("Forbidden: You do not have permission to view these test results"), 403 as any);
    }

    const results = await prisma.skill_test_results.findMany({
      where: { worker_id: targetWorkerId },
      include: { skill_tests: true },
      orderBy: { completed_at: 'desc' }
    });
    return c.json(ApiResponse.ok(results));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
