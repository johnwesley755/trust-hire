import { Context } from 'hono';
import prisma from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

const getSalaryRange = (level: number) => {
    switch (level) {
        case 1: return "₹8,000 - ₹12,000";
        case 2: return "₹12,000 - ₹18,000";
        case 3: return "₹18,000 - ₹25,000";
        case 4: return "₹25,000+";
        default: return "N/A";
    }
};

const calculateProgress = (levelNumber: number, score: number) => {
    if (levelNumber === 4) return 100.0;

    let min = levelNumber === 1 ? 0 : (levelNumber === 2 ? 41 : 66);
    let max = levelNumber === 1 ? 40 : (levelNumber === 2 ? 65 : 85);

    return ((score - min) / (max - min)) * 100;
};

export const getLevelDetails = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    const worker = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!worker) return c.json(ApiResponse.error("Worker not found"), 404 as any);

    const levelNumber = worker.level_number || 1;
    const levelScore = worker.level_score || 0;

    return c.json(ApiResponse.ok({
      workerId: userId,
      currentLevel: levelNumber,
      levelScore: Math.floor(levelScore),
      components: {
        skillScore: Math.floor(worker.skill_score || 0),
        experienceScore: Math.floor(worker.experience_score || 0),
        performanceScore: Math.floor(worker.performance_score || 0),
        reliabilityScore: Math.floor(worker.reliability_score || 0)
      },
      nextLevel: levelNumber < 4 ? levelNumber + 1 : 4,
      salaryRange: getSalaryRange(levelNumber)
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};

export const getLevelProgress = async (c: Context) => {
  try {
    const userId = c.req.param('userId') as string;
    const worker = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!worker) return c.json(ApiResponse.error("Worker not found"), 404 as any);

    const levelNumber = worker.level_number || 1;
    const levelScore = worker.level_score || 0;

    return c.json(ApiResponse.ok({
      currentLevel: levelNumber,
      levelScore: Math.floor(levelScore),
      nextLevel: levelNumber < 4 ? levelNumber + 1 : 4,
      progress: calculateProgress(levelNumber, levelScore)
    }));
  } catch (err: any) {
    return c.json(ApiResponse.error(err.message), 500 as any);
  }
};
