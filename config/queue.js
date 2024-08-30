export const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  Port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
};

export const defaultQueueConfig = {
  delay: 2000,
  removeOnComplete: true,
  removeOnFail: {
    count: 5,
    age: 1000 * 60 * 60 * 24, // 24 hours
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};
