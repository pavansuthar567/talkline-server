import { Request, Response } from "express";
import MessageService from "../../services/message";
import { createError, createResponse } from "../../helpers";

export default class MessageController {
  static async getMessagesByConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const messages = await MessageService.getMessagesByConversation(
        conversationId
      );
      return createResponse(
        res,
        "ok",
        "Messages retrieved successfully.",
        messages
      );
    } catch (error) {
      return createError(res, error);
    }
  }

  static async updateMessageStatus(req: Request, res: Response) {
    try {
      const { messageId, status } = req.body;
      const updated = await MessageService.updateStatus(messageId, status);
      if (!updated) {
        return createError(res, "Message not found", {
          message: "Failed to update message status",
        });
      }
      return createResponse(
        res,
        "ok",
        "Message status updated successfully.",
        updated
      );
    } catch (error) {
      return createError(res, error);
    }
  }
}
