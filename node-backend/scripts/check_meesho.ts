async function checkMeesho() {
  const res = await fetch('https://api.lever.co/v0/postings/meesho?mode=json&limit=2');
  const data = await res.json() as any[];
  for (const j of data) {
    console.log(j.text, '->', j.hostedUrl);
  }
}
checkMeesho();
