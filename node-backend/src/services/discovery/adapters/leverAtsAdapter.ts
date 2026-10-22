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

interface LeverTargetCompany {
  slug: string;
  name: string;
  website: string;
  defaultCategory: string;
}

export class LeverAtsAdapter extends BaseJobSourceAdapter {
  id = 'lever-ats';
  name = 'Lever Enterprise ATS Feeds';
  type: SourceType = 'API_FEED';
  status: SourceStatus = 'ACTIVE';
  complianceNote =
    'Uses Lever official unauthenticated public JSON API (api.lever.co/v0/postings/:slug?mode=json). Standard public syndication feed for enterprise career listings.';

  private readonly targets: LeverTargetCompany[] = [
    {
      slug: 'meesho',
      name: 'Meesho E-Commerce & Logistics',
      website: 'https://www.meesho.com',
      defaultCategory: 'Logistics & Warehouse',
    },
    {
      slug: 'porter',
      name: 'Porter Logistics Network',
      website: 'https://porter.in',
      defaultCategory: 'Logistics & Delivery',
    },
    {
      slug: 'paytm',
      name: 'Paytm Field Operations',
      website: 'https://paytm.com',
      defaultCategory: 'Field Sales & Operations',
    },
  ];

  canHandleUrl(url: URL): boolean {
    const host = url.hostname.toLowerCase();
    return host === 'jobs.lever.co' || host === 'api.lever.co';
  }

  async discoverJobs(options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    const startTime = Date.now();
    const leads: DiscoveredEmployerLead[] = [];
    let scannedCount = 0;
    let discoveredCount = 0;
    const errors: string[] = [];

    for (const target of this.targets) {
      scannedCount++;
      const feedUrl = `https://api.lever.co/v0/postings/${target.slug}?mode=json`;

      try {
        const response = await UrlSecurityValidator.safeFetch(feedUrl, {
          timeoutMs: 6000,
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          errors.push(`${target.name} returned HTTP ${response.status}`);
          continue;
        }

        const postings: any[] = JSON.parse(response.body);
        if (!Array.isArray(postings)) continue;

        const relevantRequirements: DiscoveredLeadRequirement[] = [];

        for (const item of postings) {
          const title = this.decodeHtmlEntities(item.text || 'Operational Specialist');
          const location = item.categories?.location || '';
          const team = item.categories?.team || item.categories?.department || '';
          const plainDesc = this.stripHtml(item.descriptionPlain || item.description || '');

          const fullText = `${title} ${location} ${team} ${plainDesc}`.toLowerCase();

          // Filter for operational, hub, field, trade, delivery, facility, or warehouse roles
          const isOperationalRole =
            fullText.includes('operation') ||
            fullText.includes('fleet') ||
            fullText.includes('delivery') ||
            fullText.includes('hub') ||
            fullText.includes('logistics') ||
            fullText.includes('warehouse') ||
            fullText.includes('facility') ||
            fullText.includes('technician') ||
            fullText.includes('executive') ||
            fullText.includes('lead') ||
            fullText.includes('supervisor') ||
            fullText.includes('associate');

          // City filter if specified
          const detectedCity = this.extractCity(location) || this.extractCity(title) || null;
          if (options?.city && detectedCity && detectedCity.toLowerCase() !== options.city.toLowerCase()) {
            continue;
          }

          if (isOperationalRole) {
            relevantRequirements.push({
              title,
              category: this.categorizeRole(`${title} ${team}`),
              description: plainDesc.substring(0, 500) || undefined,
              city: detectedCity,
              location: location || null,
              workersNeeded: null, // Left as null; not fabricated!
              salaryRange: null, // Left as null unless source provided
              sourceName: `${target.name} (Lever ATS)`,
              sourceUrl: item.hostedUrl || item.applyUrl || feedUrl,
              externalListingId: item.id ? `lever_${item.id}` : undefined,
              datePosted: item.createdAt ? new Date(item.createdAt) : undefined,
            });
          }
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
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      // e.g. /swiggy/d2994d45-566b-4886-...
      if (pathSegments.length >= 2) {
        const companySlug = pathSegments[0];
        const postingId = pathSegments[1];
        const apiUrl = `https://api.lever.co/v0/postings/${companySlug}/${postingId}`;

        const res = await UrlSecurityValidator.safeFetch(apiUrl);
        if (res.ok) {
          const item = JSON.parse(res.body);
          const title = this.decodeHtmlEntities(item.text || 'Job Requisition');
          const location = item.categories?.location || '';
          const city = this.extractCity(location) || null;
          const desc = this.stripHtml(item.descriptionPlain || item.description || '');

          return {
            companyName: companySlug.charAt(0).toUpperCase() + companySlug.slice(1),
            companyWebsite: `https://${companySlug}.com`,
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
                sourceName: `Lever ATS (${companySlug})`,
                sourceUrl: item.hostedUrl || url,
                externalListingId: `lever_${item.id || postingId}`,
                datePosted: item.createdAt ? new Date(item.createdAt) : undefined,
              },
            ],
          };
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }
}
