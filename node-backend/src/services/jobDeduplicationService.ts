import crypto from 'crypto';
import prisma from '../config/prisma';
import type { RawExternalJob } from './jobQualityGate';

export interface DeduplicationResult {
  isDuplicate: boolean;
  jobId?: string;
  sourceHash: string;
  merged?: boolean;
}

export class JobDeduplicationService {
  /**
   * Normalizes company name by stripping common corporate suffixes and punctuation.
   */
  static normalizeCompany(companyName: string): string {
    return companyName
      .toLowerCase()
      .replace(/\b(pvt\.?|private|ltd\.?|limited|llc|corp\.?|corporation|inc\.?|services|technologies|solutions)\b/gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  /**
   * Normalizes title by removing noisy recruiter buzzwords.
   */
  static normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/\b(urgently\s+hiring|urgent|immediate\s+joiner|immediate|walk-in|walkin|wanted|required|fresher|experienced)\b/gi, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Categorizes salary into standard compensation brackets.
   */
  static getSalaryBracket(minSalary?: number, maxSalary?: number): string {
    const avg = (minSalary || 0) > 0 && (maxSalary || 0) > 0 
      ? (minSalary! + maxSalary!) / 2 
      : (minSalary || maxSalary || 0);

    if (avg <= 0) return 'unspecified';
    if (avg < 15000) return 'under-15k';
    if (avg <= 25000) return '15k-25k';
    if (avg <= 40000) return '25k-40k';
    if (avg <= 60000) return '40k-60k';
    return '60k-plus';
  }

  /**
   * Computes a deterministic SHA-256 identity hash for cross-portal deduplication.
   */
  static computeSourceHash(job: RawExternalJob): string {
    const comp = this.normalizeCompany(job.companyName);
    const title = this.normalizeTitle(job.title);
    const city = (job.city || '').toLowerCase().trim();
    const bracket = this.getSalaryBracket(job.salaryMin, job.salaryMax);

    const payload = `${comp}:${title}:${city}:${bracket}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Checks if a job already exists under this signature.
   * If found, merges the new source attribution into alternate_sources instead of creating a duplicate card.
   */
  static async checkAndMerge(job: RawExternalJob, sourceHash: string): Promise<DeduplicationResult> {
    const existing = await prisma.jobs.findFirst({
      where: {
        source_hash: sourceHash,
        status: { in: ['OPEN', 'EXPIRED'] }
      }
    });

    if (!existing) {
      return { isDuplicate: false, sourceHash };
    }

    // Merge new source into alternate_sources array
    let currentSources: Array<{ sourceName: string; sourceUrl: string; dateSeen: string }> = [];
    if (Array.isArray(existing.alternate_sources)) {
      currentSources = existing.alternate_sources as any;
    }

    const alreadyHasSource = currentSources.some(
      (s) => s.sourceName.toLowerCase() === job.sourceName.toLowerCase() || s.sourceUrl === job.sourceUrl
    );

    if (!alreadyHasSource) {
      currentSources.push({
        sourceName: job.sourceName,
        sourceUrl: job.sourceUrl,
        dateSeen: new Date().toISOString(),
      });
    }

    // Refresh last verified and ensure status is open if re-seen recently
    await prisma.jobs.update({
      where: { id: existing.id },
      data: {
        last_verified_at: new Date(),
        status: 'OPEN',
        alternate_sources: currentSources as any,
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Refresh 14-day TTL
      }
    });

    return {
      isDuplicate: true,
      jobId: existing.id,
      sourceHash,
      merged: true
    };
  }
}
