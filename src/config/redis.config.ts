// src/config/redis.config.ts

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Connection pools for different purposes
export const redisConnections = {
  // Main cache connection
  cache: {
    ...redisConfig,
    keyPrefix: 'cache:',
  },

  // Pub/Sub connections (separate from cache for performance)
  publisher: {
    ...redisConfig,
    keyPrefix: 'pub:',
  },

  subscriber: {
    ...redisConfig,
    keyPrefix: 'sub:',
  },

  // Locking mechanism
  lock: {
    ...redisConfig,
    keyPrefix: 'lock:',
    db: 1, // Use different DB for locks
  },

  // Session/Queue related
  session: {
    ...redisConfig,
    keyPrefix: 'session:',
    db: 2,
  },
};
