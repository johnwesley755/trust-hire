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
import { ContactEnrichmentService } from '../../contactEnrichmentService';

export class SchemaOrgCareerPageAdapter extends BaseJobSourceAdapter {
  id = 'schema-org-career';
  name = 'Direct Corporate Career Pages (Schema.org / JSON-LD)';
  type: SourceType = 'CAREER_PAGE_JSONLD';
  status: SourceStatus = 'ACTIVE';
  complianceNote =
    'Ingests publicly published Schema.org/JobPosting structured metadata and OpenGraph tags from enterprise career pages without bypassing access controls.';

  canHandleUrl(_url: URL): boolean {
    // Acts as general parser for any direct company web URL
    return true;
  }

  async discoverJobs(_options?: DiscoveryOptions): Promise<AdapterDiscoveryResult> {
    // This adapter primarily powers single URL crawl and deep domain discovery
    return {
      sourceId: this.id,
      sourceName: this.name,
      status: 'SUCCESS',
      leads: [],
      discoveredCount: 0,
      scannedCount: 0,
      complianceNote: this.complianceNote,
      durationMs: 0,
    };
  }

  /**
   * Parses Schema.org JobPosting structured JSON-LD or OpenGraph fallback from any HTML string or fetched URL.
   */
  async parseJobPage(url: string, preloadedHtml?: string): Promise<DiscoveredEmployerLead | null> {
    const validation = UrlSecurityValidator.validateUrl(url, true);
    if (!validation.isValid || !validation.parsedUrl) {
      throw new Error(`Invalid URL: ${validation.error}`);
    }

    let html = preloadedHtml || '';
    let httpStatus = 200;
    let finalUrl = url;

    if (!html) {
      const response = await UrlSecurityValidator.safeFetch(url, {
        allowHttp: true,
        timeoutMs: 8000,
      });
      html = response.body;
      httpStatus = response.status;
      finalUrl = response.finalUrl;
    }

    // ----------------------------------------------------
    // Strict Anti-Bot Wall Check
    // ----------------------------------------------------
    const lowerHtml = html.toLowerCase();
    const isCloudflareBlocked =
      lowerHtml.includes('cf-turnstile') ||
      lowerHtml.includes('challenge-platform') ||
      lowerHtml.includes('just a moment...') ||
      lowerHtml.includes('attention required! | cloudflare') ||
      (httpStatus === 403 && lowerHtml.includes('cloudflare'));

    const isPerimeterX =
      lowerHtml.includes('px-captcha') ||
      lowerHtml.includes('access to this page has been denied');

    const isDatadome = lowerHtml.includes('datadome');

    if (isCloudflareBlocked || isPerimeterX || isDatadome || httpStatus === 403 || httpStatus === 429) {
      const blocker = isCloudflareBlocked
        ? 'Cloudflare Turnstile/Bot Protection'
        : isPerimeterX
        ? 'PerimeterX Security'
        : isDatadome
        ? 'Datadome Challenge'
        : `HTTP ${httpStatus} Access Restriction`;

      throw new Error(
        `Target page is protected by ${blocker}. Automated crawling is restricted by site policy. Refusing to fabricate fake data.`
      );
    }

    // ----------------------------------------------------
    // JSON-LD Traversal (Support nested @graph and arrays)
    // ----------------------------------------------------
    let extractedJob: any = null;
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const rawJson = match[1].trim();
        const parsed = JSON.parse(rawJson);
        const candidates = Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];

        for (const item of candidates) {
          const type = item['@type'];
          const isJob =
            type === 'JobPosting' ||
            (Array.isArray(type) && type.includes('JobPosting')) ||
            (typeof type === 'string' && type.includes('JobPosting'));

          if (isJob) {
            extractedJob = item;
            break;
          }
        }
        if (extractedJob) break;
      } catch {
        // Continue to next script tag
      }
    }

    // Extract Title
    let title = extractedJob?.title ? this.decodeHtmlEntities(extractedJob.title) : '';
    // Extract Company Name
    let companyName = '';
    if (extractedJob?.hiringOrganization) {
      if (typeof extractedJob.hiringOrganization === 'string') {
        companyName = extractedJob.hiringOrganization;
      } else if (extractedJob.hiringOrganization.name) {
        companyName = extractedJob.hiringOrganization.name;
      }
    }
    companyName = this.decodeHtmlEntities(companyName);

    // Extract Description
    let description = extractedJob?.description ? this.stripHtml(extractedJob.description) : '';

    // Extract Location / City
    let city: string | null = null;
    let locationStr: string | null = null;
    if (extractedJob?.jobLocation?.address) {
      const addr = extractedJob.jobLocation.address;
      city = addr.addressLocality || addr.addressRegion || null;
      locationStr = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode]
        .filter(Boolean)
        .join(', ');
    }

    // Extract Salary
    let salaryRange: string | null = null;
    if (extractedJob?.baseSalary) {
      const s = extractedJob.baseSalary;
      const currency = s.currency || 'INR';
      const symbol = currency === 'INR' ? '₹' : currency + ' ';
      const unitText = s.unitText || s.value?.unitText;
      const unit = unitText ? ` / ${unitText.toLowerCase()}` : '';

      if (s.value?.value) {
        salaryRange = `${symbol}${Number(s.value.value).toLocaleString()}${unit}`;
      } else if (s.value?.minValue && s.value?.maxValue) {
        salaryRange = `${symbol}${Number(s.value.minValue).toLocaleString()} - ${symbol}${Number(
          s.value.maxValue
        ).toLocaleString()}${unit}`;
      } else if (s.value && typeof s.value === 'number') {
        salaryRange = `${symbol}${Number(s.value).toLocaleString()}${unit}`;
      }
    }

    // If not a structured JobPosting JSON-LD, ensure page actually represents a job listing
    const isJobPostingSchema = Boolean(extractedJob);
    const hasJobUrlSignal = /\/(jobs?|careers?|positions?|openings?|vacanc(y|ies))(\/|$|\?)/i.test(finalUrl);
    const hasJobSchemaInHtml = html.includes('JobPosting') || html.includes('schema.org/JobPosting');

    if (!isJobPostingSchema && !hasJobUrlSignal && !hasJobSchemaInHtml) {
      // Ordinary company website without JobPosting schema or career URL signal
      return null;
    }

    // OpenGraph & Meta Tag Fallbacks if JSON-LD is absent or incomplete
    if (!title) {
      const ogTitleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<title>([^<]+)<\/title>/i);
      if (ogTitleMatch) {
        const raw = this.decodeHtmlEntities(ogTitleMatch[1]);
        const parts = raw.split(/[-–|]/);
        title = parts[0].trim();
        if (!companyName && parts.length > 1) {
          const cand = parts[1].trim();
          if (!cand.toLowerCase().includes('job') && !cand.toLowerCase().includes('career')) {
            companyName = cand;
          }
        }
      }
    }

    if (title) {
      const lowerTitle = title.toLowerCase();
      if (
        lowerTitle.startsWith('welcome') ||
        lowerTitle.startsWith('home') ||
        lowerTitle.startsWith('about us') ||
        lowerTitle.startsWith('contact us') ||
        lowerTitle.includes('terms of') ||
        lowerTitle.includes('privacy policy')
      ) {
        return null;
      }
    }

    if (!description) {
      const ogDescMatch = html.match(
        /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i
      );
      if (ogDescMatch) {
        description = this.decodeHtmlEntities(ogDescMatch[1].trim());
      }
    }

    if (!companyName) {
      const ogSiteMatch = html.match(
        /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i
      );
      if (ogSiteMatch) {
        companyName = this.decodeHtmlEntities(ogSiteMatch[1].trim());
      } else {
        const parsedUrl = new URL(finalUrl);
        const apex = parsedUrl.hostname.replace(/^www\./, '').split('.')[0];
        if (apex && apex.length > 2) {
          companyName = apex.charAt(0).toUpperCase() + apex.slice(1);
        }
      }
    }

    // City fallback from text only if verified
    if (!city) {
      city = this.extractCity(`${title} ${locationStr || ''} ${description}`);
    }

    // Strictly require a verified job title and company name
    // Reject generic homepages or contact pages that do not contain an actual job vacancy
    if (!title || !title.trim() || !companyName || !companyName.trim()) {
      return null;
    }

    // Extract genuine contact channels from HTML
    const contacts = ContactEnrichmentService.extractContactsFromText(
      html,
      validation.parsedUrl.hostname.replace(/^www\./, '')
    );

    const parsedOrigin = validation.parsedUrl.origin;
    const category = this.categorizeRole(`${title} ${description}`);

    const requirement: DiscoveredLeadRequirement = {
      title: title.trim(),
      category,
      description: description.substring(0, 500) || undefined,
      city: city || null,
      location: locationStr || city || null,
      workersNeeded: null, // Zero fabrication
      salaryRange: salaryRange || null, // Zero fabrication
      sourceName: 'Career Page (Schema.org)',
      sourceUrl: finalUrl,
      externalListingId: extractedJob?.identifier?.value || undefined,
      datePosted: extractedJob?.datePosted ? new Date(extractedJob.datePosted) : undefined,
      expiresAt: extractedJob?.validThrough ? new Date(extractedJob.validThrough) : undefined,
    };

    return {
      companyName: companyName.trim(),
      companyWebsite: parsedOrigin,
      companyDomain: validation.parsedUrl.hostname.replace(/^www\./, ''),
      industry: category,
      city: city || null,
      officialEmail: contacts.emails[0] || null,
      officialPhone: contacts.phones[0] || null,
      contactPageUrl: `${parsedOrigin}/contact`,
      requirements: [requirement],
    };
  }
}
