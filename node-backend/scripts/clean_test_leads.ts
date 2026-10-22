import { prisma } from '../src/config/prisma';

async function main() {
  const allLeads = await prisma.employer_leads.findMany({
    select: { id: true, company_name: true, company_website: true }
  });
  console.log('Current leads in DB:', allLeads.length);
  for (const l of allLeads) {
    console.log(`- ${l.company_name} (${l.company_website})`);
  }

  const testLeads = await prisma.employer_leads.findMany({
    where: {
      OR: [
        { company_name: { contains: 'Speedy Wheels' } },
        { company_name: { contains: 'Apex Logistics Test' } }
      ]
    },
    select: { id: true, company_name: true }
  });
  const testLeadIds = testLeads.map(l => l.id);

  const deletedJobs = await prisma.jobs.deleteMany({
    where: { employer_name: { contains: 'Speedy Wheels' } }
  });
  const deletedReqs = await prisma.employer_lead_requirements.deleteMany({
    where: { lead_id: { in: testLeadIds } }
  });
  const deletedLeads = await prisma.employer_leads.deleteMany({
    where: { id: { in: testLeadIds } }
  });
  console.log(`Deleted Speedy Wheels test leads: ${deletedLeads.count}, reqs: ${deletedReqs.count}, jobs: ${deletedJobs.count}`);
}

main().catch(console.error);
