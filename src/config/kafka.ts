import { Kafka } from "kafkajs";
import { KafkaService } from "../services/kafka";

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({
  groupId: "chat-group",
  allowAutoTopicCreation: false,
});

export const connectKafka = async () => {
  await kafkaProducer.connect();
  await kafkaConsumer.connect();

  KafkaService.subscribe(["topic1", "topic2"], (topic, message) => {
    console.log(`Received from ${topic}:`, message);
  });
  console.log("Connected to Kafka");
};

export default kafka;
