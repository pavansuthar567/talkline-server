import express, { Request, Response } from "express";
import AuthMiddleware from "../auth/auth.validation";
import ConversationController from "./conversation.controller";
import ConversationValidations from "./conversation.validation";

const router = express.Router();

/**
 * @route GET /api/v1/conversations
 * @description Get all conversations for current user
 * @returns JSON
 * @access private
 */
router.get("/", AuthMiddleware.authenticate, (req: Request, res: Response) => {
  ConversationController.getUserConversations(req, res);
});

/**
 * @route GET /api/v1/conversations/:id
 * @description Get a single conversation by ID
 * @returns JSON
 * @access private
 */
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    ConversationController.getConversationById(req, res);
  }
);

/**
 * @route POST /api/v1/conversations
 * @description Create a new 1:1 or group conversation
 * @returns JSON
 * @access private
 */
router.post(
  "/",
  AuthMiddleware.authenticate,
  ConversationValidations.createConversation,
  (req: Request, res: Response) => {
    ConversationController.createConversation(req, res);
  }
);

const conversationRoutes = router;
export default conversationRoutes;
