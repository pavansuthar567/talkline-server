import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const PdfValidations = {
  generatePdf: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      html: Joi.string().required().messages({
        "string.empty": "HTML content is required",
        "any.required": "HTML content is required",
      }),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
      return;
    } else {
      next();
    }
  },
};

export default PdfValidations;
