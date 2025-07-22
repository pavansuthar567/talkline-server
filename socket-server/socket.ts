import { Server, Socket } from "socket.io";
import { AuthUtils } from "./utils/verifyToken";
import { KafkaConfig } from "./config/kafka";

export class SocketManager {
  constructor(private io: Server) {
    this.io = io;
  }

  async init() {
    // Middleware: Auth check
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      const user = AuthUtils.verifyToken(token);
      if (!user) return next(new Error("Unauthorized"));
      (socket as any).user = user;
      next();
    });

    // Kafka Consumer: Listen for `chat` and emit
    await KafkaConfig.consumer.subscribe({ topic: "chat" });
    await KafkaConfig.consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse(message.value?.toString() || "{}");
        this.io.to(payload.roomId).emit("chat:receive", payload);
      },
    });

    // On Socket Connect
    this.io.on("connection", (socket: Socket) => {
      const user = (socket as any).user;
      console.log("User connected:", user.id);

      socket.on("chat:send", async (data) => {
        await KafkaConfig.producer.send({
          topic: "chat",
          messages: [
            {
              value: JSON.stringify({
                ...data,
                senderId: user.id,
              }),
            },
          ],
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", user.id);
      });
    });
  }
}
