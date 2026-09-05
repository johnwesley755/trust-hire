import { Request, Response } from 'express';
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

export const getLevelDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const worker = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!worker) return res.status(404).json(ApiResponse.error("Worker not found"));

    const levelNumber = worker.level_number || 1;
    const levelScore = worker.level_score || 0;

    res.json(ApiResponse.ok({
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
    res.status(500).json(ApiResponse.error(err.message));
  }
};

export const getLevelProgress = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const worker = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!worker) return res.status(404).json(ApiResponse.error("Worker not found"));

    const levelNumber = worker.level_number || 1;
    const levelScore = worker.level_score || 0;

    res.json(ApiResponse.ok({
      currentLevel: levelNumber,
      levelScore: Math.floor(levelScore),
      nextLevel: levelNumber < 4 ? levelNumber + 1 : 4,
      progress: calculateProgress(levelNumber, levelScore)
    }));
  } catch (err: any) {
    res.status(500).json(ApiResponse.error(err.message));
  }
};
