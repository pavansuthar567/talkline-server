import { Request, Response } from "express";
import ConversationService from "../../services/conversation";
import { createError, createResponse } from "../../helpers";

export default class ConversationController {
  static async getUserConversations(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?._id;
      const conversations = await ConversationService.getUserConversations(
        userId
      );
      return createResponse(
        res,
        "ok",
        "Conversations fetched successfully.",
        conversations
      );
    } catch (error) {
      return createError(res, error);
    }
  }

  static async getConversationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const conversation = await ConversationService.getConversationById(id);
      if (!conversation) {
        return createError(res, "Conversation not found", {
          message: "Invalid conversation ID",
        });
      }
      return createResponse(
        res,
        "ok",
        "Conversation fetched successfully.",
        conversation
      );
    } catch (error) {
      return createError(res, error);
    }
  }

  static async createConversation(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?._id;
      const conversation = await ConversationService.createConversation(
        userId,
        req.body
      );
      return createResponse(
        res,
        "ok",
        "Conversation created successfully.",
        conversation
      );
    } catch (error) {
      return createError(res, error);
    }
  }
}
