import { Request, Response } from "express";
import { createError, createResponse } from "../../helpers";
import { asyncHandler } from "../../middleware/errorHandler";
import MonitoringService from "../../services/monitoring";

export default class MonitoringController {
  /**
   * @description Health check endpoint
   */
  static getHealth = asyncHandler(async (req: Request, res: Response) => {
    const health = await MonitoringService.performHealthCheck();
    return createResponse(res, "ok", "Health check completed", health);
  });

  /**
   * @description Get current metrics
   */
  static getMetrics = asyncHandler(async (req: Request, res: Response) => {
    const metrics = await MonitoringService.getCurrentMetrics();
    return createResponse(res, "ok", "Metrics retrieved", metrics);
  });

  /**
   * @description Get metrics history
   */
  static getMetricsHistory = asyncHandler(
    async (req: Request, res: Response) => {
      const hours = parseInt(req.query.hours as string) || 24;
      const history = await MonitoringService.getMetricsHistory(hours);
      return createResponse(res, "ok", "Metrics history retrieved", {
        history,
      });
    }
  );

  /**
   * @description Track custom event
   */
  static trackEvent = asyncHandler(async (req: Request, res: Response) => {
    const { userId, action } = req.body;

    if (!userId || !action) {
      return createError(res, {
        message: "userId and action are required",
        statusCode: 400,
      });
    }

    await MonitoringService.trackUserActivity(userId, action);
    return createResponse(res, "ok", "Event tracked successfully");
  });
}
