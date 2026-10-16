import prisma from '../config/prisma';
import { v4 as uuidv4 } from 'uuid';
import { NotificationDispatcher } from './notificationDispatcher';

export interface CreateSearchAlertInput {
  userId: string;
  alertType?: 'JOB_ALERT' | 'CANDIDATE_ALERT';
  title?: string;
  query?: string;
  city?: string;
  category?: string;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  frequency?: 'INSTANT' | 'DAILY';
}

export class SearchAlertService {
  /**
   * Creates a new user search alert (candidate job alert or employer talent alert).
   */
  public static async createAlert(input: CreateSearchAlertInput) {
    const alertType = input.alertType || 'JOB_ALERT';
    
    // Auto-generate title if not provided
    const labelParts: string[] = [];
    if (input.query) labelParts.push(`"${input.query}"`);
    if (input.category && input.category !== 'All') labelParts.push(input.category);
    if (input.city) labelParts.push(`in ${input.city}`);
    const generatedTitle = input.title || (labelParts.length > 0 ? labelParts.join(' ') : (alertType === 'JOB_ALERT' ? 'All New Jobs' : 'All New Candidates'));

    const alertId = uuidv4();
    const query = input.query?.trim() || null;
    const city = input.city?.trim() || null;
    const category = (input.category && input.category !== 'All') ? input.category.trim() : null;
    const minSalary = input.minSalary ? Number(input.minSalary) : null;
    const maxSalary = input.maxSalary ? Number(input.maxSalary) : null;
    const experience = (input.experience && input.experience !== 'all') ? input.experience.trim() : null;
    const frequency = input.frequency || 'INSTANT';

    try {
      if ((prisma as any).user_search_alerts) {
        return await (prisma as any).user_search_alerts.create({
          data: {
            id: alertId,
            user_id: input.userId,
            alert_type: alertType,
            title: generatedTitle,
            query,
            city,
            category,
            min_salary: minSalary,
            max_salary: maxSalary,
            experience,
            frequency,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        });
      } else {
        const rows = await prisma.$queryRaw<any[]>`
          INSERT INTO user_search_alerts (
            id, user_id, alert_type, title, query, city, category, min_salary, max_salary, experience, frequency, is_active, created_at, updated_at
          ) VALUES (
            ${alertId}::uuid, ${input.userId}, ${alertType}, ${generatedTitle}, ${query}, ${city}, ${category}, ${minSalary}, ${maxSalary}, ${experience}, ${frequency}, true, NOW(), NOW()
          ) RETURNING *
        `;
        return rows[0];
      }
    } catch (err: any) {
      console.error('[SearchAlertService] Error creating search alert:', err.message);
      throw err;
    }
  }

  /**
   * Retrieves active search alerts for a user.
   */
  public static async getUserAlerts(userId: string, alertType?: string) {
    try {
      if ((prisma as any).user_search_alerts) {
        return await (prisma as any).user_search_alerts.findMany({
          where: {
            user_id: userId,
            ...(alertType ? { alert_type: alertType } : {})
          },
          orderBy: { created_at: 'desc' }
        });
      } else {
        if (alertType) {
          return await prisma.$queryRaw<any[]>`
            SELECT * FROM user_search_alerts 
            WHERE user_id = ${userId} AND alert_type = ${alertType}
            ORDER BY created_at DESC
          `;
        }
        return await prisma.$queryRaw<any[]>`
          SELECT * FROM user_search_alerts 
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;
      }
    } catch (err: any) {
      console.error('[SearchAlertService] Error fetching user alerts:', err.message);
      return [];
    }
  }

  /**
   * Toggles the active/paused state of a search alert.
   */
  public static async toggleAlert(alertId: string, userId: string, isActive: boolean) {
    try {
      if ((prisma as any).user_search_alerts) {
        return await (prisma as any).user_search_alerts.updateMany({
          where: { id: alertId, user_id: userId },
          data: { is_active: isActive, updated_at: new Date() }
        });
      } else {
        return await prisma.$executeRaw`
          UPDATE user_search_alerts 
          SET is_active = ${isActive}, updated_at = NOW() 
          WHERE id = ${alertId}::uuid AND user_id = ${userId}
        `;
      }
    } catch (err: any) {
      console.error('[SearchAlertService] Error toggling alert:', err.message);
      throw err;
    }
  }

  /**
   * Deletes a search alert.
   */
  public static async deleteAlert(alertId: string, userId: string) {
    try {
      if ((prisma as any).user_search_alerts) {
        return await (prisma as any).user_search_alerts.deleteMany({
          where: { id: alertId, user_id: userId }
        });
      } else {
        return await prisma.$executeRaw`
          DELETE FROM user_search_alerts 
          WHERE id = ${alertId}::uuid AND user_id = ${userId}
        `;
      }
    } catch (err: any) {
      console.error('[SearchAlertService] Error deleting alert:', err.message);
      throw err;
    }
  }

  /**
   * REVERSE SEARCH MATCHING ENGINE FOR NEW JOBS (Indeed / Naukri Job Alerts Model)
   * Evaluates a newly posted job against registered candidate search alerts.
   * Dispatches push + in-app notification only to matching candidates whose cooldown has elapsed.
   */
  public static async matchNewJobAgainstAlerts(job: {
    id: string;
    title: string;
    description?: string | null;
    industry?: string | null;
    city?: string | null;
    budget?: number | string | null;
    employer_id: string;
    required_skills?: string | null;
    experience_years_required?: number | null;
  }) {
    try {
      const jobCity = (job.city || '').trim().toLowerCase();
      const jobIndustry = (job.industry || '').trim().toLowerCase();
      const jobBudget = job.budget ? Number(job.budget) : 0;
      const jobTitle = (job.title || '').toLowerCase();
      const jobDesc = (job.description || '').toLowerCase();
      const jobSkills = (job.required_skills || '').toLowerCase();

      // Retrieve all active JOB_ALERT subscriptions where cooldown has expired (6 hours)
      // or last_notified_at IS NULL, excluding the job's employer.
      const candidateAlerts = await prisma.$queryRaw<any[]>`
        SELECT id, user_id, title, query, city, category, min_salary, max_salary, experience
        FROM user_search_alerts
        WHERE is_active = true
          AND alert_type = 'JOB_ALERT'
          AND user_id != ${job.employer_id}
          AND (last_notified_at IS NULL OR last_notified_at < NOW() - INTERVAL '6 hours')
      `;

      if (!candidateAlerts || candidateAlerts.length === 0) {
        return;
      }

      const matchedAlertIds: string[] = [];
      const notificationsToSend: { userId: string; alertTitle: string }[] = [];

      for (const alert of candidateAlerts) {
        // 1. City constraint check
        if (alert.city && alert.city.trim() !== '') {
          const alertCity = alert.city.trim().toLowerCase();
          if (jobCity && !jobCity.includes(alertCity) && !alertCity.includes(jobCity)) {
            continue;
          }
        }

        // 2. Industry / Category constraint check
        if (alert.category && alert.category.trim() !== '' && alert.category.toLowerCase() !== 'all') {
          const alertCategory = alert.category.trim().toLowerCase();
          if (jobIndustry && !jobIndustry.includes(alertCategory) && !alertCategory.includes(jobIndustry)) {
            continue;
          }
        }

        // 3. Minimum Salary threshold check
        if (alert.min_salary) {
          const minRequired = Number(alert.min_salary);
          if (jobBudget > 0 && jobBudget < minRequired) {
            continue;
          }
        }

        // 4. Keyword Query match check
        if (alert.query && alert.query.trim() !== '') {
          const q = alert.query.trim().toLowerCase();
          const matchesKeyword = 
            jobTitle.includes(q) || 
            jobDesc.includes(q) || 
            jobSkills.includes(q) ||
            jobIndustry.includes(q);
          if (!matchesKeyword) {
            continue;
          }
        }

        // Passed all search intent filters!
        matchedAlertIds.push(alert.id);
        notificationsToSend.push({
          userId: alert.user_id,
          alertTitle: alert.title || job.title
        });
      }

      if (notificationsToSend.length === 0) {
        return;
      }

      console.log(`[SearchAlertService] Reverse matching found ${notificationsToSend.length} candidate alert(s) for job "${job.title}".`);

      // Dispatch notifications to each matched candidate
      await Promise.allSettled(
        notificationsToSend.map(({ userId }) =>
          NotificationDispatcher.dispatch({
            userId,
            title: `Job Alert: ${job.title}`,
            message: `A new role in ${job.city || 'your area'} offering ₹${job.budget || 'Competitive'} matches your saved search alert. Tap to view and apply.`,
            type: 'JOB_MATCH_ALERT',
            link: `/search?jobId=${job.id}`,
            data: {
              jobId: String(job.id),
              city: String(job.city || '')
            }
          })
        )
      );

      // Update cooldown timestamp and increment match count for matched alerts
      if (matchedAlertIds.length > 0) {
        await prisma.$executeRaw`
          UPDATE user_search_alerts
          SET last_notified_at = NOW(),
              match_count = match_count + 1,
              updated_at = NOW()
          WHERE id IN (${matchedAlertIds.join("','")}::uuid)
        `.catch(err => {
          // If bulk cast fails, fallback to individual updates
          for (const id of matchedAlertIds) {
            prisma.$executeRaw`
              UPDATE user_search_alerts
              SET last_notified_at = NOW(), match_count = match_count + 1, updated_at = NOW()
              WHERE id = ${id}::uuid
            `.catch(() => {});
          }
        });
      }
    } catch (err: any) {
      console.warn('[SearchAlertService] Error during job reverse match evaluation:', err.message);
    }
  }

  /**
   * REVERSE SEARCH MATCHING ENGINE FOR NEW/AVAILABLE CANDIDATES (Naukri Resdex Model)
   * Evaluates a newly registered or available verified worker against employer candidate alerts.
   */
  public static async matchNewCandidateAgainstAlerts(worker: {
    user_id: string;
    full_name?: string | null;
    skills?: string | null;
    city?: string | null;
    experience_years?: number | null;
    is_available?: boolean | null;
  }) {
    try {
      if (worker.is_available === false) return;

      const workerCity = (worker.city || '').trim().toLowerCase();
      const workerSkills = (worker.skills || '').toLowerCase();
      const workerName = worker.full_name || 'Verified Specialist';

      // Retrieve all active CANDIDATE_ALERT subscriptions where cooldown has expired (6 hours)
      const employerAlerts = await prisma.$queryRaw<any[]>`
        SELECT id, user_id, title, query, city, category, experience
        FROM user_search_alerts
        WHERE is_active = true
          AND alert_type = 'CANDIDATE_ALERT'
          AND user_id != ${worker.user_id}
          AND (last_notified_at IS NULL OR last_notified_at < NOW() - INTERVAL '6 hours')
      `;

      if (!employerAlerts || employerAlerts.length === 0) {
        return;
      }

      const matchedAlertIds: string[] = [];
      const notificationsToSend: { userId: string }[] = [];

      for (const alert of employerAlerts) {
        // 1. City constraint check
        if (alert.city && alert.city.trim() !== '') {
          const alertCity = alert.city.trim().toLowerCase();
          if (workerCity && !workerCity.includes(alertCity) && !alertCity.includes(workerCity)) {
            continue;
          }
        }

        // 2. Trade/Category or Skills constraint check
        if (alert.category && alert.category.trim() !== '' && alert.category.toLowerCase() !== 'all') {
          const alertTrade = alert.category.trim().toLowerCase();
          if (workerSkills && !workerSkills.includes(alertTrade)) {
            continue;
          }
        }

        // 3. Keyword Query check
        if (alert.query && alert.query.trim() !== '') {
          const q = alert.query.trim().toLowerCase();
          const matchesKeyword = workerSkills.includes(q) || workerName.toLowerCase().includes(q);
          if (!matchesKeyword) {
            continue;
          }
        }

        matchedAlertIds.push(alert.id);
        notificationsToSend.push({ userId: alert.user_id });
      }

      if (notificationsToSend.length === 0) {
        return;
      }

      console.log(`[SearchAlertService] Reverse matching found ${notificationsToSend.length} employer alert(s) for candidate "${workerName}".`);

      await Promise.allSettled(
        notificationsToSend.map(({ userId }) =>
          NotificationDispatcher.dispatch({
            userId,
            title: `Candidate Alert: ${workerName}`,
            message: `A verified specialist with skills in "${worker.skills || 'your trade'}" in ${worker.city || 'your area'} is now available. Tap to view profile.`,
            type: 'CANDIDATE_MATCH_ALERT',
            link: `/search/workers?workerId=${worker.user_id}`,
            data: {
              workerId: String(worker.user_id),
              city: String(worker.city || '')
            }
          })
        )
      );

      if (matchedAlertIds.length > 0) {
        for (const id of matchedAlertIds) {
          prisma.$executeRaw`
            UPDATE user_search_alerts
            SET last_notified_at = NOW(), match_count = match_count + 1, updated_at = NOW()
            WHERE id = ${id}::uuid
          `.catch(() => {});
        }
      }
    } catch (err: any) {
      console.warn('[SearchAlertService] Error during candidate reverse match evaluation:', err.message);
    }
  }
}
