import { NextFunction, Request, Response } from "express";
import CacheService from "../services/cache";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
}

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
      const key = `rate_limit:${identifier}:${req.path}`;

      const { allowed, remaining } = await CacheService.checkRateLimit(
        key,
        config.maxRequests,
        config.windowMs / 1000
      );

      if (!allowed) {
        return res.status(config.statusCode || 429).json({
          error: config.message || "Too many requests",
          retryAfter: Math.ceil(config.windowMs / 1000),
        });
      }

      res.setHeader("X-RateLimit-Limit", config.maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", Date.now() + config.windowMs);

      next();
    } catch (error) {
      console.error("Rate limiting error:", error);
      next(); // Continue on error
    }
  };
};

// Predefined rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: "API rate limit exceeded",
});

export const messageRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: "Message rate limit exceeded",
});

export const socketRateLimiter = async (socketId: string, event: string) => {
  const key = `socket_rate_limit:${socketId}:${event}`;
  const { allowed } = await CacheService.checkRateLimit(key, 50, 60); // 50 events per minute
  return allowed;
};
