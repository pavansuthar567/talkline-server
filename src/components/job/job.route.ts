import express, { Request, Response } from "express";
import JobController from "./job.controller";
import AuthMiddleware from "../auth/auth.validation";
import JobValidations from "./job.validation";

const router = express.Router();

/**
 * @route GET /api/v1/jobs
 * @description Get all jobs
 * @returns JSON
 * @access private
 */
router.get(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  JobValidations.getJobs, // Optional validation for query params
  (req: Request, res: Response) => {
    JobController.getJobs(req, res);
  }
);

/**
 * @route POST /api/v1/jobs
 * @description Create a new job
 * @returns JSON
 * @access private
 */
router.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  JobValidations.createJob,
  (req: Request, res: Response) => {
    JobController.createJob(req, res);
  }
);

/**
 * @route GET /api/v1/jobs/:id
 * @description Get a single job
 * @returns JSON
 * @access private
 */
router.get(
  "/count-by-status",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    JobController.getJobsCountByStatus(req, res);
  }
);

/**
 * @route PUT /api/v1/jobs/:id
 * @description Update a job
 * @returns JSON
 * @access private
 */
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  JobValidations.updateJob,
  (req: Request, res: Response) => {
    JobController.updateJob(req, res);
  }
);

/**
 * @route DELETE /api/v1/jobs/:id
 * @description Delete a job
 * @returns JSON
 * @access private
 */
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  JobValidations.deleteJob,
  (req: Request, res: Response) => {
    JobController.deleteJob(req, res);
  }
);

/**
 * @route GET /api/v1/jobs/:id
 * @description Get a single job
 * @returns JSON
 * @access private
 */
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  JobValidations.getSingleJob,
  (req: Request, res: Response) => {
    JobController.getSingleJob(req, res);
  }
);

const jobRoutes = router;
export default jobRoutes;
