import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "logging-service",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

export const kafkaConsumer = kafka.consumer({
  groupId: "logging-group",
  allowAutoTopicCreation: false,
});

export const connectLoggingConsumer = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({
    topic: "logging-topic",
    fromBeginning: false,
  });
  console.log("Logging Consumer Connected");
};

export default kafka;
