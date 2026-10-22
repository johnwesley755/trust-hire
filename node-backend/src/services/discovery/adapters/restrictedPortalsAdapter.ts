import { BaseJobSourceAdapter } from './baseAdapter';
import {
  AdapterDiscoveryResult,
  DiscoveredEmployerLead,
  DiscoveryOptions,
  SourceStatus,
  SourceType,
} from '../types';

export class NaukriSourceAdapter extends BaseJobSourceAdapter {
  id = 'naukri';
  name = 'Naukri.com Enterprise Gateway';
  type: SourceType = 'PARTNER_PORTAL';
  status: SourceStatus = 'REQUIRES_PARTNER_CREDENTIALS';
  complianceNote =
    'Direct unauthenticated crawling is restricted by Akamai/Cloudflare bot defenses and prohibited by Naukri ToS (Section 3). Ingestion requires official Naukri RMS/eHire Recruiter API credentials.';

  canHandleUrl(url: URL): boolean {
    return url.hostname.toLowerCase().includes('naukri.com');
  }

  async discoverJobs(_options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: 'RESTRICTED',
      leads: [],
      discoveredCount: 0,
      scannedCount: 0,
      complianceNote: this.complianceNote,
      errorMessage:
        'Direct automated scraping is blocked. Please configure NAUKRI_API_KEY in environment to enable authorized partner feed integration.',
      durationMs: 0,
    };
  }

  async parseJobPage(_url: string): Promise<DiscoveredEmployerLead | null> {
    throw new Error(
      'Naukri.com blocks direct automated page requests. Use official recruitment partner feed.'
    );
  }
}

export class IndeedSourceAdapter extends BaseJobSourceAdapter {
  id = 'indeed';
  name = 'Indeed Job Feed Gateway';
  type: SourceType = 'PARTNER_PORTAL';
  status: SourceStatus = 'REQUIRES_PARTNER_CREDENTIALS';
  complianceNote =
    'Direct search page scraping is prohibited by Indeed Terms of Service and Cloudflare protection. Ingestion is supported via authorized Indeed Publisher XML Feeds or Google for Jobs API.';

  canHandleUrl(url: URL): boolean {
    const host = url.hostname.toLowerCase();
    return host === 'indeed.com' || host === 'in.indeed.com' || host.endsWith('.indeed.com');
  }

  async discoverJobs(_options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: 'RESTRICTED',
      leads: [],
      discoveredCount: 0,
      scannedCount: 0,
      complianceNote: this.complianceNote,
      errorMessage:
        'Direct unauthenticated scraping is restricted. Enable via authorized XML feed or RAPIDAPI_KEY / JSearch meta-aggregator.',
      durationMs: 0,
    };
  }

  async parseJobPage(_url: string): Promise<DiscoveredEmployerLead | null> {
    throw new Error(
      'Direct scraping of Indeed listings is restricted. Provide authorized feed or direct career page URL.'
    );
  }
}

export class ApnaSourceAdapter extends BaseJobSourceAdapter {
  id = 'apna';
  name = 'Apna.co Partner Feed';
  type: SourceType = 'PARTNER_PORTAL';
  status: SourceStatus = 'BOT_WALL_RESTRICTED';
  complianceNote =
    'Apna.co utilizes client-side SPA rendering with Datadome bot challenge. Automated scraping without official employer partner feeds is restricted.';

  canHandleUrl(url: URL): boolean {
    return url.hostname.toLowerCase().includes('apna.co');
  }

  async discoverJobs(_options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: 'RESTRICTED',
      leads: [],
      discoveredCount: 0,
      scannedCount: 0,
      complianceNote: this.complianceNote,
      errorMessage:
        'Direct scraping is restricted by Datadome security. Ingestion requires official Apna employer API partner access.',
      durationMs: 0,
    };
  }

  async parseJobPage(_url: string): Promise<DiscoveredEmployerLead | null> {
    throw new Error(
      'Apna.co listings require client-side execution with Datadome challenge. Direct parsing not supported.'
    );
  }
}

export class WorkIndiaSourceAdapter extends BaseJobSourceAdapter {
  id = 'workindia';
  name = 'WorkIndia Verified Feed';
  type: SourceType = 'PARTNER_PORTAL';
  status: SourceStatus = 'BOT_WALL_RESTRICTED';
  complianceNote =
    'WorkIndia search results are protected by Cloudflare bot defense and strict terms prohibiting automated harvesting. Official B2B employer feeds required.';

  canHandleUrl(url: URL): boolean {
    return url.hostname.toLowerCase().includes('workindia.in');
  }

  async discoverJobs(_options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: 'RESTRICTED',
      leads: [],
      discoveredCount: 0,
      scannedCount: 0,
      complianceNote: this.complianceNote,
      errorMessage:
        'WorkIndia blocks unauthenticated automated requests. Use official B2B integration feed.',
      durationMs: 0,
    };
  }

  async parseJobPage(_url: string): Promise<DiscoveredEmployerLead | null> {
    throw new Error(
      'WorkIndia blocks direct scraping requests. Please paste the direct employer career page instead.'
    );
  }
}
