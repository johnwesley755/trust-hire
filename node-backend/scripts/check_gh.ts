async function checkGh() {
  const res = await fetch('https://boards-api.greenhouse.io/v1/boards/porter/jobs');
  const data = await res.json() as any;
  for (const j of data.jobs.slice(0, 3)) {
    console.log(j.title, '->', j.absolute_url);
  }
}
checkGh();
