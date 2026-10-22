import 'dotenv/config';
import assert from 'node:assert';
import { LeadService } from '../src/services/leadService';
import { prisma } from '../src/config/prisma';

async function testLeadConversion() {
  console.log('🧪 Starting Lead Ingestion & 1-Click Conversion Verification...');

  const uniqueSuffix = Date.now();
  const testCompanyName = `Apex Logistics Test ${uniqueSuffix}`;
  const testWebsite = `https://apexlogistics${uniqueSuffix}.in`;

  // 1. Ingest a Discovered Lead with zero fabrication
  console.log('\n--> Ingesting test lead...');
  const ingested = await LeadService.ingestLead({
    companyName: testCompanyName,
    companyWebsite: testWebsite,
    companyDomain: `apexlogistics${uniqueSuffix}.in`,
    city: 'Coimbatore',
    industry: 'Logistics & Delivery',
    officialEmail: `careers@apexlogistics${uniqueSuffix}.in`,
    officialPhone: '0422-2999888',
    requirements: [
      {
        title: 'Heavy Vehicle Delivery Pilot',
        category: 'Logistics & Delivery',
        city: 'Coimbatore',
        salaryRange: '₹22,000 - ₹30,000 / month',
        sourceName: 'Career Page (Schema.org)',
        sourceUrl: `${testWebsite}/careers/pilot-42`,
        externalListingId: `apex_${uniqueSuffix}_01`,
      }
    ]
  });

  assert.ok(ingested.lead, 'Lead should be created');
  assert.strictEqual(ingested.lead.company_name, testCompanyName);
  assert.strictEqual(ingested.lead.city, 'Coimbatore');
  assert.strictEqual(ingested.requirements.length, 1);
  assert.strictEqual(ingested.requirements[0].title, 'Heavy Vehicle Delivery Pilot');
  assert.strictEqual(ingested.requirements[0].salary_range, '₹22,000 - ₹30,000 / month');
  console.log(`  ✅ Ingested lead ID: ${ingested.lead.id} with requirement ID: ${ingested.requirements[0].id}`);

  // 2. Perform 1-Click Conversion to Live TrustHire Employer
  console.log('\n--> Converting Lead to Live Employer...');
  const conversionResult = await LeadService.convertLeadToEmployer(ingested.lead.id);

  assert.ok(conversionResult.userId, 'User record must be created');
  assert.ok(conversionResult.employerId, 'Employer profile must be created');
  assert.strictEqual(conversionResult.email, `careers@apexlogistics${uniqueSuffix}.in`);
  assert.strictEqual(conversionResult.publishedJobsCount, 1, 'Requirement must be cloned to live jobs');

  // Verify created live job in database
  const liveJobs = await prisma.jobs.findMany({
    where: { employer_id: conversionResult.userId }
  });
  assert.strictEqual(liveJobs.length, 1);
  const liveJob = liveJobs[0];
  assert.strictEqual(liveJob.title, 'Heavy Vehicle Delivery Pilot');
  assert.strictEqual(liveJob.city, 'Coimbatore');
  assert.strictEqual(liveJob.employer_name, testCompanyName);
  assert.strictEqual(liveJob.status, 'OPEN');
  assert.strictEqual(Number(liveJob.budget), 22000); // parsed correctly from ₹22,000 min

  console.log(`  ✅ Successfully converted lead to Employer ID: ${conversionResult.employerId}`);
  console.log(`  ✅ Published live marketplace job ID: ${liveJob.id} ("${liveJob.title}")`);

  // 3. Verify lead status was updated to ONBOARDED
  const updatedLead = await prisma.employer_leads.findUnique({
    where: { id: ingested.lead.id }
  });
  assert.strictEqual(updatedLead?.status, 'ONBOARDED');
  assert.strictEqual(updatedLead?.trusthire_employer_id, conversionResult.employerId);
  console.log('  ✅ Lead status correctly transitioned to ONBOARDED');

  // Clean up test records
  console.log('\n--> Cleaning up test entities...');
  await prisma.job_search_index.deleteMany({ where: { job_id: liveJob.id } });
  await prisma.jobs.deleteMany({ where: { id: liveJob.id } });
  await prisma.employer_lead_requirements.deleteMany({ where: { lead_id: ingested.lead.id } });
  await prisma.employer_leads.delete({ where: { id: ingested.lead.id } });
  await prisma.employer_profiles.deleteMany({ where: { id: conversionResult.employerId } });
  await prisma.user_metadata.deleteMany({ where: { id: conversionResult.userId } });
  console.log('  ✅ Cleanup complete');

  console.log('\n🎉 ALL CONVERSION TESTS PASSED PERFECTLY!\n');
}

testLeadConversion().catch((err) => {
  console.error('\n❌ Conversion Test Failed:', err);
  process.exit(1);
});
