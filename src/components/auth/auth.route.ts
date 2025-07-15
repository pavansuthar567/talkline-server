import express, { Request, Response } from "express";
import AuthController from "./auth.controller";
import UserValidations from "../user/user.validation";

const router = express.Router();

/**
 * @route POST /api/v1/auth/sign-in
 * @description Authenticate user and return token
 * @access Public
 */
router.post(
  "/login",
  UserValidations.loginUser,
  (req: Request, res: Response) => {
    AuthController.signIn(req, res);
  }
);

/**
 * @route POST /api/v1/auth/forgot-password
 * @description Initiate password reset process
 * @access Public
 */
router.post(
  "/forgot-password",
  UserValidations.forgotPassword,
  (req: Request, res: Response) => {
    AuthController.forgotPassword(req, res);
  }
);

/**
 * @route POST /api/v1/auth/reset-password
 * @description Reset user password
 * @access Public
 */
router.post(
  "/reset-password",
  UserValidations.resetPassword,
  (req: Request, res: Response) => {
    AuthController.resetPassword(req, res);
  }
);

/**
 * @route POST /api/v1/auth/verify-otp
 * @description Verify OTP for password reset
 * @access  Public
 */
router.post(
  "/verify-otp",
  UserValidations.verifyOtp,
  (req: Request, res: Response) => {
    AuthController.verifyOtp(req, res);
  }
);

/**
 * @route POST /api/v1/auth/logout
 * @description Log out user
 * @access Private
 */
router.post("/logout", (req: Request, res: Response) => {
  AuthController.logout(req, res);
});

const authRoutes = router;
export default authRoutes;
