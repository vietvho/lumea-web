import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Global singleton for Next.js hot-reloading
const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('error', (err) => {
  console.error('[Redis Web] Connection Error:', err);
});

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};
