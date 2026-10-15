import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { AsyncLocalStorage } from 'node:async_hooks';

// Ensure WebSocket constructor is set in Node.js environments (Workers provide global WebSocket)
if (typeof WebSocket === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

export interface RequestScope {
  prisma?: PrismaClient;
  pool?: Pool;
  env?: any;
  ctx?: any;
}

export const requestContextStorage = new AsyncLocalStorage<RequestScope>();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let cachedLocalPrisma: PrismaClient | null = globalForPrisma.prisma || null;

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
  const store = requestContextStorage.getStore();

  // 1. If running within a Cloudflare Workers request context
  if (store) {
    if (store.prisma) {
      return store.prisma;
    }

    const rawUrl = store.env?.DATABASE_URL || process.env.DATABASE_URL || (globalThis as any).DATABASE_URL;
    if (!rawUrl) {
      return new PrismaClient();
    }

    let dbUrl = rawUrl;
    if (dbUrl.includes('neon.tech')) {
      if (!dbUrl.includes('connect_timeout=')) {
        dbUrl += dbUrl.includes('?') ? '&connect_timeout=15' : '?connect_timeout=15';
      }

      // Create a fresh Neon Pool bound to THIS specific request's execution context
      const pool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 30000,
      });

      store.pool = pool;

      const adapter = new PrismaNeon(pool);
      const baseClient = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });

      const clientWithRetry = attachRetryExtension(baseClient);
      store.prisma = clientWithRetry;
      return clientWithRetry;
    }
  }

  // 2. Fallback for non-request environments (e.g. Node.js local dev server, seeds, migrations)
  if (cachedLocalPrisma) {
    return cachedLocalPrisma;
  }

  const rawUrl = process.env.DATABASE_URL || (globalThis as any).process?.env?.DATABASE_URL || (globalThis as any).DATABASE_URL;
  if (!rawUrl) {
    return new PrismaClient();
  }

  let dbUrl = rawUrl;
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
    cachedLocalPrisma = attachRetryExtension(baseClient);
    return cachedLocalPrisma;
  } else {
    // Standard Local PostgreSQL Connection with connection pooling
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
    cachedLocalPrisma = attachRetryExtension(baseClient);
    globalForPrisma.prisma = cachedLocalPrisma;
    return cachedLocalPrisma;
  }
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

