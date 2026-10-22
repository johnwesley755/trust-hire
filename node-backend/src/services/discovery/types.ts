export type SourceType =
  | 'API_FEED'
  | 'CAREER_PAGE_JSONLD'
  | 'PARTNER_PORTAL'
  | 'FEED_CONNECTOR';

export type SourceStatus =
  | 'ACTIVE'
  | 'REQUIRES_PARTNER_CREDENTIALS'
  | 'BOT_WALL_RESTRICTED'
  | 'DISABLED';

export interface NormalizedSalary {
  min?: number;
  max?: number;
  currency?: string;
  period?: 'MONTH' | 'YEAR' | 'DAY' | 'HOUR' | 'COMPETITIVE';
  formatted?: string;
}

export interface DiscoveredLeadRequirement {
  title: string;
  category?: string;
  description?: string;
  city?: string | null;
  location?: string | null;
  workersNeeded?: number | null; // Nullable - never fabricated!
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: 'MONTH' | 'YEAR' | 'DAY' | 'HOUR' | 'COMPETITIVE';
  salaryRange?: string | null; // Nullable - only formatted if source provided salary
  sourceName: string;
  sourceUrl: string;
  externalListingId?: string;
  datePosted?: Date;
  expiresAt?: Date;
}

export interface DiscoveredEmployerLead {
  companyName: string;
  normalizedName?: string;
  companyWebsite?: string | null;
  companyDomain?: string | null;
  industry?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  officialEmail?: string | null;
  officialPhone?: string | null;
  contactPageUrl?: string | null;
  requirements: DiscoveredLeadRequirement[];
}

export interface DiscoveryOptions {
  city?: string;
  category?: string;
  limit?: number;
}

export interface AdapterDiscoveryResult {
  sourceId: string;
  sourceName: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'RESTRICTED';
  leads: DiscoveredEmployerLead[];
  discoveredCount: number;
  scannedCount: number;
  errorMessage?: string;
  complianceNote?: string;
  durationMs: number;
}

export interface JobSourceAdapter {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  complianceNote: string;
  canHandleUrl(url: URL): boolean;
  discoverJobs(options?: DiscoveryOptions): Promise<AdapterDiscoveryResult>;
  parseJobPage?(url: string, html?: string): Promise<DiscoveredEmployerLead | null>;
}

export interface DiscoveryRunMetrics {
  sourcesRequested: number;
  sourcesAttempted: number;
  sourcesCompleted: number;
  sourcesFailed: number;
  totalScanned: number;
  newLeadsCount: number;
  updatedLeadsCount: number;
  duplicatesIgnored: number;
  rejectedCount: number;
  requirementsDiscovered: number;
  durationMs: number;
  startedAt: string;
  finishedAt: string;
  sourceBreakdown: Array<{
    sourceId: string;
    sourceName: string;
    status: string;
    leadsFound: number;
    requirementsFound: number;
    error?: string;
  }>;
}
