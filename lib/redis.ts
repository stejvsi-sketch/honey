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
      limiter: Ratelimit.slidingWindow(999, '1 d'), // TEMP: 999 for testing (was 6)
      analytics: true,
      prefix: 'hio:ratelimit',
    });
  }
  return ratelimit;
}


