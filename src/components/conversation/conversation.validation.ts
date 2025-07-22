import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

const ConversationValidations = {
  createConversation: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const schema: ObjectSchema = Joi.object({
      isGroup: Joi.boolean().default(false),
      members: Joi.array().items(Joi.string().required()).min(1).required(),
      name: Joi.string().when("isGroup", {
        is: true,
        then: Joi.string().required().min(3).max(50),
        otherwise: Joi.string().optional(),
      }),
      image: Joi.string().uri().allow(null, "").optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
    } else {
      next();
    }
  },
};

export default ConversationValidations;
