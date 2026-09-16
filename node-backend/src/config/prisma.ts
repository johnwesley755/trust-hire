import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Required for neon serverless driver to work in node environments.
// In edge environments (like Cloudflare Workers), native WebSocket is used automatically.
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

let prismaInstance: any = null;

const getPrisma = () => {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in the environment.");
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(pool);
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
