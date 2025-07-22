import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const ChatValidations = {
  startConversation: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const schema = Joi.object({
      userIds: Joi.array().items(Joi.string()).min(2).required(),
      isGroup: Joi.boolean().required(),
      groupName: Joi.string().when("isGroup", {
        is: true,
        then: Joi.string().min(1).required(),
        otherwise: Joi.forbidden(),
      }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }
    next();
  },

  getMessages: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      conversationId: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }
    next();
  },

  sendMessage: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      conversationId: Joi.string().required(),
      senderId: Joi.string().required(),
      message: Joi.string().required(),
      type: Joi.string().valid("text", "image", "video", "file").required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    }
    next();
  },
};

export default ChatValidations;
