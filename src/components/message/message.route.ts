import express, { Request, Response } from "express";
import AuthMiddleware from "../auth/auth.validation";
import MessageController from "./message.controller";
import MessageValidations from "./message.validation";

const router = express.Router();

/**
 * @route GET /api/v1/messages/conversation/:conversationId
 * @description Get messages for a conversation
 * @returns JSON
 * @access private
 */
router.get(
  "/conversation/:conversationId",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    MessageController.getMessagesByConversation(req, res);
  }
);

/**
 * @route PUT /api/v1/messages/status
 * @description Update message status (read/delivered)
 * @returns JSON
 * @access private
 */
router.put(
  "/status",
  AuthMiddleware.authenticate,
  MessageValidations.updateStatus,
  (req: Request, res: Response) => {
    MessageController.updateMessageStatus(req, res);
  }
);

const messageRoutes = router;
export default messageRoutes;
