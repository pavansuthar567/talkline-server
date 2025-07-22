import { kafkaProducer } from "./config/kafka";
import { CompressionTypes } from "kafkajs";

export class KafkaProducerService {
  static async sendToChat(message: any, key = "") {
    await this.send("chat", message, key);
  }

  static async sendToLog(message: any, key = "") {
    await this.send("log", message, key);
  }

  static async sendToNotify(message: any, key = "") {
    await this.send("notify", message, key);
  }

  private static async send(topic: string, message: any, key = "") {
    try {
      await kafkaProducer.send({
        topic,
        messages: [{ key, value: JSON.stringify(message) }],
        compression: CompressionTypes.GZIP,
      });
    } catch (err) {
      console.error(`Kafka send error on topic ${topic}:`, err);
    }
  }
}
