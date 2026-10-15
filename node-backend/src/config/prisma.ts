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

const attachRetryExtension = (client: PrismaClient): PrismaClient => {
  return (client as any).$extends({
    query: {
      async $allOperations({ operation, model, args, query }: any) {
        let attempts = 3;
        let delay = 600;

        while (attempts > 0) {
          try {
            return await query(args);
          } catch (error: any) {
            const errMsg = String(error?.message || '');
            const errCode = String((error as any)?.code || '');
            const isColdStartOrConnError =
              errCode === 'P1001' ||
              errCode === 'P1002' ||
              errCode === 'P1008' ||
              errCode === 'P1017' ||
              errMsg.includes("Can't reach database server") ||
              errMsg.includes("Connection terminated unexpectedly") ||
              errMsg.includes("connection closed") ||
              errMsg.includes("WebSocket") ||
              errMsg.includes("fetch failed") ||
              errMsg.includes("Server closed the connection") ||
              errMsg.includes("terminating connection due to administrator command");

            if (isColdStartOrConnError && attempts > 1) {
              attempts--;
              console.warn(`[Prisma/Neon] Transient DB connection/cold-start error (${errCode || errMsg.slice(0, 50)}). Retrying in ${delay}ms... (${attempts} retries remaining)`);
              await new Promise((res) => setTimeout(res, delay));
              delay *= 2;
              continue;
            }
            throw error;
          }
        }
      }
    }
  }) as unknown as PrismaClient;
};

const createPrismaClient = (): PrismaClient => {
  if (cachedPrisma) {
    return cachedPrisma;
  }

  const rawUrl = process.env.DATABASE_URL || (globalThis as any).process?.env?.DATABASE_URL || (globalThis as any).DATABASE_URL;
  if (!rawUrl) {
    // Return standard client or fallback if DATABASE_URL is not yet populated during bundle build/eval
    return new PrismaClient();
  }

  let dbUrl = rawUrl;
  
  // Use Neon WebSocket adapter only if connecting to Neon Cloud
  if (dbUrl.includes('neon.tech')) {
    if (!dbUrl.includes('connect_timeout=')) {
      dbUrl += dbUrl.includes('?') ? '&connect_timeout=15' : '?connect_timeout=15';
    }

    const pool = new Pool({
      connectionString: dbUrl,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
    });
    const adapter = new PrismaNeon(pool);
    const baseClient = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    cachedPrisma = attachRetryExtension(baseClient);
  } else {
    // Standard Local / Direct PostgreSQL Connection with connection pooling
    let finalUrl = dbUrl;
    if (!finalUrl.includes('connection_limit')) {
      finalUrl += finalUrl.includes('?') ? '&connection_limit=10' : '?connection_limit=10';
    }
    if (!finalUrl.includes('connect_timeout=')) {
      finalUrl += finalUrl.includes('?') ? '&connect_timeout=15' : '?connect_timeout=15';
    }

    const baseClient = new PrismaClient({
      datasources: {
        db: {
          url: finalUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    cachedPrisma = attachRetryExtension(baseClient);
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

