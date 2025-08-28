import { Router } from "express";
import { apiRateLimiter } from "../../middleware/rateLimiter";
import AIController from "./ai.controller";

const router = Router();

router.post("/generate-resume", apiRateLimiter, AIController.generateResume);

export default router;
