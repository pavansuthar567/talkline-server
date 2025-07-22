import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err: any) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
};

export default redisClient;
