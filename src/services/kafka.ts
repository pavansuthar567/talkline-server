import { CompressionTypes } from "kafkajs";
import { kafkaProducer, kafkaConsumer } from "../config/kafka";

export class KafkaService {
  static async publish(topic: string, message: any, key: string = "") {
    try {
      await kafkaProducer.send({
        topic,
        messages: [{ key, value: JSON.stringify(message) }],
        compression: CompressionTypes.GZIP,
      });
    } catch (err) {
      console.error(`Kafka publish error on topic ${topic}:`, err);
    }
  }

  static async subscribe(
    topics: string[],
    handler: (topic: string, message: any) => void
  ) {
    try {
      for (const topic of topics) {
        await kafkaConsumer.subscribe({ topic, fromBeginning: false });
      }

      await kafkaConsumer.run({
        eachMessage: async ({ topic, message }) => {
          try {
            if (message.value) {
              const parsed = JSON.parse(message.value.toString());
              handler(topic, parsed);
            }
          } catch (err) {
            console.error(`Error handling Kafka message from ${topic}:`, err);
          }
        },
      });
    } catch (err) {
      console.error("Kafka subscribe error:", err);
    }
  }
}
