async function testMore() {
  const checkList = ['delhivery', 'shiprocket', 'bigbasket', 'ola', 'ather', 'udaan', 'ninjacart', 'elasticrun', 'blackbuck', 'rivigo', 'lenskart', 'urban-company'];
  console.log('Testing Lever:');
  for (const s of checkList) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${s}?mode=json&limit=1`);
      if (res.status === 200) console.log(`  ✅ Lever ${s}`);
    } catch {}
  }
  console.log('Testing Greenhouse:');
  for (const s of checkList) {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${s}/jobs`);
      if (res.status === 200) console.log(`  ✅ Greenhouse ${s}`);
    } catch {}
  }
}
testMore().catch(console.error);
