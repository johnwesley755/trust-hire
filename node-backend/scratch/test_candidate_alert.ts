import prisma from '../src/config/prisma';
import { SearchAlertService } from '../src/services/searchAlertService';

async function runTest() {
  console.log('🧪 [TEST-RUNNER] Starting Talent Search Alert & Notification Pipeline Verification...\n');

  try {
    // 1. Locate an employer or test user
    const employer = await prisma.user_metadata.findFirst({
      where: { role: 'EMPLOYER' }
    }) || await prisma.user_metadata.findFirst();

    if (!employer) {
      console.error('❌ No user found in database to run verification test.');
      process.exit(1);
    }

    console.log(`👤 Using test employer: ${employer.first_name || 'Employer'} (${employer.id})`);

    // 2. Test Alert Creation & Deduplication
    console.log('\n--- Step 1: Testing Alert Creation & Deduplication ---');
    const alertData = {
      userId: employer.id,
      alertType: 'CANDIDATE_ALERT' as const,
      title: 'Test Electrician Talent Alert',
      city: 'Chennai',
      category: 'Electrician',
      frequency: 'INSTANT' as const
    };

    const firstAlert = await SearchAlertService.createAlert(alertData);
    console.log(`✅ Alert created/fetched with ID: ${firstAlert.id}`);

    const duplicateAlert = await SearchAlertService.createAlert(alertData);
    console.log(`✅ Second creation attempt returned ID: ${duplicateAlert.id}`);

    if (firstAlert.id === duplicateAlert.id) {
      console.log('🎉 [PASS] Idempotency confirmed: No duplicate alert created!');
    } else {
      console.error('❌ [FAIL] Deduplication failed: Duplicate alert created.');
      process.exit(1);
    }

    // 3. Test Nationwide Alert Creation
    console.log('\n--- Step 2: Testing Nationwide (All Locations) Alert ---');
    const nationwideAlert = await SearchAlertService.createAlert({
      userId: employer.id,
      alertType: 'CANDIDATE_ALERT' as const,
      title: 'All Locations Construction Specialists',
      city: undefined,
      category: 'Construction',
      frequency: 'INSTANT' as const
    });
    console.log(`✅ Nationwide alert created/fetched with ID: ${nationwideAlert.id} (city=${nationwideAlert.city || 'NULL - Nationwide'})`);

    // 4. Test Reverse Candidate Matching & Notification Creation
    console.log('\n--- Step 3: Testing Candidate Reverse-Match Simulation ---');
    const simResult = await SearchAlertService.simulateCandidateMatchForUser(employer.id);
    console.log(`✅ Candidate match simulation completed:`, {
      mockCandidateName: simResult.mockCandidate.name,
      mockCandidateSkills: simResult.mockCandidate.skills,
      mockCandidateCity: simResult.mockCandidate.city,
      notificationId: simResult.notification?.id
    });

    // 5. Verify Notification in Database
    console.log('\n--- Step 4: Verifying In-App Bell Notification in PostgreSQL ---');
    const latestNotification = await prisma.notifications.findFirst({
      where: {
        user_id: employer.id,
        type: 'CANDIDATE_MATCH_ALERT'
      },
      orderBy: { created_at: 'desc' }
    });

    if (latestNotification) {
      console.log(`✅ Notification found in DB:`, {
        id: latestNotification.id,
        title: latestNotification.title,
        message: latestNotification.message,
        type: latestNotification.type,
        is_read: latestNotification.is_read,
        link: latestNotification.link
      });
      console.log('🎉 [PASS] End-to-end notification delivery verified!');
    } else {
      console.error('❌ [FAIL] Notification was not found in database.');
      process.exit(1);
    }

    console.log('\n======================================================');
    console.log('🏆 ALL TESTS PASSED: Talent search alert & notification pipeline verified successfully!');
    console.log('======================================================\n');
  } catch (err: any) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
