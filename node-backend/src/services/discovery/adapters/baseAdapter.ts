import {
  JobSourceAdapter,
  SourceType,
  SourceStatus,
  DiscoveryOptions,
  AdapterDiscoveryResult,
  DiscoveredEmployerLead,
} from '../types';

export abstract class BaseJobSourceAdapter implements JobSourceAdapter {
  abstract id: string;
  abstract name: string;
  abstract type: SourceType;
  abstract status: SourceStatus;
  abstract complianceNote: string;

  abstract canHandleUrl(url: URL): boolean;
  abstract discoverJobs(options?: DiscoveryOptions): Promise<AdapterDiscoveryResult>;

  async parseJobPage?(url: string, html?: string): Promise<DiscoveredEmployerLead | null> {
    return null;
  }

  /**
   * Decodes basic HTML entities commonly found in job titles & descriptions.
   */
  protected decodeHtmlEntities(str: string): string {
    if (!str) return '';
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x2F;/g, '/')
      .replace(/&#x60;/g, '`')
      .trim();
  }

  /**
   * Strips HTML tags and normalizes whitespace while preserving text content.
   */
  protected stripHtml(html: string): string {
    if (!html) return '';
    return this.decodeHtmlEntities(
      html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  /**
   * Categorizes blue-collar and trade roles from title and description keywords.
   */
  protected categorizeRole(titleAndDesc: string): string {
    const lower = titleAndDesc.toLowerCase();
    if (
      lower.includes('driver') ||
      lower.includes('delivery') ||
      lower.includes('rider') ||
      lower.includes('courier') ||
      lower.includes('fleet')
    ) {
      return 'Logistics & Delivery';
    }
    if (
      lower.includes('electrician') ||
      lower.includes('wireman') ||
      lower.includes('wiring') ||
      lower.includes('hvac') ||
      lower.includes('ac techn') ||
      lower.includes('appliance')
    ) {
      return 'Electrical & Wiring';
    }
    if (
      lower.includes('warehouse') ||
      lower.includes('picker') ||
      lower.includes('packer') ||
      lower.includes('loading') ||
      lower.includes('inventory')
    ) {
      return 'Warehousing & Packing';
    }
    if (
      lower.includes('cook') ||
      lower.includes('chef') ||
      lower.includes('steward') ||
      lower.includes('kitchen') ||
      lower.includes('hotel') ||
      lower.includes('waiter')
    ) {
      return 'Hospitality & Food';
    }
    if (
      lower.includes('welder') ||
      lower.includes('fitter') ||
      lower.includes('fabricator') ||
      lower.includes('machinist') ||
      lower.includes('cnc')
    ) {
      return 'Manufacturing & Welding';
    }
    if (
      lower.includes('plumber') ||
      lower.includes('pipe') ||
      lower.includes('sanitation') ||
      lower.includes('cleaning') ||
      lower.includes('housekeeping')
    ) {
      return 'Plumbing & Facilities';
    }
    return 'General Operations';
  }

  /**
   * Extracts recognized Indian cities from text. Returns null if no city is identifiable.
   * NEVER default to Chennai or any other city unless explicitly verified!
   */
  protected extractCity(text: string): string | null {
    if (!text) return null;
    const lower = text.toLowerCase();
    const cities: Record<string, string> = {
      chennai: 'Chennai',
      coimbatore: 'Coimbatore',
      bengaluru: 'Bengaluru',
      bangalore: 'Bengaluru',
      hyderabad: 'Hyderabad',
      mumbai: 'Mumbai',
      delhi: 'Delhi',
      'new delhi': 'Delhi',
      gurgaon: 'Gurugram',
      gurugram: 'Gurugram',
      noida: 'Noida',
      pune: 'Pune',
      kolkata: 'Kolkata',
      madurai: 'Madurai',
      tiruchirappalli: 'Tiruchirappalli',
      trichy: 'Tiruchirappalli',
      salem: 'Salem',
      kochi: 'Kochi',
      ernakulam: 'Kochi',
      ahmedabad: 'Ahmedabad',
    };

    for (const [key, val] of Object.entries(cities)) {
      // Word boundary match
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(lower)) {
        return val;
      }
    }
    return null;
  }
}
