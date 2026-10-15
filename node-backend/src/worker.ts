import app from './app';
import { requestContextStorage, RequestScope } from './config/prisma';

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const store: RequestScope = { env, ctx };
    return requestContextStorage.run(store, async () => {
      try {
        return await app.fetch(request, env, ctx);
      } finally {
        if (store.pool) {
          ctx?.waitUntil?.(store.pool.end());
        }
      }
    });
  },
};

