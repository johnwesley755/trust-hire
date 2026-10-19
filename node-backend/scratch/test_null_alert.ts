import prisma from '../src/config/prisma';
import { SearchAlertService } from '../src/services/searchAlertService';

async function test() {
  console.log('Model exists:', !!(prisma as any).user_search_alerts);
  const userId = '0000cc9b-f776-4149-b26d-6aca402f0348';
  
  const a1 = await SearchAlertService.createAlert({
    userId,
    alertType: 'JOB_ALERT',
    city: undefined,
    category: undefined,
    query: undefined,
    minSalary: undefined,
    frequency: 'INSTANT'
  });
  console.log('A1 id:', a1.id);

  const a2 = await SearchAlertService.createAlert({
    userId,
    alertType: 'JOB_ALERT',
    city: undefined,
    category: undefined,
    query: undefined,
    minSalary: undefined,
    frequency: 'INSTANT'
  });
  console.log('A2 id:', a2.id);
  console.log('Match?', a1.id === a2.id);
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
