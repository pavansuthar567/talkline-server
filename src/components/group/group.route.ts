import express, { Request, Response } from "express";
import ChatController from "./group.controller";
import ChatValidations from "./group.validation";
import AuthMiddleware from "../auth/auth.validation";

const router = express.Router();

/**
 * @route POST /api/v1/chats/groups
 * @description Create a group chat
 * @access private
 */
router.post(
  "/groups",
  AuthMiddleware.authenticate,
  ChatValidations.createGroup,
  (req: Request, res: Response) => {
    ChatController.createGroup(req, res);
  }
);

/**
 * @route GET /api/v1/chats/groups
 * @description Get all group chats of user
 * @access private
 */
router.get(
  "/groups",
  AuthMiddleware.authenticate,
  (req: Request, res: Response) => {
    ChatController.getUserGroups(req, res);
  }
);

/**
 * @route POST /api/v1/chats/groups/:id/messages
 * @description Send message in a group
 * @access private
 */
router.post(
  "/groups/:id/messages",
  AuthMiddleware.authenticate,
  ChatValidations.sendGroupMessage,
  (req: Request, res: Response) => {
    ChatController.sendGroupMessage(req, res);
  }
);

/**
 * @route GET /api/v1/chats/groups/:id/messages
 * @description Get all messages from a group
 * @access private
 */
router.get(
  "/groups/:id/messages",
  AuthMiddleware.authenticate,
  ChatValidations.getGroupMessages,
  (req: Request, res: Response) => {
    ChatController.getGroupMessages(req, res);
  }
);

/**
 * @route PATCH /api/v1/chats/groups/:id
 * @description Update group info (name, add/remove members)
 * @access private
 */
router.patch(
  "/groups/:id",
  AuthMiddleware.authenticate,
  ChatValidations.updateGroup,
  (req: Request, res: Response) => {
    ChatController.updateGroup(req, res);
  }
);
