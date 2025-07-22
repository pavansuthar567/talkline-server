import { MessageModel, IMessage } from "../models/message";
import mongoose from "mongoose";

export default class MessageService {
  static async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    try {
      const newMessage = new MessageModel(data);
      return await newMessage.save();
    } catch (error: any) {
      throw new Error("Error creating message: " + error.message);
    }
  }

  static async getMessagesByConversation(
    conversationId: string
  ): Promise<IMessage[]> {
    try {
      return await MessageModel.find({
        conversation_id: new mongoose.Types.ObjectId(conversationId),
      }).sort({ created_at: 1 });
    } catch (error) {
      throw new Error("Error fetching messages");
    }
  }

  static async updateStatus(
    msgIds: string[],
    status: "delivered" | "read"
  ): Promise<any> {
    try {
      return await MessageModel.updateMany(
        { _id: { $in: msgIds.map((id) => new mongoose.Types.ObjectId(id)) } },
        { $set: { status } }
      );
    } catch (error) {
      throw new Error("Error updating message status");
    }
  }
}
