import prisma from '../config/prisma';

export const recalculateWorkerLevel = async (userId: string) => {
  try {
    const worker = await prisma.worker_profiles.findUnique({ where: { user_id: userId } });
    if (!worker) return;

    // Based on Spring Boot LevelCalculationService logic:
    // (Simplification for migration representation, actual weights could be fetched or customized)
    const experienceScore = (worker.experience_years || 0) * 10;
    const skillScore = worker.skill_score || 0;
    const performanceScore = worker.performance_score || 0;
    const reliabilityScore = worker.reliability_score || 0;

    // Example formula:
    const totalScore = (experienceScore * 0.2) + (skillScore * 0.3) + (performanceScore * 0.3) + (reliabilityScore * 0.2);

    let levelNumber = 1;
    let levelName = "Novice";

    if (totalScore >= 80) {
      levelNumber = 4;
      levelName = "Expert";
    } else if (totalScore >= 60) {
      levelNumber = 3;
      levelName = "Advanced";
    } else if (totalScore >= 40) {
      levelNumber = 2;
      levelName = "Intermediate";
    }

    await prisma.worker_profiles.update({
      where: { user_id: userId },
      data: {
        level_score: totalScore,
        level_number: levelNumber,
        level: levelName,
        experience_score: experienceScore,
        updated_at: new Date()
      }
    });

  } catch (error) {
    console.error("Error recalculating level:", error);
  }
};
