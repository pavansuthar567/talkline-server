import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";

export class RedisAdapter {
  static async init(io: Server) {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    io.adapter(createAdapter(pubClient, subClient));
  }
}
