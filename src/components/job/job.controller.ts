import { Request, Response } from "express";
import { createError, createResponse } from "../../helpers";
import JobService from "../../services/job";
import { IUser } from "../../models/user";

export default class JobController {
  /**
   * @description Get all jobs, optionally filtered by query params
   */
  static async getJobs(req: Request, res: Response) {
    try {
      const { page, limit, status, flexibility, search } = req.query;
      const user = req.user as any; // Ensure `req.user` exists from authentication middleware
      if (!user || !user._id) {
        return createError(res, { status: 401, message: "Job not found" });
      }

      const filters = {
        ...(status && { status: status as string }),
        ...(flexibility && { flexibility: flexibility as string }),
        search: typeof search === "string" ? search : "",
        user_id: user?._id, // CREATEDBY
      };
      const pagination = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
      };

      const jobs = await JobService.getJobs(filters, pagination);
      return createResponse(res, "ok", "Jobs retrieved successfully.", jobs);
    } catch (error) {
      return createError(res, error);
    }
  }

  /**
   * @description Create a new job
   */
  static async createJob(req: Request, res: Response) {
    try {
      const jobData = req.body;
      const job = await JobService.createJob(jobData);
      return createResponse(res, "ok", "Job created successfully.", job);
    } catch (error) {
      return createError(res, error);
    }
  }

  /**
   * @description Update an existing job by ID
   */
  static async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedJob = await JobService.updateJob(id, updateData);
      if (!updatedJob) {
        return createError(res, { status: 404, message: "Job not found" });
      }

      return createResponse(res, "ok", "Job updated successfully.", updatedJob);
    } catch (error) {
      return createError(res, error);
    }
  }

  /**
   * @description Delete a job by ID
   */
  static async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deletedJob = await JobService.deleteJob(id);
      if (!deletedJob) {
        return createError(res, { status: 404, message: "Job not found" });
      }

      return createResponse(res, "ok", "Job deleted successfully.", {
        id: deletedJob._id,
      });
    } catch (error) {
      return createError(res, error);
    }
  }

  /**
   * @description Get a single job by ID
   */
  static async getSingleJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const job = await JobService.getSingleJob(id);
      if (!job) {
        return createError(res, { status: 404, message: "Job not found" });
      }

      return createResponse(res, "ok", "Job retrieved successfully.", job);
    } catch (error) {
      return createError(res, error);
    }
  }

  /**
   * @description Get a single job by ID
   */
  static async getJobsCountByStatus(req: Request, res: Response) {
    try {
      const userId = (req.user as IUser)?._id;

      if (!userId) {
        return createError(res, {
          status: 404,
          message: "UserId is required",
        });
      }
      const counts = await JobService.getJobsCountByStatus(userId);
      if (!counts) {
        return createError(res, {
          status: 404,
          message: "Jobs data not found",
        });
      }

      return createResponse(
        res,
        "ok",
        "Jobs count retrieved successfully.",
        counts
      );
    } catch (error) {
      return createError(res, error);
    }
  }
}
