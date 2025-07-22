import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

const UserValidations = {
  createUser: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      first_name: Joi.string().min(3).max(30).required(),
      last_name: Joi.string().min(3).max(30).required(),
      img: Joi.string().uri().optional(),
      x: Joi.string().uri().allow(null, "").optional(),
      linkedin: Joi.string().uri().allow(null, "").optional(),
      dob: Joi.date()
        .less(minAgeDate)
        .messages({ "date.less": "User must be at least 18 years old" })
        .allow(null, "")
        .optional(),
      role: Joi.string().valid("admin", "user").default("user"),
      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
        .message(
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character"
        )
        .required(),
      email: Joi.string().email().required(),
      mobile_number: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message("Invalid mobile number format")
        .allow("", null)
        .optional(),
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

  updateUser: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      first_name: Joi.string().min(3).max(30).optional(),
      last_name: Joi.string().min(3).max(30).optional(),
      img: Joi.string().uri().optional(),
      x: Joi.string().uri().allow(null, "").optional(),
      linkedin: Joi.string().uri().allow(null, "").optional(),
      dob: Joi.date()
        .less(minAgeDate)
        .messages({ "date.less": "User must be at least 18 years old" })
        .allow(null, "")
        .optional(),
      role: Joi.string().valid("admin", "user").optional(),
      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
        .message(
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character"
        )
        .optional(),
      email: Joi.string().email().optional(),
      mobile_number: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .message("Invalid mobile number format")
        .allow("", null)
        .optional(),
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

  forgotPassword: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
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

  resetPassword: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      reset_token: Joi.string().required(),
      new_password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
        .message(
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character"
        )
        .required(),
      confirm_password: Joi.string()
        .valid(Joi.ref("new_password"))
        .messages({ "any.only": "Confirm Password must match Password" })
        .required(),
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

  loginUser: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
        .message(
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character"
        )
        .required(),
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

  verifyOtp: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      otp: Joi.string()
        .length(6)
        .pattern(/^\d{6}$/)
        .message("OTP must be numeric and 6 digits long")
        .required(),
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

export default UserValidations;
