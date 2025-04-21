const redisConfig = {
  redisHost: process.env.REDIS_HOST || "localhost",

  redisPort: process.env.REDIS_PORT || 6379,
};

import { createClient } from "redis";

export const redisClient = createClient({
  url: `redis://${redisConfig.redisHost}:${redisConfig.redisPort}`,
});
