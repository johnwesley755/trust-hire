import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prismaInstance: any = null;

const getPrisma = () => {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in the environment.");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return prismaInstance;
};

// Use a Proxy to lazily instantiate PrismaClient upon first property access.
// This ensures that process.env.DATABASE_URL is fully populated by Hono's middleware
// before Prisma attempts to connect.
const prisma = new Proxy({}, {
  get: (target, prop) => {
    return getPrisma()[prop];
  }
}) as unknown as PrismaClient;

export default prisma;
