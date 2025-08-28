import CacheService from "./cache";

export interface Metrics {
  qps: number;
  latency: number;
  errorRate: number;
  activeUsers: number;
  totalMessages: number;
  timestamp: Date;
}

export interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  checks: {
    database: boolean;
    redis: boolean;
    kafka: boolean;
  };
  timestamp: Date;
}

class MonitoringService {
  private static metrics: Metrics[] = [];
  private static readonly MAX_METRICS_HISTORY = 1000;

  // Track API requests
  static async trackRequest(
    path: string,
    method: string,
    duration: number,
    statusCode: number
  ): Promise<void> {
    const key = `metrics:requests:${Date.now()}`;
    const data = {
      path,
      method,
      duration,
      statusCode,
      timestamp: new Date(),
    };

    await CacheService.set(key, JSON.stringify(data), 3600); // Keep for 1 hour
  }

  // Track errors
  static async trackError(error: Error, context: string): Promise<void> {
    const key = `metrics:errors:${Date.now()}`;
    const data = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
    };

    await CacheService.set(key, JSON.stringify(data), 86400); // Keep for 24 hours
  }

  // Track user activity
  static async trackUserActivity(
    userId: string,
    action: string
  ): Promise<void> {
    const key = `metrics:activity:${userId}:${Date.now()}`;
    const data = {
      userId,
      action,
      timestamp: new Date(),
    };

    await CacheService.set(key, JSON.stringify(data), 3600);
  }

  // Get current metrics
  static async getCurrentMetrics(): Promise<Metrics> {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // Calculate QPS (requests per second)
    const requests = await this.getRequestsInTimeframe(oneMinuteAgo, now);
    const qps = requests.length / 60;

    // Calculate average latency
    const avgLatency =
      requests.length > 0
        ? requests.reduce((sum, req) => sum + req.duration, 0) / requests.length
        : 0;

    // Calculate error rate
    const errors = requests.filter((req) => req.statusCode >= 400).length;
    const errorRate =
      requests.length > 0 ? (errors / requests.length) * 100 : 0;

    // Get active users (simplified)
    const activeUsers = await this.getActiveUsersCount();

    return {
      qps,
      latency: avgLatency,
      errorRate,
      activeUsers,
      totalMessages: 0, // Would need to track this separately
      timestamp: now,
    };
  }

  // Health check
  static async performHealthCheck(): Promise<HealthCheck> {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      kafka: await this.checkKafka(),
    };

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    let status: "healthy" | "degraded" | "unhealthy";

    if (healthyChecks === 3) {
      status = "healthy";
    } else if (healthyChecks >= 2) {
      status = "degraded";
    } else {
      status = "unhealthy";
    }

    return {
      status,
      checks,
      timestamp: new Date(),
    };
  }

  // Private helper methods
  private static async getRequestsInTimeframe(
    start: Date,
    end: Date
  ): Promise<any[]> {
    // Simplified - in production would use proper time-series database
    return [];
  }

  private static async getActiveUsersCount(): Promise<number> {
    // Simplified - would count users with recent activity
    return 0;
  }

  private static async checkDatabase(): Promise<boolean> {
    try {
      // Add actual database health check
      return true;
    } catch (error) {
      return false;
    }
  }

  private static async checkRedis(): Promise<boolean> {
    try {
      await CacheService.get("health_check");
      return true;
    } catch (error) {
      return false;
    }
  }

  private static async checkKafka(): Promise<boolean> {
    try {
      // Add actual Kafka health check
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get metrics history
  static async getMetricsHistory(hours: number = 24): Promise<Metrics[]> {
    // In production, would fetch from time-series database
    return this.metrics.slice(-hours * 60); // Last N minutes
  }

  // Cleanup old metrics
  static async cleanupOldMetrics(): Promise<void> {
    if (this.metrics.length > this.MAX_METRICS_HISTORY) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS_HISTORY);
    }
  }
}

export default MonitoringService;
