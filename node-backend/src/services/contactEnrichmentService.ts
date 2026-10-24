export interface EnrichedContactInfo {
  domain: string | null;
  officialEmail: string | null;
  officialPhone: string | null;
  contactPageUrl: string | null;
  allEmails: string[];
  allPhones: string[];
}

export class ContactEnrichmentService {
  /**
   * Extracts clean corporate emails and telephone numbers from raw text / HTML.
   */
  static extractContactsFromText(htmlOrText: string, domain?: string | null): {
    emails: string[];
    phones: string[];
  } {
    if (!htmlOrText) return { emails: [], phones: [] };

    // Regex for email extraction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const rawEmails = htmlOrText.match(emailRegex) || [];

    // Filter out common asset/junk emails (.png, .jpg, sentry, example, etc.)
    const filteredEmails = Array.from(
      new Set(
        rawEmails
          .map((e) => e.toLowerCase().trim())
          .filter((e) => {
            if (e.endsWith('.png') || e.endsWith('.jpg') || e.endsWith('.svg') || e.endsWith('.js') || e.endsWith('.css')) return false;
            const domainPart = e.split('@')[1] || '';
            const blockedDomains = ['sentry.io', 'wixpress.com', 'schema.org', 'example.com'];
            if (blockedDomains.some((bd) => domainPart === bd || domainPart.endsWith('.' + bd))) return false;
            return true;
          })
      )
    );

    // Prioritize domain-specific or recruitment/official mailboxes
    const cleanDomain = domain ? domain.toLowerCase().replace(/^www\./, '') : '';
    filteredEmails.sort((a, b) => {
      const aDomain = a.split('@')[1] || '';
      const bDomain = b.split('@')[1] || '';
      const aMatches = cleanDomain && (aDomain === cleanDomain || aDomain.endsWith('.' + cleanDomain));
      const bMatches = cleanDomain && (bDomain === cleanDomain || bDomain.endsWith('.' + cleanDomain));
      const aScore = (a.startsWith('careers@') || a.startsWith('hr@') || a.startsWith('contact@') || a.startsWith('info@')) ? 2 : (aMatches ? 1 : 0);
      const bScore = (b.startsWith('careers@') || b.startsWith('hr@') || b.startsWith('contact@') || b.startsWith('info@')) ? 2 : (bMatches ? 1 : 0);
      return bScore - aScore;
    });

    // Regex for Indian/International phone numbers (landlines and corporate desks)
    const phoneRegex = /(?:\+91[\-\s]?)?(?:\(?0\d{2,4}\)?[\-\s]?)?[2-9]\d{2,4}[\-\s]?\d{3,4}\b/g;
    const rawPhones = htmlOrText.match(phoneRegex) || [];

    const filteredPhones = Array.from(
      new Set(
        rawPhones
          .map((p) => p.trim())
          .filter((p) => {
            const digits = p.replace(/\D/g, '');
            return digits.length >= 8 && digits.length <= 13;
          })
      )
    );

    return {
      emails: filteredEmails,
      phones: filteredPhones,
    };
  }

  /**
   * Fetches official contact endpoints on the target company domain.
   */
  static async enrichFromDomain(websiteUrl?: string | null): Promise<EnrichedContactInfo> {
    if (!websiteUrl) {
      return {
        domain: null,
        officialEmail: null,
        officialPhone: null,
        contactPageUrl: null,
        allEmails: [],
        allPhones: [],
      };
    }

    let normalizedUrl = websiteUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    let apexDomain: string | null = null;
    let baseOrigin = '';

    try {
      const parsed = new URL(normalizedUrl);
      baseOrigin = parsed.origin;
      const parts = parsed.hostname.replace(/^www\./, '').split('.');
      apexDomain = parts.length >= 2 ? parts.slice(-2).join('.') : parsed.hostname;
    } catch {
      return {
        domain: null,
        officialEmail: null,
        officialPhone: null,
        contactPageUrl: null,
        allEmails: [],
        allPhones: [],
      };
    }

    const pathsToTry = ['/contact', '/contact-us', '/about', '/careers', ''];
    const collectedEmails: string[] = [];
    const collectedPhones: string[] = [];
    let validContactPage: string | null = null;

    for (const path of pathsToTry) {
      const target = `${baseOrigin}${path}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const response = await fetch(target, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TrustHire-LeadScanner/1.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          if (!validContactPage && path.includes('contact')) {
            validContactPage = target;
          }
          const { emails, phones } = this.extractContactsFromText(html, apexDomain);
          collectedEmails.push(...emails);
          collectedPhones.push(...phones);

          if (collectedEmails.length > 0 && collectedPhones.length > 0) {
            break; // Found sufficient corporate contacts
          }
        }
      } catch {
        // Continue to next path if connection fails or times out
      }
    }

    const uniqueEmails = Array.from(new Set(collectedEmails));
    const uniquePhones = Array.from(new Set(collectedPhones));

    return {
      domain: apexDomain,
      officialEmail: uniqueEmails[0] || null,
      officialPhone: uniquePhones[0] || null,
      contactPageUrl: validContactPage || `${baseOrigin}/contact`,
      allEmails: uniqueEmails,
      allPhones: uniquePhones,
    };
  }
}
