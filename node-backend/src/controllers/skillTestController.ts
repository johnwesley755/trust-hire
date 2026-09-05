import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';
import { v4 as uuidv4 } from 'uuid';

export const getAvailableTests = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let tests;
    if (category) {
       tests = await prisma.skill_tests.findMany({ where: { category: category as string } });
    } else {
       tests = await prisma.skill_tests.findMany();
    }
    res.json(ApiResponse.ok(tests));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const test = await prisma.skill_tests.findUnique({
      where: { id },
      include: { skill_test_questions: true }
    });
    if (!test) return res.status(404).json(ApiResponse.error("Test not found"));
    res.json(ApiResponse.ok(test));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const submitResult = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json(ApiResponse.error("Unauthorized"));

    const testId = req.params.id || req.body.testId;
    const { answers } = req.body;

    const test = await prisma.skill_tests.findUnique({
      where: { id: testId },
      include: { skill_test_questions: true }
    });

    if (!test) return res.status(404).json(ApiResponse.error("Test not found"));

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

    res.json(ApiResponse.ok("Test submitted", result));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getWorkerResults = async (req: Request, res: Response) => {
  try {
    const workerId = String(req.params.workerId);
    const results = await prisma.skill_test_results.findMany({
      where: { worker_id: workerId },
      include: { skill_tests: true },
      orderBy: { completed_at: 'desc' }
    });
    res.json(ApiResponse.ok(results));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
