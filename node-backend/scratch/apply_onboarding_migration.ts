import prisma from '../src/config/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Applying onboarding & resume schema migration...');
  const sql = fs.readFileSync(path.join(__dirname, '../migrations/add_onboarding_and_resume_fields.sql'), 'utf-8');
  
  // Split statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    console.log('Executing:', stmt.slice(0, 60) + '...');
    await prisma.$executeRawUnsafe(stmt);
  }

  console.log('Migration completed successfully!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
