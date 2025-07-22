import { kafkaConsumer } from "./config/kafka";

export class NotificationKafkaHandler {
  static async run() {
    await kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (!message.value) return;
          const data = JSON.parse(message.value.toString());

          // Notification message handling logic
          console.log(`[Notification] Received message on ${topic}:`, data);
        } catch (err) {
          console.error(`[Notification] Error processing message:`, err);
        }
      },
    });
  }
}
