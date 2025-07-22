import { connectChatConsumer } from "./config/kafka";
import { ChatKafkaHandler } from "./handler";

export const startChatConsumer = async () => {
  await connectChatConsumer();
  await ChatKafkaHandler.run();
};
