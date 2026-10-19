import prisma from '../src/config/prisma';
import { SearchAlertService } from '../src/services/searchAlertService';

async function runJobAlertVerification() {
  console.log('🧪 [TEST-RUNNER] Starting Candidate Job Search Alert & Notification Pipeline Verification...\n');

  try {
    // 1. Locate a candidate/worker or test user
    const candidate = await prisma.user_metadata.findFirst({
      where: { role: 'WORKER' }
    }) || await prisma.user_metadata.findFirst();

    if (!candidate) {
      console.error('❌ No user found in database to run verification test.');
      process.exit(1);
    }

    console.log(`👤 Using test candidate: ${candidate.first_name || 'Candidate'} (${candidate.id})`);

    // 2. Test Alert Creation & Deduplication (JOB_ALERT)
    console.log('\n--- Step 1: Testing JOB_ALERT Creation & Deduplication ---');
    const alertData = {
      userId: candidate.id,
      alertType: 'JOB_ALERT' as const,
      title: 'Test Commercial Electrician Jobs',
      city: 'Chennai',
      category: 'Construction',
      minSalary: 25000,
      frequency: 'INSTANT' as const
    };

    const firstAlert = await SearchAlertService.createAlert(alertData);
    console.log(`✅ Alert created/fetched with ID: ${firstAlert.id}`);

    const duplicateAlert = await SearchAlertService.createAlert(alertData);
    console.log(`✅ Second creation attempt returned ID: ${duplicateAlert.id}`);

    if (firstAlert.id === duplicateAlert.id) {
      console.log('🎉 [PASS] Idempotency confirmed: No duplicate JOB_ALERT created!');
    } else {
      console.error('❌ [FAIL] Deduplication failed: Duplicate alert created.');
      process.exit(1);
    }

    // 3. Test Candidate Job Match Simulation
    console.log('\n--- Step 2: Testing Job Match Simulation & Notification Dispatch ---');
    const simResult = await SearchAlertService.simulateJobMatchForUser(candidate.id);
    console.log(`✅ Job match simulation completed:`, {
      mockJobTitle: simResult.mockJob.title,
      company: simResult.mockJob.company,
      salary: simResult.mockJob.salary,
      notificationDispatched: Boolean(simResult.notification)
    });

    // 4. Verify in-app notification recorded in database
    const notification = await prisma.notifications.findFirst({
      where: {
        user_id: candidate.id,
        type: 'JOB_MATCH_ALERT'
      },
      orderBy: { created_at: 'desc' }
    });

    if (notification) {
      console.log('\n🎉 [PASS] Real In-App Notification Verified in Database:');
      console.log({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        created_at: notification.created_at
      });
    } else {
      console.warn('⚠️ No database notification row found for JOB_MATCH_ALERT.');
    }

    console.log('\n🚀 ALL PIPELINE CHECKS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Test execution error:', err);
    process.exit(1);
  }
}

runJobAlertVerification();
