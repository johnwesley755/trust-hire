import { ContactEnrichmentService } from './contactEnrichmentService';
import { LeadService, type IngestLeadInput } from './leadService';
import { ScrapeLogger, type ScrapeStepLog, type ScrapeSessionSummary } from './scrapeLogger';
import { UrlSecurityValidator } from './discovery/urlSecurityValidator';
import { SourceAdapterRegistry } from './discovery/sourceAdapterRegistry';
import { DiscoveredEmployerLead } from './discovery/types';

export interface CrawledJobResult {
  companyName: string;
  companyWebsite: string | null;
  industry: string | null;
  city: string | null;
  officialEmail: string | null;
  officialPhone: string | null;
  contactPageUrl: string | null;
  title: string;
  category: string;
  workersNeeded: number | null;
  salaryRange: string | null;
  sourceName: string;
  sourceUrl: string;
  description: string;
}

export interface CrawlUrlResponse {
  lead: CrawledJobResult;
  logs: ScrapeStepLog[];
  session: ScrapeSessionSummary;
}

export interface AutoDiscoveryResult {
  totalScanned: number;
  newLeadsCount: number;
  updatedLeadsCount: number;
  duplicatesIgnored: number;
  rejectedCount: number;
  results: any[];
  logs: ScrapeStepLog[];
  session: ScrapeSessionSummary;
  sourceBreakdown: Array<{
    sourceId: string;
    sourceName: string;
    status: string;
    leadsFound: number;
    requirementsFound: number;
    error?: string;
  }>;
}

export class LeadCrawlerService {
  /**
   * Scrapes and extracts structured employer requirements and contact info from any verified URL.
   * Employs strict SSRF validation, anti-bot challenge detection, and zero data fabrication.
   */
  static async crawlUrl(targetUrl: string): Promise<CrawlUrlResponse> {
    const session = ScrapeLogger.startSession(targetUrl, 'SINGLE_URL_CRAWL');
    const trimmed = (targetUrl || '').trim();
    if (trimmed.includes('://') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      const scheme = trimmed.split('://')[0];
      session.finish('FAILED', undefined, `Unsupported protocol "${scheme}". Only HTTPS endpoints are permitted.`);
      throw new Error(`Security validation failed: Insecure or unsupported protocol "${scheme}". Only HTTPS endpoints are permitted.`);
    }
    const sanitizedUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    // ----------------------------------------------------
    // STEP 1: SSRF Defense & URL Syntax Validation (Strict HTTPS only)
    // ----------------------------------------------------
    const validation = UrlSecurityValidator.validateUrl(sanitizedUrl, false);
    if (!validation.isValid || !validation.parsedUrl) {
      session.logStep(
        'URL_PARSE',
        'URL Security Rejection (SSRF Defense)',
        'ERROR',
        validation.error || 'Invalid or prohibited target URL',
        { targetUrl, error: validation.error }
      );
      session.finish('FAILED', undefined, validation.error);
      throw new Error(`Security validation failed: ${validation.error}`);
    }

    const parsedUrl = validation.parsedUrl;
    session.logStep(
      'URL_PARSE',
      'URL Parse & Host Validation',
      'SUCCESS',
      `Validated URL: ${parsedUrl.protocol}//${parsedUrl.hostname} (Safe for outbound crawler fetch)`,
      { hostname: parsedUrl.hostname, pathname: parsedUrl.pathname }
    );

    // ----------------------------------------------------
    // STEP 2: Adapter Selection & Parsing
    // ----------------------------------------------------
    const adapter = SourceAdapterRegistry.getAdapterForUrl(parsedUrl);
    session.logStep(
      'URL_PARSE',
      'Source Adapter Selected',
      'INFO',
      `Routing request to adapter: "${adapter.name}" [${adapter.type}]`,
      { adapterId: adapter.id, status: adapter.status }
    );

    let parsedLead: DiscoveredEmployerLead | null = null;
    const fetchStart = Date.now();

    try {
      if (typeof adapter.parseJobPage === 'function') {
        parsedLead = await adapter.parseJobPage(sanitizedUrl);
      } else {
        throw new Error(`Adapter "${adapter.name}" does not support single-page direct parsing.`);
      }
    } catch (parseErr: any) {
      const duration = Date.now() - fetchStart;
      session.logStep(
        'BOT_DETECTION',
        'Extraction / Access Error',
        'ERROR',
        parseErr.message || 'Failed to extract structured data from target page.',
        { error: parseErr.message },
        duration
      );
      session.finish('FAILED', undefined, parseErr.message);
      throw parseErr;
    }

    if (!parsedLead || parsedLead.requirements.length === 0) {
      const duration = Date.now() - fetchStart;
      session.logStep(
        'EXTRACTION_DOM',
        'No Valid Job Requisitions Found',
        'WARNING',
        'Page was fetched successfully, but did not contain recognizable job openings or Schema.org metadata.',
        {},
        duration
      );
      session.finish('FAILED', undefined, 'No valid job requisitions found on page');
      throw new Error('No valid job requisitions or employer hiring signals found at this URL.');
    }

    const primaryReq = parsedLead.requirements[0];
    session.logStep(
      'EXTRACTION_JSONLD',
      'Requisition Successfully Extracted',
      'SUCCESS',
      `Identified role: "${primaryReq.title}" at "${parsedLead.companyName}"`,
      {
        companyName: parsedLead.companyName,
        title: primaryReq.title,
        city: primaryReq.city || 'Not specified',
        salary: primaryReq.salaryRange || 'Competitive (not specified)',
      },
      Date.now() - fetchStart
    );

    // ----------------------------------------------------
    // STEP 3: Corporate Contact Channel Enrichment
    // ----------------------------------------------------
    let officialEmail = parsedLead.officialEmail || null;
    let officialPhone = parsedLead.officialPhone || null;
    let contactPageUrl = parsedLead.contactPageUrl || null;

    if ((!officialEmail || !officialPhone) && parsedLead.companyWebsite) {
      const enrichStart = Date.now();
      try {
        const enriched = await ContactEnrichmentService.enrichFromDomain(parsedLead.companyWebsite);
        officialEmail = officialEmail || enriched.officialEmail;
        officialPhone = officialPhone || enriched.officialPhone;
        contactPageUrl = contactPageUrl || enriched.contactPageUrl;

        session.logStep(
          'CONTACT_ENRICH',
          'Domain Contact Enrichment Probe',
          officialEmail || officialPhone ? 'SUCCESS' : 'INFO',
          officialEmail || officialPhone
            ? `Discovered verified contacts: Email: ${officialEmail || 'None'} | Phone: ${officialPhone || 'None'}`
            : `Scanned ${parsedLead.companyWebsite} contact pages; no public direct contacts exposed.`,
          { officialEmail, officialPhone, contactPageUrl },
          Date.now() - enrichStart
        );
      } catch {
        // Enrichment error is non-fatal
      }
    }

    const leadResult: CrawledJobResult = {
      companyName: parsedLead.companyName,
      companyWebsite: parsedLead.companyWebsite || null,
      industry: parsedLead.industry || primaryReq.category || null,
      city: primaryReq.city || parsedLead.city || null,
      officialEmail,
      officialPhone,
      contactPageUrl,
      title: primaryReq.title,
      category: primaryReq.category || 'General Operations',
      workersNeeded: primaryReq.workersNeeded || null,
      salaryRange: primaryReq.salaryRange || null,
      sourceName: primaryReq.sourceName,
      sourceUrl: primaryReq.sourceUrl,
      description: primaryReq.description || '',
    };

    session.finish('COMPLETED', {
      companyName: leadResult.companyName,
      companyWebsite: leadResult.companyWebsite || undefined,
      jobTitle: leadResult.title,
      city: leadResult.city || undefined,
      officialEmail: leadResult.officialEmail,
      officialPhone: leadResult.officialPhone,
      workersNeeded: leadResult.workersNeeded || undefined,
      salaryRange: leadResult.salaryRange || undefined,
    });

    return {
      lead: leadResult,
      logs: session.getSteps(),
      session: session.getSummary(),
    };
  }

  /**
   * Multi-Portal & Live ATS Auto-Discovery Scanner:
   * Discovers fresh hiring signals across authorized active source adapters.
   * Completely eliminates fake static records, destructive deletions, and data fabrication.
   */
  static async runAutoDiscovery(): Promise<AutoDiscoveryResult> {
    const session = ScrapeLogger.startSession('MULTI_FEED_DISCOVERY', 'AUTO_DISCOVERY_SCAN');

    session.logStep(
      'URL_PARSE',
      'Auto-Discovery Feeds Initialized',
      'INFO',
      'Querying registered, active source adapters with zero mock data and strict compliance rules.'
    );

    const activeAdapters = SourceAdapterRegistry.getActiveAdapters();
    const allAdapters = SourceAdapterRegistry.getAllAdapters();
    const sourceBreakdown: AutoDiscoveryResult['sourceBreakdown'] = [];

    let totalScanned = 0;
    let newLeadsCount = 0;
    let updatedLeadsCount = 0;
    let duplicatesIgnored = 0;
    let rejectedCount = 0;
    const ingestedResults = [];

    // ----------------------------------------------------
    // Execute Discovery Across Active Adapters
    // ----------------------------------------------------
    for (const adapter of activeAdapters) {
      session.logStep(
        'HTTP_FETCH',
        `Querying Source: ${adapter.name}`,
        'INFO',
        `Connecting to authorized feed for ${adapter.name} [Type: ${adapter.type}].`
      );

      try {
        const scanResult = await adapter.discoverJobs();
        SourceAdapterRegistry.recordScan(adapter.id);
        totalScanned += scanResult.scannedCount;

        const totalReqsInSource = scanResult.leads.reduce(
          (acc, l) => acc + (l.requirements?.length || 0),
          0
        );

        sourceBreakdown.push({
          sourceId: adapter.id,
          sourceName: adapter.name,
          status: scanResult.status,
          leadsFound: scanResult.leads.length,
          requirementsFound: totalReqsInSource,
          error: scanResult.errorMessage,
        });

        session.logStep(
          'EXTRACTION_DOM',
          `Source Complete: ${adapter.name}`,
          scanResult.status === 'SUCCESS' ? 'SUCCESS' : 'WARNING',
          `Retrieved ${scanResult.leads.length} employers and ${totalReqsInSource} requisitions in ${scanResult.durationMs}ms.`,
          {
            leadsFound: scanResult.leads.length,
            requirementsFound: totalReqsInSource,
            error: scanResult.errorMessage,
          },
          scanResult.durationMs
        );

        // ----------------------------------------------------
        // Ingestion & Deduplication
        // ----------------------------------------------------
        for (const item of scanResult.leads) {
          const enrichStart = Date.now();
          let enrichedEmail = item.officialEmail || undefined;
          let enrichedPhone = item.officialPhone || undefined;
          let enrichedContactPage = item.contactPageUrl || undefined;

          // Probe corporate domain for verified contacts if absent
          if ((!enrichedEmail || !enrichedPhone) && item.companyWebsite) {
            try {
              const enriched = await ContactEnrichmentService.enrichFromDomain(item.companyWebsite);
              enrichedEmail = enrichedEmail || enriched.officialEmail || undefined;
              enrichedPhone = enrichedPhone || enriched.officialPhone || undefined;
              enrichedContactPage = enrichedContactPage || enriched.contactPageUrl || undefined;
            } catch {
              // Ignore enrichment error
            }
          }
          const enrichDuration = Date.now() - enrichStart;

          const ingestInput: IngestLeadInput = {
            companyName: item.companyName,
            companyWebsite: item.companyWebsite || undefined,
            industry: item.industry || undefined,
            city: item.city || undefined,
            state: item.state || undefined,
            address: item.address || undefined,
            officialEmail: enrichedEmail,
            officialPhone: enrichedPhone,
            contactPageUrl: enrichedContactPage,
            requirements: item.requirements.map((r) => ({
              title: r.title,
              category: r.category,
              description: r.description,
              city: r.city || undefined,
              location: r.location || undefined,
              workersNeeded: r.workersNeeded || undefined,
              salaryRange: r.salaryRange || undefined,
              sourceName: r.sourceName,
              sourceUrl: r.sourceUrl,
              externalListingId: r.externalListingId,
            })),
          };

          const res: any = await LeadService.ingestLead(ingestInput);
          ingestedResults.push(res);

          const isNew = Boolean(res.isNewLead);
          if (isNew) {
            newLeadsCount++;
          } else {
            updatedLeadsCount++;
          }

          duplicatesIgnored += res.duplicatesMergedCount || 0;
          const rejectedInLead = item.requirements.length - (res.requirements?.length || 0);
          if (rejectedInLead > 0) {
            rejectedCount += rejectedInLead;
          }

          session.logStep(
            'DB_INGEST',
            `Lead Ingestion: ${item.companyName}`,
            'SUCCESS',
            `${isNew ? 'Created new lead' : 'Refreshed existing lead'} with ${res.requirements.length} requirement(s).`,
            {
              leadId: res.lead.id,
              isNew,
              domain: res.lead.company_domain,
              requirementsCount: res.requirements.length,
              duplicatesMerged: res.duplicatesMergedCount || 0,
            },
            enrichDuration
          );
        }
      } catch (adapterErr: any) {
        sourceBreakdown.push({
          sourceId: adapter.id,
          sourceName: adapter.name,
          status: 'FAILED',
          leadsFound: 0,
          requirementsFound: 0,
          error: adapterErr.message,
        });

        session.logStep(
          'HTTP_FETCH',
          `Source Execution Error: ${adapter.name}`,
          'ERROR',
          `Adapter failed during execution: ${adapterErr.message}`,
          { error: adapterErr.message }
        );
      }
    }

    // ----------------------------------------------------
    // Record Restricted Sources in Breakdown for Transparency
    // ----------------------------------------------------
    for (const adapter of allAdapters) {
      if (adapter.status !== 'ACTIVE') {
        sourceBreakdown.push({
          sourceId: adapter.id,
          sourceName: adapter.name,
          status: adapter.status,
          leadsFound: 0,
          requirementsFound: 0,
          error: adapter.complianceNote,
        });
      }
    }

    session.finish('COMPLETED', {
      workersNeeded: ingestedResults.reduce((sum, r) => sum + (r.requirements?.length || 0), 0),
    });

    return {
      totalScanned,
      newLeadsCount,
      updatedLeadsCount,
      duplicatesIgnored,
      rejectedCount,
      results: ingestedResults,
      logs: session.getSteps(),
      session: session.getSummary(),
      sourceBreakdown,
    };
  }
}
