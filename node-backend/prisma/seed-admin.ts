import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@trusthyre.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin12345';
  const adminFirstName = 'Super';
  const adminLastName = 'Admin';

  console.log(`Checking existing admin user: ${adminEmail}...`);

  const existing = await prisma.user_metadata.findUnique({
    where: { email: adminEmail }
  });

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  if (existing) {
    console.log(`User ${adminEmail} already exists. Updating role to ADMIN and syncing password...`);
    await prisma.user_metadata.update({
      where: { id: existing.id },
      data: {
        role: 'ADMIN',
        password_hash: passwordHash,
        email_verified: true,
        onboarded: true,
        updated_at: new Date()
      }
    });
    console.log(`Successfully updated ${adminEmail} to ADMIN.`);
  } else {
    console.log(`Creating fresh admin user: ${adminEmail}...`);
    await prisma.user_metadata.create({
      data: {
        id: uuidv4(),
        email: adminEmail,
        password_hash: passwordHash,
        first_name: adminFirstName,
        last_name: adminLastName,
        role: 'ADMIN',
        email_verified: true,
        onboarded: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    console.log(`Successfully created Super Admin: ${adminEmail}`);
  }

  console.log('\n=======================================');
  console.log(' TRUSTHYRE SUPER ADMIN CREDENTIALS:');
  console.log(` Email:    ${adminEmail}`);
  console.log(` Password: ${adminPassword}`);
  console.log(' Portal:   /admin/login');
  console.log('=======================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
