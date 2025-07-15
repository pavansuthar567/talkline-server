import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { JOB_STATUSES } from "../../models/job";

const JobValidations = {
  // Validation for GET /api/v1/jobs (query params)
  getJobs: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(100).optional(),
      status: Joi.string()
        .valid(...JOB_STATUSES)
        .optional()
        .messages({
          "any.only": `Status must be one of: ${JOB_STATUSES.join(", ")}`,
        }),
      flexibility: Joi.string()
        .valid("Remote", "Hybrid", "On-site")
        .optional()
        .messages({
          "any.only": "Flexibility must be one of: Remote, Hybrid, On-site",
        }),
      search: Joi.string().optional(),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.query);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
      return;
    } else {
      next();
    }
  },

  createJob: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      company: Joi.string(),
      company_site: Joi.string().uri().allow(""),
      description: Joi.string().allow(""),
      position: Joi.string(),
      location: Joi.string().allow(""),
      flexibility: Joi.string().valid("Remote", "Hybrid", "On-site").messages({
        "any.only": "Flexibility must be one of: Remote, Hybrid, On-site",
      }),
      status: Joi.string()
        .valid(...JOB_STATUSES)
        .messages({
          "any.only": `Status must be one of: ${JOB_STATUSES.join(", ")}`,
        }),
      salary: Joi.string().allow(""),
      in_touch_person: Joi.string().allow(""),
      platform: Joi.string().allow(""),
      post_link: Joi.string().uri().allow("").messages({
        "string.uri": "Post link must be a valid URL",
      }),
      applied_date: Joi.string().isoDate().messages({
        "string.isoDate": "Applied date must be a valid ISO date string",
      }),
      note: Joi.string().allow(""),
      user_id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }, "ObjectId validation")
        .messages({
          "any.invalid": "User ID must be a valid ObjectId",
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
  // Validation for PUT /api/v1/jobs/:id
  updateJob: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      company: Joi.string().optional(),
      company_site: Joi.string().uri().allow(""),
      description: Joi.string().allow("").optional(),
      position: Joi.string().optional(),
      location: Joi.string().allow("").optional(),
      flexibility: Joi.string()
        .valid("Remote", "Hybrid", "On-site")
        .optional()
        .messages({
          "any.only": "Flexibility must be one of: Remote, Hybrid, On-site",
        }),
      status: Joi.string()
        .valid(...JOB_STATUSES)
        .optional()
        .messages({
          "any.only": `Status must be one of: ${JOB_STATUSES.join(", ")}`,
        }),
      salary: Joi.string().allow("").optional(),
      in_touch_person: Joi.string().allow("").optional(),
      platform: Joi.string().allow("").optional(),
      post_link: Joi.string().uri().allow("").optional().messages({
        "string.uri": "Post link must be a valid URL",
      }),
      applied_date: Joi.string().isoDate().optional().messages({
        "string.isoDate": "Applied date must be a valid ISO date string",
      }),
      note: Joi.string().allow("").optional(),
      user_id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }, "ObjectId validation")
        .optional()
        .messages({
          "any.invalid": "User ID must be a valid ObjectId",
        }),
    }).options({ abortEarly: false });

    const paramSchema = Joi.object({
      id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }, "ObjectId validation")
        .required()
        .messages({
          "any.invalid": "Job ID must be a valid ObjectId",
          "any.required": "Job ID is required",
        }),
    });

    const { error: bodyError } = schema.validate(req.body);
    const { error: paramError } = paramSchema.validate(req.params);

    if (bodyError || paramError) {
      const errorMessage =
        bodyError?.details[0].message || paramError?.details[0].message;
      res.status(400).json({ status: "error", message: errorMessage });
      return;
    } else {
      next();
    }
  },

  // Validation for DELETE /api/v1/jobs/:id
  deleteJob: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }, "ObjectId validation")
        .required()
        .messages({
          "any.invalid": "Job ID must be a valid ObjectId",
          "any.required": "Job ID is required",
        }),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.params);
    if (error) {
      res
        .status(400)
        .json({ status: "error", message: error.details[0].message });
      return;
    } else {
      next();
    }
  },

  // Validation for GET /api/v1/jobs/:id
  getSingleJob: (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      id: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }, "ObjectId validation")
        .required()
        .messages({
          "any.invalid": "Job ID must be a valid ObjectId",
          "any.required": "Job ID is required",
        }),
    }).options({ abortEarly: false });

    const { error } = schema.validate(req.params);
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

export default JobValidations;
