import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Ensure WebSocket constructor is set in Node.js environments (Workers provide global WebSocket)
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let cachedPrisma: PrismaClient | null = globalForPrisma.prisma || null;

const createPrismaClient = (): PrismaClient => {
  if (cachedPrisma) {
    return cachedPrisma;
  }

  const dbUrl = process.env.DATABASE_URL || (globalThis as any).process?.env?.DATABASE_URL || (globalThis as any).DATABASE_URL;
  if (!dbUrl) {
    // Return standard client or fallback if DATABASE_URL is not yet populated during bundle build/eval
    return new PrismaClient();
  }
  
  // Use Neon WebSocket adapter only if connecting to Neon Cloud
  if (dbUrl.includes('neon.tech')) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaNeon(pool);
    cachedPrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } else {
    // Standard Local / Direct PostgreSQL Connection with connection pooling
    let finalUrl = dbUrl;
    if (!finalUrl.includes('connection_limit')) {
      finalUrl += finalUrl.includes('?') ? '&connection_limit=10' : '?connection_limit=10';
    }

    cachedPrisma = new PrismaClient({
      datasources: {
        db: {
          url: finalUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = cachedPrisma;
  }

  return cachedPrisma;
};

// Use Proxy for lazy evaluation so module import at deploy time doesn't throw if env is not yet bound
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = createPrismaClient();
    const val = Reflect.get(client, prop, receiver);
    return typeof val === 'function' ? val.bind(client) : val;
  }
});

export default prisma;

