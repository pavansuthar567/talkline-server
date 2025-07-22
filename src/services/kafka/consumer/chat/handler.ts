import ChatService from "../../../chat";
import UserService from "../../../user";
import { KafkaProducerService } from "../../producer/send";
import { kafkaConsumer } from "./config/kafka";

export class ChatKafkaHandler {
  static async run() {
    await kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (!message.value) return;
          const data = JSON.parse(message.value.toString());

          console.log(`[Chat] Received message on ${topic}:`, data);

          // Extract message data
          const {
            from,
            to,
            message: text,
            chatRoomId,
            client_msg_id,
            media_ref_id,
          } = data;

          // Optional: validate users
          const [sender, receiver] = await Promise.all([
            UserService.getUserById(from),
            UserService.getUserById(to),
          ]);

          if (!sender || !receiver) throw new Error("Invalid sender/receiver");

          const payload = {
            client_msg_id: client_msg_id,
            conversation_id: chatRoomId,
            sender_id: from,
            content: text,
            media_ref_id: media_ref_id || null,
            status: "sent" as const,
          };
          // Save message
          const chatMessage = await ChatService.sendMessage(payload);

          await KafkaProducerService.sendToChat({ from, to, message, sender });
        } catch (err) {
          console.error(`[Chat] Error processing message:`, err);
        }
      },
    });
  }
}
