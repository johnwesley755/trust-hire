import jwt from 'jsonwebtoken';

async function testLiveDiscovery() {
  const token = jwt.sign(
    { userId: 'admin', role: 'ADMIN' },
    process.env.JWT_SECRET || 'Q7mV2f8YbKc6n4GxR1Pz9TqJ5sH3W8dL0uCkE2aB7yFvM6rN1tX4pS9ZgH5jU3w'
  );

  console.log('Triggering Auto-Discovery via API...');
  const res = await fetch('http://127.0.0.1:8787/api/admin/leads/run-discovery', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json() as any;
  console.log('Discovery Response:');
  console.log('Success:', json.success);
  console.log('New Leads Count:', json.newLeadsCount);
  console.log('Total Scanned:', json.totalScanned);
  console.log('Source Breakdown:', JSON.stringify(json.sourceBreakdown, null, 2));

  if (json.results?.length > 0) {
    console.log('\nDiscovered Leads in DB:');
    for (const r of json.results) {
      console.log(`- ${r.lead.company_name} (${r.lead.company_website})`);
      for (const req of r.requirements) {
        console.log(`    Opening: ${req.title} -> URL: ${req.source_url}`);
      }
    }
  }
}

testLiveDiscovery().catch(console.error);
