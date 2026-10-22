import assert from 'node:assert';

const BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8787';

async function runApiTestSuite() {
  console.log('================================================================');
  console.log('🔥 TRUSTHYRE HTTP API TEST SUITE (LIVE ENDPOINTS ONLY)');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  async function apiTest(name: string, fn: () => Promise<void>) {
    try {
      console.log(`▶ Running: ${name}...`);
      await fn();
      console.log(`  ✅ PASS: ${name}\n`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}\n`);
      failed++;
    }
  }

  let adminToken = '';
  let testLeadId = '';

  // -------------------------------------------------------------
  // TEST 1: Administrator Authentication (Real Login Endpoint)
  // -------------------------------------------------------------
  await apiTest('POST /api/auth/login — Authenticate as Administrator', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@trusthyre.com',
        password: 'admin12345',
        role: 'ADMIN',
      }),
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data?.token, 'Response must contain a JWT token');
    assert.strictEqual(json.data?.user?.role, 'ADMIN', 'User role must be ADMIN');

    adminToken = json.data.token;
    console.log(`     Obtained Admin Bearer Token (${adminToken.slice(0, 20)}...)`);
  });

  const authHeaders = () => ({
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  });

  // -------------------------------------------------------------
  // TEST 2: Security Gate (Unauthorized & Forbidden Access)
  // -------------------------------------------------------------
  await apiTest('GET /api/admin/leads/sources — Reject Unauthenticated Requests', async () => {
    const resNoToken = await fetch(`${BASE_URL}/api/admin/leads/sources`);
    assert.strictEqual(resNoToken.status, 401, 'Must return 401 when no token is provided');

    const resBadToken = await fetch(`${BASE_URL}/api/admin/leads/sources`, {
      headers: { Authorization: 'Bearer invalid.token.signature' },
    });
    assert.strictEqual(resBadToken.status, 403, 'Must return 403 for invalid token signature');
  });

  // -------------------------------------------------------------
  // TEST 3: Discovery Sources Registry Endpoint
  // -------------------------------------------------------------
  await apiTest('GET /api/admin/leads/sources — Fetch Compliant Source Registry', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads/sources`, {
      headers: authHeaders(),
    });

    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);

    const sources = json.data || json.sources;
    assert.ok(Array.isArray(sources), 'Sources must be an array');
    assert.strictEqual(sources.length, 7, 'Expected 7 registered discovery adapters');

    // Verify Active Sources
    const lever = sources.find((s: any) => s.id === 'lever-ats');
    assert.ok(lever, 'Lever adapter must exist');
    assert.strictEqual(lever.active, true);
    assert.strictEqual(lever.status, 'ACTIVE');

    const gh = sources.find((s: any) => s.id === 'greenhouse-ats');
    assert.ok(gh, 'Greenhouse adapter must exist');
    assert.strictEqual(gh.active, true);

    const schemaOrg = sources.find((s: any) => s.id === 'schema-org-career');
    assert.ok(schemaOrg, 'Schema.org adapter must exist');
    assert.strictEqual(schemaOrg.active, true);

    // Verify Restricted Sources (Honest terms-of-service compliance)
    const naukri = sources.find((s: any) => s.id === 'naukri');
    assert.ok(naukri, 'Naukri adapter must exist');
    assert.strictEqual(naukri.active, false);
    assert.strictEqual(naukri.status, 'REQUIRES_PARTNER_CREDENTIALS');

    const apna = sources.find((s: any) => s.id === 'apna');
    assert.ok(apna, 'Apna adapter must exist');
    assert.strictEqual(apna.active, false);
    assert.strictEqual(apna.status, 'BOT_WALL_RESTRICTED');

    console.log(`     Verified 7 sources: 3 active feeds, 4 compliant restricted feeds`);
  });

  // -------------------------------------------------------------
  // TEST 4: Lead Stats Endpoint
  // -------------------------------------------------------------
  await apiTest('GET /api/admin/leads/stats — Fetch Funnel & Conversion Stats', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads/stats`, {
      headers: authHeaders(),
    });

    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    const stats = json.data || json.stats;
    assert.ok(stats && 'totalLeads' in stats, 'Must contain totalLeads count');
  });

  // -------------------------------------------------------------
  // TEST 5: Lead List Endpoint with Filters & Pagination
  // -------------------------------------------------------------
  await apiTest('GET /api/admin/leads — Fetch Leads with Pagination', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads?page=1&limit=5`, {
      headers: authHeaders(),
    });

    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    const leads = json.data?.leads || json.leads || [];
    assert.ok(Array.isArray(leads), 'Expected leads array');
    console.log(`     Found ${leads.length} leads in current page`);
  });

  // -------------------------------------------------------------
  // TEST 6: SSRF Attack Vectors on Single URL Crawl
  // -------------------------------------------------------------
  await apiTest('POST /api/admin/leads/crawl-url — SSRF Protection Defense Verification', async () => {
    const attackPayloads = [
      { name: 'Localhost Web Port', url: 'http://localhost:8787/api/admin/leads' },
      { name: 'IPv4 Loopback 127.0.0.1', url: 'https://127.0.0.1/admin' },
      { name: 'Cloud Instance Metadata Service', url: 'https://169.254.169.254/latest/meta-data/' },
      { name: 'Private Subnet 10.x.x.x', url: 'https://10.0.0.1/internal' },
      { name: 'Private Subnet 192.168.x.x', url: 'https://192.168.1.1/router' },
      { name: 'Decimal Integer IP', url: 'https://2130706433/admin' },
      { name: 'Arbitrary File Protocol', url: 'file:///etc/passwd' },
      { name: 'Plain HTTP Insecure Protocol', url: 'http://careers.swiggy.com/jobs' },
    ];

    for (const testCase of attackPayloads) {
      const res = await fetch(`${BASE_URL}/api/admin/leads/crawl-url`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ url: testCase.url }),
      });

      assert.strictEqual(
        res.status,
        400,
        `Attack payload "${testCase.name}" (${testCase.url}) must return 400 Bad Request, got ${res.status}`
      );
      const json = (await res.json()) as any;
      assert.strictEqual(json.success, false);
      assert.match(json.message || json.error, /SSRF|Insecure|blocked|protocol|restricted/i);
      console.log(`     🛡️ Successfully blocked: ${testCase.name} -> ${json.message || json.error}`);
    }
  });

  // -------------------------------------------------------------
  // TEST 7: Ingest Genuine Lead with Zero Fabrication
  // -------------------------------------------------------------
  await apiTest('POST /api/admin/leads/ingest — Ingest Lead with Zero Fabrication', async () => {
    const timestamp = Date.now();
    const payload = {
      companyName: `Speedy Wheels Logistics ${timestamp}`,
      companyWebsite: `https://speedywheels${timestamp}.in`,
      industry: 'Logistics & Delivery',
      city: 'Coimbatore',
      officialEmail: `recruitment@speedywheels${timestamp}.in`,
      officialPhone: '0422-4556778',
      requirements: [
        {
          title: 'Heavy Commercial Vehicle Driver',
          category: 'Logistics & Delivery',
          city: 'Coimbatore',
          salaryRange: '₹22,000 - ₹28,000 / month',
          workersNeeded: 3,
          sourceName: 'Career Page (Schema.org)',
          sourceUrl: `https://speedywheels${timestamp}.in/careers/hcv-driver`,
          externalListingId: `speedy_${timestamp}_01`,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/admin/leads/ingest`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    assert.ok([200, 201].includes(res.status), `Expected 200/201 OK, got ${res.status}`);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data?.lead?.id || json.lead?.id, 'Lead ID must be returned');

    testLeadId = json.data?.lead?.id || json.lead?.id;
    console.log(`     Created Lead ID: ${testLeadId}`);
  });

  // -------------------------------------------------------------
  // TEST 8: 1-Click Employer Conversion & Job Synchronization
  // -------------------------------------------------------------
  await apiTest('POST /api/admin/leads/:id/convert — 1-Click Convert to Employer & Job Sync', async () => {
    assert.ok(testLeadId, 'Lead ID from previous step required');

    const res = await fetch(`${BASE_URL}/api/admin/leads/${testLeadId}/convert`, {
      method: 'POST',
      headers: authHeaders(),
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.employerId, 'Must return converted employerId');
    assert.ok(json.userId, 'Must return converted userId');
    assert.strictEqual(json.publishedJobsCount, 1, 'Must clone 1 requirement to live marketplace jobs');

    console.log(`     Successfully converted to Employer ID: ${json.employerId}`);
    console.log(`     Marketplace Jobs Published: ${json.publishedJobsCount}`);
  });

  // -------------------------------------------------------------
  // TEST 9: Auto-Discovery Pipeline Execution
  // -------------------------------------------------------------
  await apiTest('POST /api/admin/leads/run-discovery — Trigger Discovery Scan Pipeline', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/leads/run-discovery`, {
      method: 'POST',
      headers: authHeaders(),
    });

    assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok('sourcesScanned' in json, 'Must report sourcesScanned metric');
    assert.ok('durationMs' in json, 'Must report durationMs metric');
    assert.ok(Array.isArray(json.logs), 'Must return structured diagnostic logs');

    console.log(`     Discovery executed: ${json.sourcesScanned} sources scanned in ${json.durationMs}ms`);
    console.log(`     Diagnostic logs received: ${json.logs.length} structured events`);
  });

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('================================================================');
  console.log(`API TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runApiTestSuite().catch((err) => {
  console.error('Fatal API Suite Error:', err);
  process.exit(1);
});
