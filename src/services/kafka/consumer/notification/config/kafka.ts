import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

export const kafkaConsumer = kafka.consumer({
  groupId: "notification-group",
  allowAutoTopicCreation: false,
});

export const connectNotificationConsumer = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({
    topic: "notification-topic",
    fromBeginning: false,
  });
  console.log("Notification Consumer Connected");
};

export default kafka;
