import express, { Request, Response } from "express";
import ResumeController from "./resume.controller";
import AuthMiddleware from "../auth/auth.validation";
import ResumeValidations from "./resume.validation";

const router = express.Router();

router.post(
  "/craft/:job_id?",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  ResumeValidations.generateResume,
  (req: Request, res: Response) => {
    ResumeController.generateResume(req, res);
  }
);

router.get(
  "/job/:job_id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    ResumeController.getResumesByJob(req, res);
  }
);

router.get(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    ResumeController.getAllResumes(req, res);
  }
);

router.get(
  "/export/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    ResumeController.exportResume(req, res);
  }
);

router.put(
  "/:resume_id?",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  ResumeValidations.updateResume,
  (req: Request, res: Response) => {
    ResumeController.updateResume(req, res);
  }
);

const resumeRoutes = router;
export default resumeRoutes;
