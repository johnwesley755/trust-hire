import 'dotenv/config';
import jwt from 'jsonwebtoken';
import assert from 'node:assert';

const PORT = process.env.PORT || 8787;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'Q7mV2f8YbKc6n4GxR1Pz9TqJ5sH3W8dL0uCkE2aB7yFvM6rN1tX4pS9ZgH5jU3w';

import app from '../src/app';

async function main() {
  console.log('🚀 Running Live End-to-End API Integration Verification against Hono Application Engine');

  // 1. Generate Admin Token
  const adminToken = jwt.sign(
    { userId: 'admin_test_user', email: 'admin@trusthire.in', role: 'ADMIN' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const authHeaders: Record<string, string> = {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };

  // Helper for app.fetch
  async function callApp(url: string, init?: RequestInit) {
    const req = new Request(`http://localhost${url}`, {
      ...init,
      headers: {
        ...authHeaders,
        ...(init?.headers as Record<string, string>),
      },
    });
    return app.fetch(req, process.env as any, {} as any);
  }

  // 2. Test GET /api/admin/leads/sources
  console.log('\n--> Testing GET /api/admin/leads/sources');
  const sourcesRes = await callApp('/api/admin/leads/sources');
  assert.strictEqual(sourcesRes.status, 200, `Expected 200 OK, got ${sourcesRes.status}`);
  const sourcesJson = await sourcesRes.json() as any;
  assert.strictEqual(sourcesJson.success, true);
  const sourcesList = sourcesJson.data || sourcesJson.sources;
  assert.ok(Array.isArray(sourcesList), 'Expected sources to be an array');

  console.log(`  Received ${sourcesList.length} registered discovery sources:`);
  for (const s of sourcesList) {
    console.log(`    - [${s.active ? 'ACTIVE' : 'RESTRICTED'}] ${s.name} (${s.id}) -> ${s.status}`);
    assert.strictEqual(typeof s.active, 'boolean', `Source ${s.id} active must be boolean`);
    assert.ok(s.id, 'Source must have an id');
  }

  // Verify key sources
  const lever = sourcesList.find((s: any) => s.id === 'lever-ats');
  const naukri = sourcesList.find((s: any) => s.id === 'naukri');
  assert.ok(lever && lever.active === true, 'Lever adapter must be present and active');
  assert.ok(naukri && naukri.active === false, 'Naukri adapter must be restricted');

  // 3. Test SSRF Rejection on POST /api/admin/leads/crawl-url
  console.log('\n--> Testing SSRF Rejection on POST /api/admin/leads/crawl-url');
  const ssrfRes = await callApp('/api/admin/leads/crawl-url', {
    method: 'POST',
    body: JSON.stringify({ url: 'http://localhost:8787/api/admin/leads' }),
  });
  const ssrfJson = await ssrfRes.json() as any;
  console.log('  SSRF test response status:', ssrfRes.status);
  console.log('  SSRF test response body:', JSON.stringify(ssrfJson));
  assert.strictEqual(ssrfRes.status, 400, 'Expected 400 Bad Request for SSRF target');
  assert.strictEqual(ssrfJson.success, false);
  assert.match(ssrfJson.message || ssrfJson.error, /SSRF|Insecure|blocked/i);

  // 4. Test POST /api/admin/leads/run-discovery execution
  console.log('\n--> Testing POST /api/admin/leads/run-discovery');
  const discoveryRes = await callApp('/api/admin/leads/run-discovery', {
    method: 'POST',
  });
  assert.strictEqual(discoveryRes.status, 200, `Expected 200 OK, got ${discoveryRes.status}`);
  const discoveryJson = await discoveryRes.json() as any;
  console.log('  Auto-Discovery Response:', JSON.stringify({
    success: discoveryJson.success,
    message: discoveryJson.message,
    leadsIngested: discoveryJson.leadsIngested,
    requirementsIngested: discoveryJson.requirementsIngested,
    sourcesScanned: discoveryJson.sourcesScanned,
    durationMs: discoveryJson.durationMs,
  }, null, 2));

  assert.strictEqual(discoveryJson.success, true);
  assert.ok(Array.isArray(discoveryJson.logs), 'Expected logs array in response');

  console.log('\n🎉 ALL LIVE INTEGRATION TESTS PASSED PERFECTLY!\n');
}

main().catch((err) => {
  console.error('\n❌ Integration Verification Failed:', err);
  process.exit(1);
});
