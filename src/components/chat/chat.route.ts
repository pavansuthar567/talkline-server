import express, { Request, Response } from "express";
import ChatController from "./chat.controller";
import ChatValidations from "./chat.validation";
import AuthMiddleware from "../auth/auth.validation";

const router = express.Router();

/**
 * @route POST /api/v1/chats/conversations
 * @description Start or get existing conversation between 2 users
 * @access private
 */
router.post(
  "/conversations",
  AuthMiddleware.authenticate,
  ChatValidations.startConversation,
  (req: Request, res: Response) => {
    ChatController.startConversation(req, res);
  }
);

/**
 * @route GET /api/v1/chats/conversations
 * @description Get all conversations of logged-in user
 * @access private
 */
router.get(
  "/conversations",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    ChatController.getUserConversations(req, res);
  }
);

/**
 * @route GET /api/v1/chats/conversations/:id/messages
 * @description Get messages of a conversation
 * @access private
 */
router.get(
  "/conversations/:id/messages",
  AuthMiddleware.authenticate,
  ChatValidations.getMessages,
  (req: Request, res: Response) => {
    ChatController.getMessages(req, res);
  }
);

/**
 * @route POST /api/v1/chats/messages
 * @description Send message in a conversation
 * @access private
 */
router.post(
  "/messages",
  AuthMiddleware.authenticate,
  ChatValidations.sendMessage,
  (req: Request, res: Response) => {
    ChatController.sendMessage(req, res);
  }
);

const chatRoutes = router;
export default chatRoutes;
