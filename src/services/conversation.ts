import { ConversationModel, IConversation } from "../models/conversation";
import mongoose from "mongoose";

export default class ConversationService {
  static async createConversation(
    participantIds: string[],
    isGroup = false,
    name?: string
  ): Promise<IConversation> {
    try {
      const newConversation = new ConversationModel({
        isGroup,
        name: isGroup ? name : null,
        participant_ids: participantIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      });
      return await newConversation.save();
    } catch (error: any) {
      throw new Error("Error creating conversation: " + error.message);
    }
  }

  static async getUserConversations(userId: string): Promise<IConversation[]> {
    try {
      return await ConversationModel.find({
        participant_ids: new mongoose.Types.ObjectId(userId),
      })
        .populate("lastMessage")
        .sort({ updated_at: -1 });
    } catch (error) {
      throw new Error("Error fetching conversations");
    }
  }

  static async getConversationById(id: string): Promise<IConversation | null> {
    try {
      return await ConversationModel.findById(id).populate("lastMessage");
    } catch (error) {
      throw new Error("Error fetching conversation");
    }
  }

  static async updateLastMessage(
    convoId: string,
    msgId: string
  ): Promise<void> {
    try {
      await ConversationModel.findByIdAndUpdate(convoId, {
        lastMessage: msgId,
      });
    } catch (error) {
      throw new Error("Error updating last message");
    }
  }
}
