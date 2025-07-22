import { Application } from "express";
import userRoutes from "../components/user/user.route";
import authRoutes from "../components/auth/auth.route";

const initRoutes = (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  // app.use("/api/v1/feedback", feedbackRoutes);
  // app.use("/api/v1/notifications", notificationRoutes);
  // app.use("/api/v1/analytics", analyticsRoutes);
};

export default initRoutes;
