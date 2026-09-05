import cron from 'node-cron';
import prisma from '../config/prisma';

export const startJobExpiryScheduler = () => {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      console.log(`>>> JobExpiryScheduler: Checking for jobs past their expiry date at ${now}...`);

      const expiredJobs = await prisma.jobs.findMany({
        where: {
          status: 'OPEN',
          expires_at: {
            lt: now,
            not: null
          }
        }
      });

      if (expiredJobs.length > 0) {
        console.log(`>>> JobExpiryScheduler: Found ${expiredJobs.length} expired jobs. Closing them...`);
        for (const job of expiredJobs) {
          await prisma.jobs.update({
            where: { id: job.id },
            data: { status: 'CLOSED', updated_at: new Date() }
          });

          await prisma.job_search_index.updateMany({
             where: { job_id: job.id },
             data: { status: 'CLOSED', last_updated_at: new Date() }
          });

          console.log(`>>> JobExpiryScheduler: Job '${job.title}' (ID: ${job.id}) expired — status set to CLOSED.`);
        }
      }
    } catch (error) {
      console.error(">>> JobExpiryScheduler: Error running scheduler:", error);
    }
  });
};
