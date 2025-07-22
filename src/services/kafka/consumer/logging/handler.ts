import { kafkaConsumer } from "./config/kafka";

export class LoggingKafkaHandler {
  static async run() {
    await kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          if (!message.value) return;
          const data = JSON.parse(message.value.toString());

          // Logging logic
          console.log(`[Logging] Received message on ${topic}:`, data);
        } catch (err) {
          console.error(`[Logging] Error processing message:`, err);
        }
      },
    });
  }
}
