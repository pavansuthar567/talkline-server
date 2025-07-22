import { connectLoggingConsumer } from "./config/kafka";
import { LoggingKafkaHandler } from "./handler";

export const startLogConsumer = async () => {
  await connectLoggingConsumer();
  await LoggingKafkaHandler.run();
};
