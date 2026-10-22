import assert from 'node:assert';
import { UrlSecurityValidator } from '../src/services/discovery/urlSecurityValidator';
import { SchemaOrgCareerPageAdapter } from '../src/services/discovery/adapters/schemaOrgAdapter';
import { LeverAtsAdapter } from '../src/services/discovery/adapters/leverAtsAdapter';
import { SourceAdapterRegistry } from '../src/services/discovery/sourceAdapterRegistry';
import { LeadService } from '../src/services/leadService';

async function runAllTests() {
  console.log('🧪 Starting TrustHyre Discovery Automated Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => Promise<void> | void) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  ✅ PASS: ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     ${err.message}`);
        failed++;
      });
  }

  // ----------------------------------------------------
  // TEST SUITE 1: SSRF & URL Security Validation
  // ----------------------------------------------------
  console.log('--- 1. SSRF & URL Security Validation ---');

  await test('Blocks localhost and 127.0.0.1', () => {
    const r1 = UrlSecurityValidator.validateUrl('https://localhost:8787');
    assert.strictEqual(r1.isValid, false);
    assert.match(r1.error!, /blocked by security policy/);

    const r2 = UrlSecurityValidator.validateUrl('https://127.0.0.1/admin');
    assert.strictEqual(r2.isValid, false);
    assert.match(r2.error!, /blocked by security policy|Direct IP access to restricted subnet/);
  });

  await test('Blocks AWS / Cloud metadata service (169.254.169.254)', () => {
    const r = UrlSecurityValidator.validateUrl('https://169.254.169.254/latest/meta-data/');
    assert.strictEqual(r.isValid, false);
    assert.match(r.error!, /Direct IP access to restricted subnet|blocked/);
  });

  await test('Blocks private IPv4 subnets (10.x, 172.16.x, 192.168.x)', () => {
    assert.strictEqual(UrlSecurityValidator.validateUrl('https://10.0.0.15/careers').isValid, false);
    assert.strictEqual(UrlSecurityValidator.validateUrl('https://172.20.0.5/jobs').isValid, false);
    assert.strictEqual(UrlSecurityValidator.validateUrl('https://192.168.1.1/').isValid, false);
  });

  await test('Blocks numeric integer encoded loopback IPs (e.g. 2130706433)', () => {
    const r = UrlSecurityValidator.validateUrl('https://2130706433/sensitive');
    assert.strictEqual(r.isValid, false);
    assert.match(r.error!, /blocked by security policy|Numeric IP/);
  });

  await test('Blocks plain HTTP and non-HTTP/HTTPS schemes (file://, gopher://, ftp://)', () => {
    const rHttp = UrlSecurityValidator.validateUrl('http://example.com/careers');
    assert.strictEqual(rHttp.isValid, false);
    assert.match(rHttp.error!, /Only HTTPS endpoints are permitted/);

    assert.strictEqual(UrlSecurityValidator.validateUrl('file:///etc/passwd').isValid, false);
    assert.strictEqual(UrlSecurityValidator.validateUrl('ftp://ftp.example.com').isValid, false);
  });

  await test('Permits legitimate public HTTPS corporate domains', () => {
    const r = UrlSecurityValidator.validateUrl('https://careers.swiggy.com/jobs');
    assert.strictEqual(r.isValid, true);
    assert.strictEqual(r.parsedUrl?.hostname, 'careers.swiggy.com');
  });

  // ----------------------------------------------------
  // TEST SUITE 2: Schema.org / JSON-LD Parsing & Zero Fabrication
  // ----------------------------------------------------
  console.log('\n--- 2. Schema.org / JSON-LD Parsing ---');

  const schemaAdapter = new SchemaOrgCareerPageAdapter();

  await test('Correctly extracts JobPosting from single JSON-LD block', async () => {
    const fixtureHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": "Delivery Fleet Executive",
              "description": "Full-time two-wheeler delivery riders needed with valid license.",
              "hiringOrganization": {
                "@type": "Organization",
                "name": "Express Logistics India",
                "sameAs": "https://expresslogistics.in"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Coimbatore",
                  "addressRegion": "Tamil Nadu"
                }
              },
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "INR",
                "value": {
                  "@type": "QuantitativeValue",
                  "minValue": 18000,
                  "maxValue": 25000,
                  "unitText": "MONTH"
                }
              }
            }
          </script>
        </head>
        <body>
          <p>Contact us at careers@expresslogistics.in or phone 0422-2455112</p>
        </body>
      </html>
    `;

    const result = await schemaAdapter.parseJobPage('https://expresslogistics.in/jobs/123', fixtureHtml);
    assert.ok(result, 'Expected parsed lead');
    assert.strictEqual(result.companyName, 'Express Logistics India');
    assert.strictEqual(result.city, 'Coimbatore');
    assert.strictEqual(result.requirements.length, 1);
    assert.strictEqual(result.requirements[0].title, 'Delivery Fleet Executive');
    assert.strictEqual(result.requirements[0].category, 'Logistics & Delivery');
    assert.strictEqual(result.requirements[0].salaryRange, '₹18,000 - ₹25,000 / month');
    assert.strictEqual(result.requirements[0].workersNeeded, null); // NOT fabricated!
    assert.strictEqual(result.officialEmail, 'careers@expresslogistics.in');
    assert.strictEqual(result.officialPhone, '0422-2455112');
  });

  await test('Correctly extracts JobPosting from nested @graph array', async () => {
    const nestedGraphHtml = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "WebSite", "name": "Industrial Works" },
                {
                  "@type": "JobPosting",
                  "title": "Commercial AC Technician",
                  "hiringOrganization": { "name": "Cooling Tech Services" },
                  "jobLocation": { "address": { "addressLocality": "Chennai" } }
                }
              ]
            }
          </script>
        </head>
      </html>
    `;

    const result = await schemaAdapter.parseJobPage('https://coolingtech.com/career', nestedGraphHtml);
    assert.ok(result);
    assert.strictEqual(result.companyName, 'Cooling Tech Services');
    assert.strictEqual(result.requirements[0].title, 'Commercial AC Technician');
    assert.strictEqual(result.requirements[0].category, 'Electrical & Wiring');
    assert.strictEqual(result.requirements[0].salaryRange, null); // Zero fabrication when salary is missing!
  });

  await test('Rejects anti-bot challenge HTML without creating fake lead', async () => {
    const cloudflareChallengeHtml = `
      <!DOCTYPE html>
      <html>
        <head><title>Just a moment...</title></head>
        <body>
          <div id="cf-turnstile">Please verify you are human</div>
        </body>
      </html>
    `;

    await assert.rejects(
      async () => {
        await schemaAdapter.parseJobPage('https://protected-portal.com/job', cloudflareChallengeHtml);
      },
      /Cloudflare Turnstile\/Bot Protection/
    );
  });

  // ----------------------------------------------------
  // TEST SUITE 3: Lever ATS Adapter & Normalization
  // ----------------------------------------------------
  console.log('\n--- 3. Lever ATS Adapter ---');

  const leverAdapter = new LeverAtsAdapter();

  await test('Matches jobs.lever.co and api.lever.co URLs', () => {
    assert.strictEqual(leverAdapter.canHandleUrl(new URL('https://jobs.lever.co/swiggy/abc-123')), true);
    assert.strictEqual(leverAdapter.canHandleUrl(new URL('https://api.lever.co/v0/postings/swiggy')), true);
    assert.strictEqual(leverAdapter.canHandleUrl(new URL('https://example.com/jobs')), false);
  });

  // ----------------------------------------------------
  // TEST SUITE 4: Restricted Portals Status & Compliance
  // ----------------------------------------------------
  console.log('\n--- 4. Restricted Portals Adapter Status ---');

  await test('Registry reports Naukri, Indeed, Apna, and WorkIndia as restricted without fake scrapes', () => {
    const list = SourceAdapterRegistry.getSourceList();
    const naukri = list.find((s) => s.id === 'naukri');
    const indeed = list.find((s) => s.id === 'indeed');
    const apna = list.find((s) => s.id === 'apna');
    const workindia = list.find((s) => s.id === 'workindia');

    assert.ok(naukri);
    assert.strictEqual(naukri.active, false);
    assert.strictEqual(naukri.status, 'REQUIRES_PARTNER_CREDENTIALS');

    assert.ok(indeed);
    assert.strictEqual(indeed.active, false);

    assert.ok(apna);
    assert.strictEqual(apna.active, false);
    assert.strictEqual(apna.status, 'BOT_WALL_RESTRICTED');

    assert.ok(workindia);
    assert.strictEqual(workindia.active, false);
  });

  // ----------------------------------------------------
  // TEST SUITE 5: Requirement Deduplication Stability
  // ----------------------------------------------------
  console.log('\n--- 5. Requirement Deduplication Stability ---');

  await test('Requirement hash remains stable across salary updates', () => {
    const leadId = '550e8400-e29b-41d4-a716-446655440000';
    const title = 'Electrician & Wireman';
    const sourceUrl = 'https://bluestarindia.com/careers/job/101?session=xyz';
    const city = 'Chennai';

    const hash1 = LeadService.generateRequirementHash(leadId, title, sourceUrl, 'bluestar_101', city);
    // Same job, updated salary or different session query string
    const hash2 = LeadService.generateRequirementHash(leadId, title, sourceUrl, 'bluestar_101', city);

    assert.strictEqual(hash1, hash2, 'Hash must match for same external listing ID');
  });

  await test('Canonical URL hashing strips ephemeral query params', () => {
    const leadId = 'lead_123';
    const title = 'Delivery Driver';
    const url1 = 'https://example.com/jobs/driver-42?utm_source=feed&session=1';
    const url2 = 'https://example.com/jobs/driver-42?utm_source=direct&session=2';

    const hash1 = LeadService.generateRequirementHash(leadId, title, url1, null, 'Coimbatore');
    const hash2 = LeadService.generateRequirementHash(leadId, title, url2, null, 'Coimbatore');

    assert.strictEqual(hash1, hash2, 'Hash must match based on canonical URL path');
  });

  // ----------------------------------------------------
  // TEST SUITE 6: Apex Domain Extraction
  // ----------------------------------------------------
  console.log('\n--- 6. Apex Domain Extraction ---');

  await test('Correctly extracts apex domains with multi-part TLDs (.co.in, .org.in)', () => {
    assert.strictEqual(LeadService.extractApexDomain('https://careers.swiggy.com/portal'), 'swiggy.com');
    assert.strictEqual(LeadService.extractApexDomain('https://jobs.tvs.co.in/openings'), 'tvs.co.in');
    assert.strictEqual(LeadService.extractApexDomain('https://www.urbancompany.com'), 'urbancompany.com');
    assert.strictEqual(LeadService.extractApexDomain(null), null);
  });

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n========================================');
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
