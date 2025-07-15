import { Application } from "express";
import jobRoutes from "../components/job/job.route";
import userRoutes from "../components/user/user.route";
import authRoutes from "../components/auth/auth.route";
import resumeRoutes from "../components/resume/resume.route";
import pdfRoutes from "../components/pdf/generate-pdf.route";
import fileUploadRoutes from "../components/upload-file/upload.route";

const initRoutes = (app: Application): void => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/jobs", jobRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/resume", resumeRoutes);
  app.use("/api/v1/generate-pdf", pdfRoutes);
  app.use("/api/v1/upload", fileUploadRoutes);
  // app.use("/api/v1/feedback", feedbackRoutes);
  // app.use("/api/v1/notifications", notificationRoutes);
  // app.use("/api/v1/analytics", analyticsRoutes);
};

export default initRoutes;
