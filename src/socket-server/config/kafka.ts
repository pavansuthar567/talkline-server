import { Kafka, Producer, Consumer } from "kafkajs";

const kafka = new Kafka({
  clientId: "socket-server",
  brokers: [process.env.KAFKA_BROKER || "broker1:9092"],
});

const producer: Producer = kafka.producer();
const consumer: Consumer = kafka.consumer({ groupId: "socket-group" });

export const KafkaConfig = {
  kafka,
  producer,
  consumer,
  connect: async () => {
    await producer.connect();
    await consumer.connect();
  },
};
