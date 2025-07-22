import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { RedisAdapter } from "./redisAdapter";
import { SocketManager } from "./socket";
import { KafkaConfig } from "./config/kafka";

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

(async () => {
  try {
    // Init Redis Adapter
    await RedisAdapter.init(io);

    // Init Kafka
    await KafkaConfig.connect();

    // Init Socket Manager
    await new SocketManager(io).init();

    // Start server
    httpServer.listen(process.env.PORT || 4000, () => {
      console.log("Socket server running");
    });
  } catch (err) {
    console.error("Error during server init:", err);
  }
})();
