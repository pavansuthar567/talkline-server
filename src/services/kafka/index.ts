import { connectKafkaProducer } from "./producer/index";
import { startChatConsumer } from "./consumer/chat";
import { startLogConsumer } from "./consumer/logging";
import { startNotifyConsumer } from "./consumer/notification";

export const connectKafka = async () => {
  await connectKafkaProducer();
  await Promise.all([
    startChatConsumer(),
    startLogConsumer(),
    startNotifyConsumer(),
  ]);
};
