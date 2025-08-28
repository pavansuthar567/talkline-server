import { Application } from "express";
import aiRoutes from "../components/ai/ai.route";
import authRoutes from "../components/auth/auth.route";
import chatRoutes from "../components/chat/chat.route";
import conversationRoutes from "../components/conversation/conversation.route";
import groupRoutes from "../components/group/group.route";
import messageRoutes from "../components/message/message.route";
import monitoringRoutes from "../components/monitoring/monitoring.route";
import userRoutes from "../components/user/user.route";

const initRoutes = (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/chat", chatRoutes);
  app.use("/api/v1/conversations", conversationRoutes);
  app.use("/api/v1/messages", messageRoutes);
  app.use("/api/v1/groups", groupRoutes);
  app.use("/api/v1/ai", aiRoutes);
  app.use("/api/v1/monitoring", monitoringRoutes);
  // app.use("/api/v1/feedback", feedbackRoutes);
  // app.use("/api/v1/notifications", notificationRoutes);
  // app.use("/api/v1/analytics", analyticsRoutes);
};

export default initRoutes;
