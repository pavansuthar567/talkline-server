import { connectProducer } from "./config/kafka";

export const connectKafkaProducer = async () => {
  await connectProducer();
};
