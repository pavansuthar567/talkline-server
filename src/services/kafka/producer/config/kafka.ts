import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chat-app-producer",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

export const kafkaProducer = kafka.producer();

export const connectProducer = async () => {
  await kafkaProducer.connect();
  console.log("Kafka Producer Connected");
};

export default kafka;
