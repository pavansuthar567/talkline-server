import { Router } from "express";
import { apiRateLimiter } from "../../middleware/rateLimiter";
import MonitoringController from "./monitoring.controller";

const router = Router();

// Health check endpoint (no rate limiting)
router.get("/health", MonitoringController.getHealth);

// Metrics endpoints (with rate limiting)
router.get("/metrics", apiRateLimiter, MonitoringController.getMetrics);
router.get(
  "/metrics/history",
  apiRateLimiter,
  MonitoringController.getMetricsHistory
);
router.post("/track", apiRateLimiter, MonitoringController.trackEvent);

export default router;
