import { Request, Response } from "express";
import UserService from "../../services/user";
import { createError, createResponse } from "../../helpers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../../config/passport";
import OtpService from "../../services/otp";
import { IUser, UserModel } from "../../models/user";
import EmailService from "../../services/email";
import AuthService from "../../services/auth";

export default class AuthController {
  /**
   * @route POST /api/v1/auth/sign-in
   * @description Authenticate user and return token
   * @access Public
   */
  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.getUserByEmail(email?.toLowerCase());
      if (!user) {
        return createError(res, "User not found", { code: "AUTH_001" }, 401);
      }

      if (!(await bcrypt.compare(password, user?.password))) {
        return createError(
          res,
          "Invalid email or password",
          { code: "AUTH_001" },
          401
        );
      }

      if (!JWT_SECRET) {
        return createError(
          res,
          "JWT Secret is not configured properly",
          { code: "SERVER_001" },
          500
        );
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "24h",
      });

      // Store the token in the user's record
      await UserService.updateUser(user.id, { token });

      const obj = user.toObject() as Partial<IUser>;
      delete obj.password;
      return createResponse(res, "ok", "Login successfully", { ...obj, token });
    } catch (error) {
      return createError(
        res,
        error,
        { code: "AUTH_002", returnStackTrace: true },
        500
      );
    }
  }

  /**
   * @route POST /api/v1/auth/forgot-password
   * @description Initiate password reset process
   * @access Public
   */
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return createError(res, "User not found", { code: "AUTH_003" }, 404);
      }

      const otpCode = OtpService.generateOtp();
      await OtpService.saveOtp(user.email, otpCode);

      // TODO: Implement email/SMS notification to send the OTP.
      await EmailService.sendEmail(
        user.email,
        "Password Reset Request",
        `Hello ${user.name},\n\nYour OTP for password reset is: ${otpCode}\n\nThis OTP is valid for 10 minutes.`
      );

      return createResponse(
        res,
        "ok",
        "OTP sent successfully to registered email",
        {}
      );
    } catch (error) {
      return createError(
        res,
        error,
        { code: "AUTH_004", returnStackTrace: true },
        500
      );
    }
  }

  /**
   * @route POST /api/v1/auth/verify-otp
   * @description Verify OTP for password reset
   * @access Public
   */
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return createError(res, "User not found", { code: "AUTH_005" }, 404);
      }

      const isOtpValid = await OtpService.verifyOtp(user.email, otp);
      if (!isOtpValid) {
        return createError(
          res,
          "Invalid or expired OTP",
          { code: "AUTH_006" },
          400
        );
      }

      if (!JWT_SECRET) {
        return createError(
          res,
          "JWT Secret is not configured properly",
          { code: "SERVER_001" },
          500
        );
      }

      const reset_token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const resetTokenExpiresAt = new Date();
      resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1);

      await UserService.updateUser(user._id, {
        reset_token,
        reset_token_expires_at: resetTokenExpiresAt,
      });

      return createResponse(res, "ok", "OTP verified successfully", {
        reset_token,
      });
    } catch (error) {
      return createError(
        res,
        error,
        { code: "AUTH_007", returnStackTrace: true },
        500
      );
    }
  }

  /**
   * @route POST /api/v1/auth/reset-password
   * @description Reset user password
   * @access Public
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const { new_password, reset_token } = req.body;

      if (!reset_token) {
        return createError(
          res,
          "Reset token is required",
          { code: "AUTH_011" },
          400
        );
      }
      const user = await UserModel.findOne({
        reset_token,
        reset_token_expires_at: { $gt: new Date() }, // Check if token is not expired
      });
      if (!user) {
        return createError(
          res,
          "Invalid or expired reset token",
          { code: "AUTH_012" },
          400
        );
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await UserService.updateUser(user._id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null,
      });

      return createResponse(res, "ok", "Password reset successfully", {});
    } catch (error) {
      return createError(
        res,
        error,
        { code: "AUTH_010", returnStackTrace: true },
        500
      );
    }
  }

  /**
   * @route POST /api/v1/auth/logout
   * @description Log out user
   * @access Private
   */
  static async logout(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return createError(
          res,
          "Authorization header missing",
          { code: "AUTH_012" },
          401
        );
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return createError(
          res,
          "Token missing from authorization header",
          { code: "AUTH_013" },
          401
        );
      }

      if (!JWT_SECRET) {
        return createError(
          res,
          "JWT Secret is not configured properly",
          { code: "SERVER_001" },
          500
        );
      }
      const decodedToken: any = jwt.verify(token, JWT_SECRET as string);
      const userId = decodedToken.id;

      if (userId) {
        await AuthService.logout(userId);
      }
      return createResponse(res, "ok", "Logout successfully", {});
    } catch (error) {
      return createError(
        res,
        error,
        { code: "AUTH_011", returnStackTrace: true },
        500
      );
    }
  }
}
