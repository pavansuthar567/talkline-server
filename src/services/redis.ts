import { createClient } from "redis";

class RedisService {
  private static client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  private static isConnected = false;

  static async connect(): Promise<void> {
    if (!this.isConnected) {
      this.client.on("error", (err) => console.error("Redis Error:", err));
      await this.client.connect();
      this.isConnected = true;
    }
  }

  static async publish(channel: string, message: string): Promise<void> {
    try {
      await this.connect();
      await this.client.publish(channel, message);
    } catch (error) {
      console.error("Redis publish error:", error);
    }
  }

  static async subscribe(
    channel: string,
    handler: (message: string) => void
  ): Promise<void> {
    try {
      const subscriber = this.client.duplicate();
      await subscriber.connect();
      await subscriber.subscribe(channel, handler);
    } catch (error) {
      console.error("Redis subscribe error:", error);
    }
  }

  static async set(
    key: string,
    value: string,
    expireSec?: number
  ): Promise<void> {
    try {
      await this.connect();
      if (expireSec) {
        await this.client.set(key, value, { EX: expireSec });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      await this.connect();
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  static async delete(key: string): Promise<void> {
    try {
      await this.connect();
      await this.client.del(key);
    } catch (error) {
      console.error("Redis delete error:", error);
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      await this.connect();
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error("Redis exists error:", error);
      return false;
    }
  }

  static async flushAll(): Promise<void> {
    try {
      await this.connect();
      await this.client.flushAll();
    } catch (error) {
      console.error("Redis flushAll error:", error);
    }
  }
}

export default RedisService;
