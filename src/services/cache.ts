import RedisService from "./redis";

export interface UserPresence {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
  socketId?: string;
}

export interface ChatCache {
  conversationId: string;
  messages: any[];
  lastMessage: any;
  unreadCount: number;
  lastUpdated: Date;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: Date;
}

class CacheService {
  private static readonly CACHE_TTL = {
    USER_PRESENCE: 300, // 5 minutes
    RECENT_MESSAGES: 3600, // 1 hour
    CONVERSATION_META: 1800, // 30 minutes
    TYPING_INDICATOR: 10, // 10 seconds
    RATE_LIMIT: 60, // 1 minute
  };

  // User Presence Management
  static async setUserPresence(
    userId: string,
    presence: UserPresence
  ): Promise<void> {
    const key = `presence:${userId}`;
    await RedisService.set(
      key,
      JSON.stringify(presence),
      this.CACHE_TTL.USER_PRESENCE
    );
  }

  static async getUserPresence(userId: string): Promise<UserPresence | null> {
    const key = `presence:${userId}`;
    const data = await RedisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async removeUserPresence(userId: string): Promise<void> {
    const key = `presence:${userId}`;
    await RedisService.delete(key);
  }

  static async getOnlineUsers(): Promise<string[]> {
    // This would need Redis SCAN in production, simplified for demo
    return [];
  }

  // Recent Messages Caching
  static async cacheRecentMessages(
    conversationId: string,
    messages: any[]
  ): Promise<void> {
    const key = `messages:${conversationId}`;
    const cacheData: ChatCache = {
      conversationId,
      messages: messages.slice(-50), // Cache last 50 messages
      lastMessage: messages[messages.length - 1],
      unreadCount: 0,
      lastUpdated: new Date(),
    };
    await RedisService.set(
      key,
      JSON.stringify(cacheData),
      this.CACHE_TTL.RECENT_MESSAGES
    );
  }

  static async getCachedMessages(
    conversationId: string
  ): Promise<ChatCache | null> {
    const key = `messages:${conversationId}`;
    const data = await RedisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async updateMessageCache(
    conversationId: string,
    newMessage: any
  ): Promise<void> {
    const cached = await this.getCachedMessages(conversationId);
    if (cached) {
      cached.messages.push(newMessage);
      cached.lastMessage = newMessage;
      cached.lastUpdated = new Date();
      // Keep only last 50 messages
      if (cached.messages.length > 50) {
        cached.messages = cached.messages.slice(-50);
      }
      await this.cacheRecentMessages(conversationId, cached.messages);
    }
  }

  // Typing Indicators
  static async setTypingIndicator(
    userId: string,
    conversationId: string,
    isTyping: boolean
  ): Promise<void> {
    const key = `typing:${conversationId}:${userId}`;
    if (isTyping) {
      const indicator: TypingIndicator = {
        userId,
        conversationId,
        isTyping,
        timestamp: new Date(),
      };
      await RedisService.set(
        key,
        JSON.stringify(indicator),
        this.CACHE_TTL.TYPING_INDICATOR
      );
    } else {
      await RedisService.delete(key);
    }
  }

  static async getTypingIndicators(
    conversationId: string
  ): Promise<TypingIndicator[]> {
    // Simplified - in production would use Redis SCAN
    return [];
  }

  // Rate Limiting
  static async checkRateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const current = await RedisService.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    await RedisService.set(key, (count + 1).toString(), window);
    return { allowed: true, remaining: limit - count - 1 };
  }

  // Conversation Metadata
  static async cacheConversationMeta(
    conversationId: string,
    meta: any
  ): Promise<void> {
    const key = `conv:meta:${conversationId}`;
    await RedisService.set(
      key,
      JSON.stringify(meta),
      this.CACHE_TTL.CONVERSATION_META
    );
  }

  static async getConversationMeta(
    conversationId: string
  ): Promise<any | null> {
    const key = `conv:meta:${conversationId}`;
    const data = await RedisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Message Delivery Status
  static async setMessageDeliveryStatus(
    messageId: string,
    status: "sent" | "delivered" | "read"
  ): Promise<void> {
    const key = `delivery:${messageId}`;
    await RedisService.set(key, status, 86400); // 24 hours
  }

  static async getMessageDeliveryStatus(
    messageId: string
  ): Promise<string | null> {
    const key = `delivery:${messageId}`;
    return await RedisService.get(key);
  }

  // Cache Invalidation
  static async invalidateConversationCache(
    conversationId: string
  ): Promise<void> {
    const keys = [
      `messages:${conversationId}`,
      `conv:meta:${conversationId}`,
      `typing:${conversationId}:*`,
    ];

    for (const key of keys) {
      await RedisService.delete(key);
    }
  }
}

export default CacheService;
