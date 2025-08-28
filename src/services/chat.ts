// services/chat.ts

import { IMessage } from "../models/message";
import CacheService from "./cache";
import ConversationService from "./conversation";
import MessageService from "./message";
import MonitoringService from "./monitoring";

export default class ChatService {
  static async sendMessage(data: Partial<IMessage>): Promise<IMessage> {
    try {
      const message = await MessageService.createMessage(data);

      // Update lastMessage in conversation
      await ConversationService.updateLastMessage(
        data.conversation_id!.toString(),
        message._id.toString()
      );

      // Cache the new message
      await CacheService.updateMessageCache(
        data.conversation_id!.toString(),
        message
      );

      // Set initial delivery status
      await CacheService.setMessageDeliveryStatus(
        message._id.toString(),
        "sent"
      );

      // Track user activity
      await MonitoringService.trackUserActivity(
        data.sender_id!.toString(),
        "send_message"
      );

      return message;
    } catch (error: any) {
      throw new Error("Error sending message: " + error.message);
    }
  }

  static async getChatHistory(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) {
    try {
      // Try to get from cache first
      const cached = await CacheService.getCachedMessages(conversationId);

      if (cached && page === 1) {
        return {
          messages: cached.messages,
          fromCache: true,
          total: cached.messages.length,
        };
      }

      // If not in cache or pagination needed, get from DB
      const messages = await MessageService.getMessagesByConversation(
        conversationId,
        page,
        limit
      );

      // Cache the results for future requests
      if (page === 1) {
        await CacheService.cacheRecentMessages(conversationId, messages);
      }

      return {
        messages,
        fromCache: false,
        total: messages.length,
      };
    } catch (error) {
      throw new Error("Error fetching chat history");
    }
  }

  static async markMessagesAs(
    msgIds: string[],
    status: "delivered" | "read"
  ): Promise<any> {
    try {
      // Update in database
      const result = await MessageService.updateStatus(msgIds, status);

      // Update cache for each message
      for (const msgId of msgIds) {
        await CacheService.setMessageDeliveryStatus(msgId, status);
      }

      // Track activity
      await MonitoringService.trackUserActivity(
        msgIds[0], // Assuming same user for all messages
        `mark_${status}`
      );

      return result;
    } catch (error) {
      throw new Error("Error updating message status");
    }
  }

  static async getMessageDeliveryStatus(
    messageId: string
  ): Promise<string | null> {
    try {
      return await CacheService.getMessageDeliveryStatus(messageId);
    } catch (error) {
      console.error("Error getting delivery status:", error);
      return null;
    }
  }

  static async getUserPresence(userId: string) {
    try {
      return await CacheService.getUserPresence(userId);
    } catch (error) {
      console.error("Error getting user presence:", error);
      return null;
    }
  }

  static async setUserPresence(
    userId: string,
    status: "online" | "offline" | "away",
    socketId?: string
  ) {
    try {
      const presence = {
        userId,
        status,
        lastSeen: new Date(),
        socketId,
      };

      await CacheService.setUserPresence(userId, presence);

      // Track activity
      await MonitoringService.trackUserActivity(userId, `presence_${status}`);

      return presence;
    } catch (error) {
      console.error("Error setting user presence:", error);
      throw error;
    }
  }

  static async setTypingIndicator(
    userId: string,
    conversationId: string,
    isTyping: boolean
  ) {
    try {
      await CacheService.setTypingIndicator(userId, conversationId, isTyping);
    } catch (error) {
      console.error("Error setting typing indicator:", error);
    }
  }
}
