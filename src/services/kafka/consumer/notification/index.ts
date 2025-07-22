import { connectNotificationConsumer } from "./config/kafka";
import { NotificationKafkaHandler } from "./handler";

export const startNotifyConsumer = async () => {
  await connectNotificationConsumer();
  await NotificationKafkaHandler.run();
};
