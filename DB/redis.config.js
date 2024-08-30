import redis from "express-redis-cache";

const redisCache = redis({
  port: process.env.REDIS_PORT || 6379,
  host: "localhost",
  prefix: "api_cache",
  expire: 60 * 60 * 3, // 3 hours
  auth_pass: process.env.REDIS_PASSWORD,
});

redisCache.on("connected", () => {
  console.log("Redis connected successfully");
});

redisCache.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisCache;
