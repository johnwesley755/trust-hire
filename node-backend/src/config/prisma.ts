import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

let prismaInstance: any = null;

const getPrisma = () => {
  if (!prismaInstance) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined in the environment.");
    }
    const sql = neon(dbUrl);
    const adapter = new PrismaNeonHTTP(sql);
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
