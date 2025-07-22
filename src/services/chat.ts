// services/chat.ts

import MessageService from "./message";
import ConversationService from "./conversation";
import { IMessage } from "../models/message";

export default class ChatService {
  static async sendMessage(data: Partial<IMessage>): Promise<IMessage> {
    try {
      const message = await MessageService.createMessage(data);

      // update lastMessage in conversation
      await ConversationService.updateLastMessage(
        data.conversation_id!.toString(),
        message._id.toString()
      );

      return message;
    } catch (error: any) {
      throw new Error("Error sending message: " + error.message);
    }
  }

  static async getChatHistory(conversationId: string) {
    try {
      return await MessageService.getMessagesByConversation(conversationId);
    } catch (error) {
      throw new Error("Error fetching chat history");
    }
  }

  static async markMessagesAs(
    msgIds: string[],
    status: "delivered" | "read"
  ): Promise<any> {
    try {
      return await MessageService.updateStatus(msgIds, status);
    } catch (error) {
      throw new Error("Error updating message status");
    }
  }
}
