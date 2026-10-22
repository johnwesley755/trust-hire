async function testPorter() {
  const ghRes = await fetch('https://boards-api.greenhouse.io/v1/boards/porter/jobs');
  const ghData = await ghRes.json() as any;
  console.log('Porter Greenhouse jobs count:', ghData.jobs?.length);
  if (ghData.jobs?.length > 0) {
    console.log('Sample job:', JSON.stringify(ghData.jobs[0], null, 2));
  }

  const leverRes = await fetch('https://api.lever.co/v0/postings/porter?mode=json');
  const leverData = await leverRes.json() as any[];
  console.log('\nPorter Lever jobs count:', leverData?.length);
  if (leverData?.length > 0) {
    console.log('Sample Lever job:', JSON.stringify(leverData[0], null, 2));
  }
}
testPorter().catch(console.error);
