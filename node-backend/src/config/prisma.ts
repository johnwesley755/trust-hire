import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Ensure WebSocket constructor is set in Node.js environments (Workers provide global WebSocket)
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const getPrisma = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }
  const pool = new Pool({ connectionString: dbUrl });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

// Use a Proxy so each operation creates a client bound to the current execution context,
// preventing Cloudflare Workers cross-request I/O errors while supporting full Prisma type conversion & transactions.
const prisma = new Proxy({}, {
  get: (target, prop) => {
    const client = getPrisma();
    return (client as any)[prop];
  }
}) as unknown as PrismaClient;

export default prisma;
