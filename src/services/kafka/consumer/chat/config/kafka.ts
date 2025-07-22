import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chat-service",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

export const kafkaConsumer = kafka.consumer({
  groupId: "chat-group",
  allowAutoTopicCreation: false,
});

export const connectChatConsumer = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "chat", fromBeginning: false });
  console.log("Chat Consumer Connected");
};

export default kafka;
