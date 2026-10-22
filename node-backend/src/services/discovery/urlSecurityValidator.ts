export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  parsedUrl?: URL;
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  maxSizeBytes?: number;
  headers?: Record<string, string>;
  allowHttp?: boolean;
}

export interface SafeFetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  finalUrl: string;
}

export class UrlSecurityValidator {
  private static readonly MAX_RESPONSE_SIZE = 8 * 1024 * 1024; // 8MB (Supports large enterprise boards like Paytm and Deliveroo)
  private static readonly DEFAULT_TIMEOUT_MS = 7000;
  private static readonly MAX_REDIRECTS = 3;

  /**
   * Evaluates if an IPv4 address string falls into private, loopback, or cloud-metadata ranges.
   */
  private static isPrivateOrRestrictedIp(ip: string): boolean {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return false;
    }

    const [a, b] = parts;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;
    // 10.0.0.0/8 (Private)
    if (a === 10) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 169.254.0.0/16 (Link-local & AWS/GCP/Azure Metadata: 169.254.169.254)
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12 (Private 172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
    if (a === 192 && b === 0) return true;
    if (a === 198 && b === 51) return true;
    if (a === 203 && b === 0) return true;
    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (a >= 224) return true;

    return false;
  }

  /**
   * Validates target URL against SSRF, dangerous schemes, and restricted network hostnames.
   */
  static validateUrl(urlString: string, allowHttp: boolean = false): UrlValidationResult {
    if (!urlString || typeof urlString !== 'string') {
      return { isValid: false, error: 'Target URL is missing or empty' };
    }

    const trimmed = urlString.trim();

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch (err: any) {
      return { isValid: false, error: `Invalid URL syntax: ${err.message}` };
    }

    // Protocol check
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== 'https:' && (!allowHttp || protocol !== 'http:')) {
      return {
        isValid: false,
        error: `Insecure or unsupported protocol: "${protocol}". Only HTTPS endpoints are permitted.`,
      };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

    // Check for loopback and internal hostname strings
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.corp') ||
      hostname.endsWith('.lan') ||
      hostname === 'metadata.google.internal' ||
      hostname === 'instance-data'
    ) {
      return {
        isValid: false,
        error: `Access to internal host "${hostname}" is blocked by security policy (SSRF prevention).`,
      };
    }

    // Check if hostname is an encoded decimal integer IP (e.g. http://2130706433 -> 127.0.0.1)
    if (/^\d+$/.test(hostname)) {
      const num = parseInt(hostname, 10);
      const ip = `${(num >> 24) & 255}.${(num >> 16) & 255}.${(num >> 8) & 255}.${num & 255}`;
      if (this.isPrivateOrRestrictedIp(ip)) {
        return {
          isValid: false,
          error: `Numeric IP "${hostname}" resolves to private address ${ip} and is blocked.`,
        };
      }
    }

    // Check standard dotted IPv4
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      if (this.isPrivateOrRestrictedIp(hostname)) {
        return {
          isValid: false,
          error: `Direct IP access to restricted subnet "${hostname}" is blocked.`,
        };
      }
    }

    // Check IPv6 addresses
    if (
      hostname.includes(':') &&
      (hostname.startsWith('fe80:') ||
        hostname.startsWith('fc00:') ||
        hostname.startsWith('fd00:') ||
        hostname === '::1' ||
        hostname === '::')
    ) {
      return {
        isValid: false,
        error: `IPv6 private/link-local address "${hostname}" is blocked.`,
      };
    }

    // Check port (only allow standard web ports 80, 443, 8080, 8443)
    if (parsed.port) {
      const portNum = parseInt(parsed.port, 10);
      if (![80, 443, 8080, 8443].includes(portNum)) {
        return {
          isValid: false,
          error: `Non-standard port "${parsed.port}" is not allowed for external crawlers.`,
        };
      }
    }

    return { isValid: true, parsedUrl: parsed };
  }

  /**
   * Safely executes an HTTP request with redirect validation, timeout, and response size limits.
   */
  static async safeFetch(
    targetUrl: string,
    options: SafeFetchOptions = {}
  ): Promise<SafeFetchResponse> {
    const timeoutMs = options.timeoutMs || this.DEFAULT_TIMEOUT_MS;
    const maxRedirects = options.maxRedirects ?? this.MAX_REDIRECTS;
    const maxSizeBytes = options.maxSizeBytes || this.MAX_RESPONSE_SIZE;
    const allowHttp = options.allowHttp ?? false;

    let currentUrl = targetUrl;
    let redirectsCount = 0;

    while (redirectsCount <= maxRedirects) {
      const validation = this.validateUrl(currentUrl, allowHttp);
      if (!validation.isValid) {
        throw new Error(`SSRF Blocked: ${validation.error}`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const defaultHeaders: Record<string, string> = {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (TrustHire-Scanner/2.0)',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
          'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
          ...options.headers,
        };

        let body = '';
        try {
          const response = await fetch(currentUrl, {
            method: 'GET',
            signal: controller.signal,
            headers: defaultHeaders,
            redirect: 'manual', // Intercept all redirects to validate destination!
          });

          // Handle HTTP 3xx Redirects
          if ([301, 302, 303, 307, 308].includes(response.status)) {
            const location = response.headers.get('location');
            if (!location) {
              throw new Error(`HTTP ${response.status} redirect without Location header.`);
            }

            redirectsCount++;
            if (redirectsCount > maxRedirects) {
              throw new Error(`Exceeded maximum allowed redirects (${maxRedirects}).`);
            }

            // Resolve relative redirect against current URL
            const resolvedUrl = new URL(location, currentUrl).toString();
            currentUrl = resolvedUrl;
            continue;
          }

          // Validate Content-Type
          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          const isAcceptable =
            contentType.includes('text/html') ||
            contentType.includes('application/json') ||
            contentType.includes('application/ld+json') ||
            contentType.includes('text/plain') ||
            contentType.includes('application/xml') ||
            contentType.includes('text/xml') ||
            contentType === '';

          if (!isAcceptable) {
            throw new Error(
              `Unsupported Content-Type "${contentType}". Binary or non-text resources are rejected.`
            );
          }

          // Validate Content-Length if present
          const contentLengthHeader = response.headers.get('content-length');
          if (contentLengthHeader) {
            const length = parseInt(contentLengthHeader, 10);
            if (length > maxSizeBytes) {
              throw new Error(
                `Response size ${Math.round(length / 1024)} KB exceeds limit of ${Math.round(maxSizeBytes / 1024)} KB.`
              );
            }
          }

          // Stream reading with byte-level enforcement to prevent memory exhaustion
          if (response.body && typeof response.body.getReader === 'function') {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let bytesReceived = 0;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                bytesReceived += value.length;
                if (bytesReceived > maxSizeBytes) {
                  reader.cancel();
                  throw new Error(
                    `Received payload of ${Math.round(bytesReceived / 1024)} KB exceeds limit of ${Math.round(maxSizeBytes / 1024)} KB.`
                  );
                }
                body += decoder.decode(value, { stream: true });
              }
            }
            body += decoder.decode();
          } else {
            body = await response.text();
            if (body.length > maxSizeBytes) {
              throw new Error(
                `Received payload of ${Math.round(body.length / 1024)} KB exceeds limit of ${Math.round(maxSizeBytes / 1024)} KB.`
              );
            }
          }

          const headers: Record<string, string> = {};
          response.headers.forEach((val, key) => {
            headers[key.toLowerCase()] = val;
          });

          return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers,
            body,
            finalUrl: currentUrl,
          };
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error(`Network timeout: request exceeded ${timeoutMs}ms.`);
        }
        throw err;
      }
    }

    throw new Error(`Exceeded maximum allowed redirects (${maxRedirects}).`);
  }
}
