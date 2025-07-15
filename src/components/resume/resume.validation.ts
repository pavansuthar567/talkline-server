import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export class ResumeValidations {
  static generateResume(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      // If job_id is absent, these fields are required
      job_id: Joi.string().optional(),
      position: Joi.string().when("job_id", {
        is: Joi.exist(),
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
      }),
      company: Joi.string().when("job_id", {
        is: Joi.exist(),
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
      }),
      description: Joi.string().when("job_id", {
        is: Joi.exist(),
        then: Joi.string().optional(),
        otherwise: Joi.string().required(),
      }),
      // Optional user background fields
      skills: Joi.array().items(Joi.string()).min(0).optional(),
      experience: Joi.array().items(Joi.string()).min(0).optional(),
    }).with("job_id", []); // No additional fields required if job_id exists

    const validationData = {
      job_id: req.params.job_id,
      ...req.body,
    };

    const { error } = schema.validate(validationData);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    next();
  }

  static updateResume(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      title: Joi.string().optional(),
      summary: Joi.string().optional(),
      skills: Joi.array().items(Joi.string()).optional(),
      experience: Joi.array()
        .items(
          Joi.object({
            title: Joi.string().required(),
            company: Joi.string().required(),
            location: Joi.string().allow(""),
            start_date: Joi.string().required(),
            end_date: Joi.string().allow(""),
            description: Joi.string().allow(""),
            achievements: Joi.array().items(Joi.string().required()).optional(),
          })
        )
        .optional(),
      education: Joi.array()
        .items(
          Joi.object({
            degree: Joi.string().required(),
            institution: Joi.string().required(),
            location: Joi.string().allow(""),
            start_date: Joi.string().required(),
            end_date: Joi.string().allow(""),
          })
        )
        .optional(),
      projects: Joi.array()
        .items(
          Joi.object({
            title: Joi.string().required(),
            description: Joi.string().allow(""),
            link: Joi.string().uri().allow(null, ""),
          })
        )
        .optional(),
      achievements: Joi.array()
        .items(
          Joi.object({
            title: Joi.string().required(),
            description: Joi.string().allow(""),
            date: Joi.date().allow(""),
          })
        )
        .optional(),
      certifications: Joi.array()
        .items(
          Joi.object({
            title: Joi.string().required(),
            issuing_organization: Joi.string().required(),
            description: Joi.string().allow(""),
            issue_date: Joi.string().required(),
          })
        )
        .optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    next();
  }
}

export default ResumeValidations;
