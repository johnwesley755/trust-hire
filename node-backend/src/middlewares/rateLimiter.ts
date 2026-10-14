import { Context, Next } from 'hono';
import { ApiResponse } from '../utils/ApiResponse';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (c: Context) => string | Promise<string>;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
    keyGenerator
  } = options;

  const hits = new Map<string, ClientRecord>();

  return async (c: Context, next: Next) => {
    const now = Date.now();

    // Lazy cleanup inside request handler to prevent memory leaks without global scope timers
    if (hits.size > 100) {
      for (const [k, record] of hits.entries()) {
        if (now > record.resetTime) {
          hits.delete(k);
        }
      }
    }

    let key: string;
    if (keyGenerator) {
      key = await keyGenerator(c);
    } else {
      const forwarded = c.req.header('x-forwarded-for');
      const ip = (forwarded ? forwarded.split(',')[0].trim() : '') ||
                 c.req.header('x-real-ip') ||
                 '127.0.0.1';
      key = `${c.req.path}:${ip}`;
    }

    let record = hits.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      hits.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(remaining));
    c.header('X-RateLimit-Reset', String(Math.ceil(record.resetTime / 1000)));

    if (record.count > max) {
      c.header('Retry-After', String(retryAfterSeconds));
      return c.json(
        ApiResponse.error(message, { retryAfter: retryAfterSeconds }),
        429 as any
      );
    }

    await next();
  };
};

export const otpLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many OTP requests. Please wait 15 minutes before requesting again.'
});

export const loginLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many login attempts. Please wait a minute before trying again.'
});

export const authActionLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Too many authentication attempts. Please try again later.'
});
