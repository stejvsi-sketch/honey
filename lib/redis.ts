import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error('Missing Upstash Redis environment variables');
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

export function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(6, '1 d'), // 6 submits per day
      analytics: true,
      prefix: 'hio:ratelimit',
    });
  }
  return ratelimit;
}

// Cache helpers with 5-hour TTL
const CACHE_TTL = 18000; // 5 hours

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const r = getRedis();
    const data = await r.get<T>(`hio:cache:${key}`);
    return data;
  } catch {
    return null;
  }
}

export async function setCache<T>(key: string, data: T, ttl = CACHE_TTL): Promise<void> {
  try {
    const r = getRedis();
    await r.set(`hio:cache:${key}`, data, { ex: ttl });
  } catch {
    // Cache write failure is non-fatal
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const r = getRedis();
    let cursor = 0 as number | string;
    do {
      const result = await r.scan(cursor as number, { match: `hio:cache:${pattern}`, count: 100 });
      cursor = Number(result[0]);
      const keys = result[1] as string[];
      if (keys.length > 0) {
        await r.del(...keys);
      }
    } while (cursor !== 0);
  } catch {
    // Cache invalidation failure is non-fatal
  }
}
