import { BaseJobSourceAdapter } from './baseAdapter';
import {
  AdapterDiscoveryResult,
  DiscoveredEmployerLead,
  DiscoveredLeadRequirement,
  DiscoveryOptions,
  SourceStatus,
  SourceType,
} from '../types';
import { UrlSecurityValidator } from '../urlSecurityValidator';

interface GreenhouseTargetCompany {
  token: string;
  name: string;
  website: string;
  defaultCategory: string;
}

export class GreenhouseAtsAdapter extends BaseJobSourceAdapter {
  id = 'greenhouse-ats';
  name = 'Greenhouse Public Board API';
  type: SourceType = 'API_FEED';
  status: SourceStatus = 'ACTIVE';
  complianceNote =
    'Uses Greenhouse public board API (boards-api.greenhouse.io/v1/boards/:token/jobs). Official public distribution endpoint for career postings.';

  private readonly targets: GreenhouseTargetCompany[] = [
    {
      token: 'deliveroo',
      name: 'Deliveroo Logistics & Delivery',
      website: 'https://deliveroo.com',
      defaultCategory: 'Logistics & Delivery',
    },
    {
      token: 'porter',
      name: 'Porter Enterprise Operations',
      website: 'https://porter.in',
      defaultCategory: 'Logistics & Delivery',
    },
  ];

  canHandleUrl(url: URL): boolean {
    const host = url.hostname.toLowerCase();
    return host === 'greenhouse.io' || host.endsWith('.greenhouse.io');
  }

  async discoverJobs(options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    const startTime = Date.now();
    const leads: DiscoveredEmployerLead[] = [];
    let scannedCount = 0;
    let discoveredCount = 0;
    const errors: string[] = [];

    for (const target of this.targets) {
      scannedCount++;
      const feedUrl = `https://boards-api.greenhouse.io/v1/boards/${target.token}/jobs?content=true`;

      try {
        const response = await UrlSecurityValidator.safeFetch(feedUrl, {
          timeoutMs: 6000,
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          errors.push(`${target.name} returned HTTP ${response.status}`);
          continue;
        }

        const data: any = JSON.parse(response.body);
        const jobsList: any[] = data.jobs || [];

        const relevantRequirements: DiscoveredLeadRequirement[] = [];

        for (const item of jobsList) {
          const title = this.decodeHtmlEntities(item.title || 'Opening');
          const locationName = item.location?.name || '';
          const plainDesc = this.stripHtml(item.content || '');

          const detectedCity = this.extractCity(locationName) || this.extractCity(title) || null;
          if (options?.city && detectedCity && detectedCity.toLowerCase() !== options.city.toLowerCase()) {
            continue;
          }

          relevantRequirements.push({
            title,
            category: this.categorizeRole(title),
            description: plainDesc.substring(0, 500) || undefined,
            city: detectedCity,
            location: locationName || null,
            workersNeeded: null,
            salaryRange: null,
            sourceName: `${target.name} (Greenhouse)`,
            sourceUrl: item.absolute_url || feedUrl,
            externalListingId: item.id ? `gh_${item.id}` : undefined,
            datePosted: item.updated_at ? new Date(item.updated_at) : undefined,
          });
        }

        if (relevantRequirements.length > 0) {
          discoveredCount += relevantRequirements.length;
          leads.push({
            companyName: target.name,
            companyWebsite: target.website,
            companyDomain: UrlSecurityValidator.validateUrl(target.website).parsedUrl?.hostname.replace(/^www\./, '') || null,
            industry: target.defaultCategory,
            city: relevantRequirements[0].city || null,
            contactPageUrl: `${target.website}/careers`,
            requirements: relevantRequirements,
          });
        }
      } catch (err: any) {
        errors.push(`Error fetching ${target.name}: ${err.message}`);
      }
    }

    const durationMs = Date.now() - startTime;
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: leads.length > 0 ? 'SUCCESS' : errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
      leads,
      discoveredCount,
      scannedCount,
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
      complianceNote: this.complianceNote,
      durationMs,
    };
  }

  async parseJobPage(url: string): Promise<DiscoveredEmployerLead | null> {
    try {
      const parsed = new URL(url);
      const jobId = parsed.searchParams.get('gh_jid') || parsed.pathname.split('/').filter(Boolean).pop();
      if (!jobId) return null;

      // Extract board token from subdomain or path
      let boardToken = parsed.hostname.split('.')[0];
      if (boardToken === 'boards' || boardToken === 'job-boards') {
        boardToken = parsed.pathname.split('/')[1] || '';
      }

      if (!boardToken) return null;

      const apiUrl = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs/${jobId}`;
      const res = await UrlSecurityValidator.safeFetch(apiUrl);
      if (res.ok) {
        const item = JSON.parse(res.body);
        const title = this.decodeHtmlEntities(item.title || 'Job Opening');
        const location = item.location?.name || '';
        const city = this.extractCity(location) || null;
        const desc = this.stripHtml(item.content || '');

        return {
          companyName: boardToken.charAt(0).toUpperCase() + boardToken.slice(1),
          companyWebsite: `https://${boardToken}.com`,
          industry: this.categorizeRole(title),
          city,
          contactPageUrl: url,
          requirements: [
            {
              title,
              category: this.categorizeRole(title),
              description: desc.substring(0, 500) || undefined,
              city,
              location,
              workersNeeded: null,
              salaryRange: null,
              sourceName: `Greenhouse (${boardToken})`,
              sourceUrl: item.absolute_url || url,
              externalListingId: `gh_${item.id || jobId}`,
              datePosted: item.updated_at ? new Date(item.updated_at) : undefined,
            },
          ],
        };
      }
    } catch {
      // Fallback
    }
    return null;
  }
}
