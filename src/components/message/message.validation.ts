import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const MessageValidations = {
  updateStatus: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      messageId: Joi.string().required(),
      status: Joi.string().valid("delivered", "read").required(),
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

export default MessageValidations;
