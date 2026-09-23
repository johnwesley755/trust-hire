import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Ensure WebSocket constructor is set in Node.js environments (Workers provide global WebSocket)
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }
  
  // Use Neon WebSocket adapter only if connecting to Neon Cloud
  if (dbUrl.includes('neon.tech')) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  // Standard Local / Direct PostgreSQL Connection with connection pooling
  let finalUrl = dbUrl;
  if (!finalUrl.includes('connection_limit')) {
    finalUrl += finalUrl.includes('?') ? '&connection_limit=10' : '?connection_limit=10';
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: finalUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

