/**
 * Quality Gate & Validation Engine for External Job Ingestion
 * Enforces enterprise standards: rejects dummy records, stale jobs (>7 days old),
 * invalid URLs, and placeholder company names.
 */

export interface RawExternalJob {
  title: string;
  companyName: string;
  companyWebsite?: string;
  city: string;
  location?: string;
  category?: string;
  industry?: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryRange?: string;
  sourceName: string;
  sourceUrl: string;
  datePosted?: Date | string | null;
  experienceYears?: number;
}

export interface QualityValidationResult {
  isValid: boolean;
  reason?: string;
  normalizedJob?: RawExternalJob;
}

// Banned generic/dummy company patterns that spam aggregators
const BANNED_COMPANY_PATTERNS = [
  /^confidential$/i,
  /^hiring$/i,
  /^hiring\s+company$/i,
  /^employer$/i,
  /^direct\s+employer$/i,
  /^urgent\s+hiring$/i,
  /^immediate\s+requirement$/i,
  /^consultancy$/i,
  /^placement\s+agency$/i,
  /^unknown$/i,
  /^various\s+clients$/i,
  /^local\s+business$/i,
  /^test\s+company$/i,
  /^dummy$/i,
];

// Banned placeholder titles
const BANNED_TITLE_PATTERNS = [
  /lorem\s+ipsum/i,
  /^test(\s+job)?$/i,
  /^sample(\s+job)?$/i,
  /^urgent\s+requirement$/i,
  /^job\s+opening$/i,
  /^various\s+positions$/i,
];

// Major Indian cities and hub validation
const KNOWN_INDIAN_METROS = [
  'chennai',
  'coimbatore',
  'madurai',
  'trichy',
  'salem',
  'bengaluru',
  'bangalore',
  'mysuru',
  'hyderabad',
  'visakhapatnam',
  'mumbai',
  'pune',
  'delhi',
  'noida',
  'gurugram',
  'kolkata',
  'ahmedabad',
  'kochi',
  'thiruvananthapuram',
  'chandigarh',
  'jaipur',
  'lucknow',
];

export class JobQualityGate {
  /**
   * Evaluates a candidate external job against enterprise completeness and freshness standards.
   */
  static validate(job: RawExternalJob): QualityValidationResult {
    // 1. Title Validation
    const cleanTitle = (job.title || '').trim();
    if (!cleanTitle || cleanTitle.length < 3) {
      return { isValid: false, reason: 'Job title is too short or missing' };
    }
    for (const pattern of BANNED_TITLE_PATTERNS) {
      if (pattern.test(cleanTitle)) {
        return { isValid: false, reason: `Job title matches dummy pattern: "${cleanTitle}"` };
      }
    }

    // 2. Company Name Validation
    const cleanCompany = (job.companyName || '').trim();
    if (!cleanCompany || cleanCompany.length < 2) {
      return { isValid: false, reason: 'Company name is too short or missing' };
    }
    for (const pattern of BANNED_COMPANY_PATTERNS) {
      if (pattern.test(cleanCompany)) {
        return { isValid: false, reason: `Company name is generic/dummy: "${cleanCompany}"` };
      }
    }

    // 3. Location & City Validation
    const rawCity = (job.city || '').trim().toLowerCase();
    if (!rawCity || rawCity === 'local area' || rawCity === 'n/a' || rawCity === 'anywhere') {
      return { isValid: false, reason: 'City is generic, invalid or missing' };
    }

    // Match or normalize known city
    let resolvedCity = job.city.trim();
    const matchedMetro = KNOWN_INDIAN_METROS.find((m) => rawCity.includes(m));
    if (matchedMetro) {
      resolvedCity = matchedMetro.charAt(0).toUpperCase() + matchedMetro.slice(1);
      if (resolvedCity.toLowerCase() === 'bangalore') resolvedCity = 'Bengaluru';
    }

    // 4. Source URL Validation
    const rawUrl = (job.sourceUrl || '').trim();
    if (!rawUrl || (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://'))) {
      return { isValid: false, reason: 'Invalid or missing source URL' };
    }

    try {
      new URL(rawUrl);
    } catch {
      return { isValid: false, reason: 'Malformed source URL' };
    }

    // 5. Freshness Check: Enforce strict recency (Job must be posted within the last 7 days)
    if (job.datePosted) {
      const postedTime = new Date(job.datePosted).getTime();
      if (!isNaN(postedTime)) {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (postedTime < sevenDaysAgo) {
          return {
            isValid: false,
            reason: `Job is stale: posted on ${new Date(postedTime).toISOString().slice(0, 10)} (older than 7 days)`,
          };
        }
      }
    }

    // 6. Return normalized and validated job
    return {
      isValid: true,
      normalizedJob: {
        ...job,
        title: cleanTitle,
        companyName: cleanCompany,
        city: resolvedCity,
        location: (job.location || resolvedCity).trim(),
        sourceUrl: rawUrl,
        datePosted: job.datePosted ? new Date(job.datePosted) : new Date(),
      },
    };
  }
}
